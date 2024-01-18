/* eslint-disable complexity */
import React, {
  CSSProperties,
  PropsWithChildren,
  Ref,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import {APIProviderContext, APIProviderContextValue} from '../api-provider';

import {useApiIsLoaded} from '../../hooks/use-api-is-loaded';
import {logErrorOnce} from '../../libraries/errors';
import {useCallbackRef} from '../../libraries/use-callback-ref';
import {MapEventProps, useMapEvents} from './use-map-events';
import {useMapOptions} from './use-map-options';
import {useDeckGLCameraUpdate} from './use-deckgl-camera-update';
import {useInternalCameraState} from './use-internal-camera-state';
import {useApiLoadingStatus} from '../../hooks/use-api-loading-status';
import {APILoadingStatus} from '../../libraries/api-loading-status';

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

/**
 * Props for the Google Maps Map Component
 */
export type MapProps = google.maps.MapOptions &
  MapEventProps & {
    style?: CSSProperties;
    /**
     * Adds custom style to the map by passing a css class.
     */
    className?: string;
    /**
     * Adds initial bounds to the map as an alternative to specifying the center/zoom of the map.
     * Calls the fitBounds method internally https://developers.google.com/maps/documentation/javascript/reference/map?hl=en#Map-Methods
     */
    initialBounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    /**
     * An id that is added to the map. Needed when using more than one Map component.
     * This is also needed to reference the map inside the useMap hook.
     */
    id?: string;
    /**
     * Viewport from deck.gl
     */
    viewport?: unknown;
    /**
     * View state from deck.gl
     */
    viewState?: Record<string, unknown>;
    /**
     * Initial View State from deck.gl
     */
    initialViewState?: Record<string, unknown>;
  };

/**
 * Component to render a Google Maps map
 */
export const Map = (props: PropsWithChildren<MapProps>) => {
  const {children, id, className, style, viewState, viewport} = props;

  const context = useContext(APIProviderContext);
  const loadingStatus = useApiLoadingStatus();

  if (!context) {
    throw new Error(
      '<Map> can only be used inside an <ApiProvider> component.'
    );
  }

  const [map, mapRef] = useMapInstance(props, context);
  const cameraStateRef = useInternalCameraState();
  useMapOptions(map, cameraStateRef, props);
  useMapEvents(map, cameraStateRef, props);
  useDeckGLCameraUpdate(map, viewState);

  const isViewportSet = useMemo(() => Boolean(viewport), [viewport]);
  const combinedStyle: CSSProperties = useMemo(
    () => ({
      width: '100%',
      height: '100%',

      // when using deckgl, the map should be sent to the back
      zIndex: isViewportSet ? -1 : 0,
      ...style
    }),
    [style, isViewportSet]
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

const AuthFailureMessage = () => {
  const style: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 999,
    display: 'flex',
    flexFlow: 'column nowrap',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: '.8rem',
    color: 'rgba(0,0,0,0.6)',
    background: '#dddddd',
    padding: '1rem 1.5rem'
  };

  return (
    <div style={style}>
      <h2>Error: AuthFailure</h2>
      <p>
        A problem with your API key prevents the map from rendering correctly.
        Please make sure the value of the <code>APIProvider.apiKey</code> prop
        is correct. Check the error-message in the console for further details.
      </p>
    </div>
  );
};

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

    // FIXME: we should rethink if it could be possible to keep the state
    //   around when a map gets re-initialized (id or mapId changed). This
    //   should keep the viewport as it is (so also no initial viewport in
    //   this case) and any added features should of course get re-added as
    //   well.

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
