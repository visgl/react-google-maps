/* eslint-disable complexity */
import React, {
  CSSProperties,
  PropsWithChildren,
  Ref,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react';

import {APIProviderContext, APIProviderContextValue} from '../api-provider';

import {useApiIsLoaded} from '../../hooks/use-api-is-loaded';
import {logErrorOnce} from '../../libraries/errors';
import {useCallbackRef} from '../../libraries/use-callback-ref';
import {MapEventProps, useMapEvents} from './use-map-events';
import {useMapOptions} from './use-map-options';
import {useTrackedCameraStateRef} from './use-tracked-camera-state-ref';
import {useApiLoadingStatus} from '../../hooks/use-api-loading-status';
import {APILoadingStatus} from '../../libraries/api-loading-status';
import {
  DeckGlCompatProps,
  useDeckGLCameraUpdate
} from './use-deckgl-camera-update';
import {isLatLngLiteral} from '../../libraries/is-lat-lng-literal';
import {useMapCameraParams} from './use-map-camera-params';
import {AuthFailureMessage} from './auth-failure-message';

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
  heading: number;
  tilt: number;
};

/**
 * Props for the Google Maps Map Component
 */
export type MapProps = google.maps.MapOptions &
  MapEventProps &
  DeckGlCompatProps & {
    id?: string;
    style?: CSSProperties;
    className?: string;
    initialBounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    controlled?: boolean;
  };

export const Map = (props: PropsWithChildren<MapProps>) => {
  const {children, id, className, style, controlled = false} = props;

  const context = useContext(APIProviderContext);
  const loadingStatus = useApiLoadingStatus();

  if (!context) {
    throw new Error(
      '<Map> can only be used inside an <ApiProvider> component.'
    );
  }

  const [map, mapRef] = useMapInstance(props, context);
  const cameraStateRef = useTrackedCameraStateRef();

  useMapCameraParams(map, cameraStateRef, props);
  useMapEvents(map, cameraStateRef, props);
  useMapOptions(map, props);

  const isDeckGlControlled = useDeckGLCameraUpdate(map, props);

  // disable interactions with the map for controlled modes
  useEffect(() => {
    if (!map) return;

    // fixme: this doesn't seem to belong here (and it's mostly there for convenience anyway).
    //   The reasoning is that a deck.gl canvas will be put on top of the map, rendering
    //   any default map controls pretty much useless
    if (isDeckGlControlled) {
      map.setOptions({disableDefaultUI: true});
    }

    // disable all control-inputs when map is controlled
    if (isDeckGlControlled || controlled) {
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
    controlled,
    props.gestureHandling,
    props.keyboardShortcuts
  ]);

  // in controlled mode, any change to the camera state that isn't reflected in the props has to be prevented
  const center = props.center
    ? isLatLngLiteral(props.center)
      ? props.center
      : props.center.toJSON()
    : null;

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

  // controlled mode: reject all camera changes that don't correspond to changes in props
  useLayoutEffect(() => {
    if (!map || !controlled) return;

    map.moveCamera(cameraOptions);
    const listener = map.addListener('bounds_changed', () => {
      map.moveCamera(cameraOptions);
    });

    return () => listener.remove();
  }, [map, controlled, cameraOptions]);

  const combinedStyle: CSSProperties = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      // when using deckgl, the map should be sent to the back
      zIndex: isDeckGlControlled ? -1 : 0,

      ...style
    }),
    [style, isDeckGlControlled]
  );

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
        <GoogleMapsContext.Provider value={{map}}>
          {children}
        </GoogleMapsContext.Provider>
      ) : null}
    </div>
  );
};
Map.deckGLViewProps = true;

/**
 * The main hook takes care of creating map-instances and registering them in
 * the api-provider context.
 * @return a tuple of the map-instance created (or null) and the callback
 *   ref that will be used to pass the map-container into this hook.
 * @internal
 */
function useMapInstance(
  props: MapProps,
  context: APIProviderContextValue
): readonly [map: google.maps.Map | null, containerRef: Ref<HTMLDivElement>] {
  const apiIsLoaded = useApiIsLoaded();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [container, containerRef] = useCallbackRef<HTMLDivElement>();

  const {
    id,
    initialBounds,

    ...mapOptions
  } = props;

  // create the map instance and register it in the context
  useEffect(
    () => {
      if (!container || !apiIsLoaded) return;

      const {addMapInstance, removeMapInstance} = context;
      const newMap = new google.maps.Map(container, mapOptions);

      setMap(newMap);
      addMapInstance(newMap, id);

      if (initialBounds) {
        newMap.fitBounds(initialBounds);
      }

      return () => {
        if (!container || !apiIsLoaded) return;

        // remove all event-listeners to minimize memory-leaks
        google.maps.event.clearInstanceListeners(newMap);

        setMap(null);
        removeMapInstance(id);
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, container, apiIsLoaded, props.mapId]
  );

  // report an error if the same map-id is used multiple times
  useEffect(() => {
    if (!id) return;

    const {mapInstances} = context;

    if (mapInstances[id] && mapInstances[id] !== map) {
      logErrorOnce(
        `The map id '${id}' seems to have been used multiple times. ` +
          'This can lead to unexpected problems when accessing the maps. ' +
          'Please use unique ids for all <Map> components.'
      );
    }
  }, [id, context, map]);

  return [map, containerRef] as const;
}
