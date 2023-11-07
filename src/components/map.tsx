/* eslint-disable complexity */
import React, {
  CSSProperties,
  PropsWithChildren,
  Ref,
  RefCallback,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react';

import {APIProviderContext, APIProviderContextValue} from './api-provider';

import {useApiIsLoaded} from '../hooks/use-api-is-loaded';
import {logErrorOnce} from '../libraries/errors';
import {useCallbackRef} from '../libraries/use-callback-ref';

// Google Maps context
export interface GoogleMapsContextValue {
  map: google.maps.Map | null;
}

export const GoogleMapsContext =
  React.createContext<GoogleMapsContextValue | null>(null);

/**
 * Props for the Google Maps Map Component
 */
export type MapProps = google.maps.MapOptions & {
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
   *  A callback function that is called, when the Google Map is loaded.
   */
  onLoadMap?: (map: google.maps.Map) => void;
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

  const context = useContext(APIProviderContext) as APIProviderContextValue;

  if (!context) {
    throw new Error(
      '<Map> can only be used inside an <ApiProvider> component.'
    );
  }

  const [map, mapRef] = useMapInstanceHandlerEffects(props, context);
  useMapOptionsEffects(map, props);
  useDeckGLCameraUpdateEffect(map, viewState);

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
function useMapInstanceHandlerEffects(
  props: MapProps,
  context: APIProviderContextValue
): readonly [map: google.maps.Map | null, containerRef: Ref<HTMLDivElement>] {
  const apiIsLoaded = useApiIsLoaded();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [container, containerRef] = useCallbackRef<HTMLDivElement>();

  const {
    id,
    initialBounds,
    onLoadMap,
    // FIXME: this destructuring here leads to mapOptions being a new
    //   object for every render, and we'll be calling map.setOptions() a lot.
    ...mapOptions
  } = props;

  // create the map instance and register it in the context
  useEffect(
    () => {
      // this will be called a couple of times before the dependencies are
      // actually ready to create the map
      if (!container || !apiIsLoaded) return;

      // Since we can't know the map-ids used in sibling components during
      // rendering, we can't check for existing maps with the same id here.
      // We do have a seperate hook below that keeps an eye on mapIds and will
      // write an error-message to the console if reused ids are detected.
      const {addMapInstance, removeMapInstance} = context;
      const newMap = new google.maps.Map(container, mapOptions);
      setMap(newMap);
      addMapInstance(newMap, id);

      if (onLoadMap) {
        google.maps.event.addListenerOnce(newMap, 'idle', () => {
          onLoadMap(newMap);
        });
      }

      if (initialBounds) {
        newMap.fitBounds(initialBounds);
      }

      return () => {
        if (!container || !apiIsLoaded) return;

        google.maps.event.clearInstanceListeners(container);

        setMap(null);
        removeMapInstance(id);
      };
    },

    // Dependencies need to be inaccurately limited here. The cleanup function
    // will remove the map-instance with all its internal state, and we can't
    // have that happening. This is only ok when the id or mapId is changed,
    // since this requires a new map to be created anyway.

    // FIXME: we should rethink if it could be possible to keep the state
    //   around when a map gets re-initialized (id or mapId changed). This
    //   should keep the viewport as it is (so also no initial viewport in
    //   this case) and any added features should of course stay as well (though
    //   that is for those components to figure out to always be attached to
    //   the correct map-instance from the context) .

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, container, apiIsLoaded, props.mapId]
  );

  // report an error if the same map-id is used multiple times
  useEffect(() => {
    if (!id) {
      return;
    }

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

/**
 * Internal hook to update the map-options and view-parameters when
 * props are changed.
 */
function useMapOptionsEffects(map: google.maps.Map | null, mapProps: MapProps) {
  const {center, zoom, heading, tilt, ...mapOptions} = mapProps;

  // All of these effects aren't triggered when the map is changed.
  // In that case, the values have already been passed to the map constructor.

  // update the map options when mapOptions is changed
  useEffect(() => {
    if (!map) return;

    // NOTE: passing a mapId to setOptions triggers an error-message we don't need to see here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {mapId, ...opts} = mapOptions;

    map.setOptions(opts);
  }, [mapProps]);

  useEffect(() => {
    if (!map || !center) return;

    map.setCenter(center);
  }, [center]);

  useEffect(() => {
    if (!map || !Number.isFinite(zoom)) return;

    map.setZoom(zoom as number);
  }, [zoom]);

  useEffect(() => {
    if (!map || !Number.isFinite(heading)) return;

    map.setHeading(heading as number);
  }, [heading]);

  useEffect(() => {
    if (!map || !Number.isFinite(tilt)) return;

    map.setTilt(tilt as number);
  }, [tilt]);
}

/**
 * Internal hook that updates the camera when deck.gl viewState changes.
 * @internal
 */
function useDeckGLCameraUpdateEffect(
  map: google.maps.Map | null,
  viewState: Record<string, unknown> | undefined
) {
  useLayoutEffect(() => {
    if (!map || !viewState) {
      return;
    }

    // FIXME: this should probably be extracted into a seperate hook that only
    //  runs once when first seeing a deck.gl viewState update and resets
    //  again. Maybe even use a seperate prop (`<Map controlled />`) instead.
    map.setOptions({
      gestureHandling: 'none',
      keyboardShortcuts: false,
      disableDefaultUI: true
    });

    const {
      latitude,
      longitude,
      bearing: heading,
      pitch: tilt,
      zoom
    } = viewState as Record<string, number>;

    map.moveCamera({
      center: {lat: latitude, lng: longitude},
      heading,
      tilt,
      zoom: zoom + 1
    });
  }, [map, viewState]);
}
