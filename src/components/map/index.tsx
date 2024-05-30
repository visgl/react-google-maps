/* eslint-disable complexity */
import React, {
  CSSProperties,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo
} from 'react';

import {APIProviderContext} from '../api-provider';

import {MapEventProps, useMapEvents} from './use-map-events';
import {useMapOptions} from './use-map-options';
import {useApiLoadingStatus} from '../../hooks/use-api-loading-status';
import {APILoadingStatus} from '../../libraries/api-loading-status';
import {
  DeckGlCompatProps,
  useDeckGLCameraUpdate
} from './use-deckgl-camera-update';
import {toLatLngLiteral} from '../../libraries/lat-lng-utils';
import {useMapCameraParams} from './use-map-camera-params';
import {AuthFailureMessage} from './auth-failure-message';
import {useMapInstance} from './use-map-instance';

export interface GoogleMapsContextValue {
  map: google.maps.Map | null;
}
export const GoogleMapsContext =
  React.createContext<GoogleMapsContextValue | null>(null);

export type {
  MapCameraChangedEvent,
  MapEvent,
  MapEventProps,
  MapMouseEvent
} from './use-map-events';

export type MapCameraProps = {
  center: google.maps.LatLngLiteral;
  zoom: number;
  heading?: number;
  tilt?: number;
};

/**
 * Props for the Map Component
 */
export type MapProps = google.maps.MapOptions &
  MapEventProps &
  DeckGlCompatProps & {
    /**
     * An id for the map, this is required when multiple maps are present
     * in the same APIProvider context.
     */
    id?: string;
    /**
     * Additional style rules to apply to the map dom-element.
     */
    style?: CSSProperties;
    /**
     * Additional css class-name to apply to the element containing the map.
     */
    className?: string;
    /**
     * Indicates that the map will be controlled externally. Disables all controls provided by the map itself.
     */
    controlled?: boolean;

    /**
     * Enable caching of map-instances created by this component.
     */
    reuseMaps?: boolean;

    defaultCenter?: google.maps.LatLngLiteral;
    defaultZoom?: number;
    defaultHeading?: number;
    defaultTilt?: number;
    /**
     * Alternative way to specify the default camera props as a geographic region that should be fully visible
     */
    defaultBounds?: google.maps.LatLngBoundsLiteral & {
      padding?: number | google.maps.Padding;
    };
  };

export const Map = (props: PropsWithChildren<MapProps>) => {
  const {children, id, className, style} = props;
  const context = useContext(APIProviderContext);
  const loadingStatus = useApiLoadingStatus();

  if (!context) {
    throw new Error(
      '<Map> can only be used inside an <ApiProvider> component.'
    );
  }

  const [map, mapRef, cameraStateRef] = useMapInstance(props, context);

  useMapCameraParams(map, cameraStateRef, props);
  useMapEvents(map, props);
  useMapOptions(map, props);

  const isDeckGlControlled = useDeckGLCameraUpdate(map, props);
  const isControlledExternally = !!props.controlled;

  // disable interactions with the map for externally controlled maps
  useEffect(() => {
    if (!map) return;

    // fixme: this doesn't seem to belong here (and it's mostly there for convenience anyway).
    //   The reasoning is that a deck.gl canvas will be put on top of the map, rendering
    //   any default map controls pretty much useless
    if (isDeckGlControlled) {
      map.setOptions({disableDefaultUI: true});
    }

    // disable all control-inputs when the map is controlled externally
    if (isDeckGlControlled || isControlledExternally) {
      map.setOptions({
        gestureHandling: 'none',
        keyboardShortcuts: false
      });
    }

    return () => {
      map.setOptions({
        gestureHandling: props.gestureHandling,
        keyboardShortcuts: props.keyboardShortcuts
      });
    };
  }, [
    map,
    isDeckGlControlled,
    isControlledExternally,
    props.gestureHandling,
    props.keyboardShortcuts
  ]);

  // setup a stable cameraOptions object that can be used as dependency
  const center = props.center ? toLatLngLiteral(props.center) : null;
  let lat: number | null = null;
  let lng: number | null = null;
  if (center && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
    lat = center.lat as number;
    lng = center.lng as number;
  }

  const cameraOptions: google.maps.CameraOptions = useMemo(() => {
    return {
      center: {lat: lat ?? 0, lng: lng ?? 0},
      zoom: props.zoom ?? 0,
      heading: props.heading ?? 0,
      tilt: props.tilt ?? 0
    };
  }, [lat, lng, props.zoom, props.heading, props.tilt]);

  // externally controlled mode: reject all camera changes that don't correspond to changes in props
  useLayoutEffect(() => {
    if (!map || !isControlledExternally) return;

    map.moveCamera(cameraOptions);
    const listener = map.addListener('bounds_changed', () => {
      map.moveCamera(cameraOptions);
    });

    return () => listener.remove();
  }, [map, isControlledExternally, cameraOptions]);

  const combinedStyle: CSSProperties = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      position: 'relative',
      // when using deckgl, the map should be sent to the back
      zIndex: isDeckGlControlled ? -1 : 0,

      ...style
    }),
    [style, isDeckGlControlled]
  );

  const contextValue: GoogleMapsContextValue = useMemo(() => ({map}), [map]);

  if (loadingStatus === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div
        style={{position: 'relative', ...(className ? {} : combinedStyle)}}
        className={className}>
        <AuthFailureMessage />
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      data-testid={'map'}
      style={className ? undefined : combinedStyle}
      className={className}
      {...(id ? {id} : {})}>
      {map ? (
        <GoogleMapsContext.Provider value={contextValue}>
          {children}
        </GoogleMapsContext.Provider>
      ) : null}
    </div>
  );
};
Map.deckGLViewProps = true;
