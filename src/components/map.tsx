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

import {APIProviderContext, APIProviderContextValue} from './api-provider';

import {useApiIsLoaded} from '../hooks/use-api-is-loaded';
import {logErrorOnce} from '../libraries/errors';
import {useCallbackRef} from '../libraries/use-callback-ref';

export interface GoogleMapsContextValue {
  map: google.maps.Map | null;
}
export const GoogleMapsContext =
  React.createContext<GoogleMapsContextValue | null>(null);
/**
 * Handlers for all events that could be emitted by map-instances.
 */
type MapEventProps = Partial<{
  // map view state events
  onBoundsChanged: (event: MapCameraChangedEvent) => void;
  onCenterChanged: (event: MapCameraChangedEvent) => void;
  onHeadingChanged: (event: MapCameraChangedEvent) => void;
  onTiltChanged: (event: MapCameraChangedEvent) => void;
  onZoomChanged: (event: MapCameraChangedEvent) => void;
  onProjectionChanged: (event: MapCameraChangedEvent) => void;

  // mouse / touch / pointer events
  onClick: (event: MapMouseEvent) => void;
  onDblclick: (event: MapMouseEvent) => void;
  onContextmenu: (event: MapMouseEvent) => void;
  onMousemove: (event: MapMouseEvent) => void;
  onMouseover: (event: MapMouseEvent) => void;
  onMouseout: (event: MapMouseEvent) => void;
  onDrag: (event: MapEvent) => void;
  onDragend: (event: MapEvent) => void;
  onDragstart: (event: MapEvent) => void;

  // loading events
  onTilesLoaded: (event: MapEvent) => void;
  onIdle: (event: MapEvent) => void;

  // configuration events
  onIsFractionalZoomEnabledChanged: (event: MapEvent) => void;
  onMapCapabilitiesChanged: (event: MapEvent) => void;
  onMapTypeIdChanged: (event: MapEvent) => void;
  onRenderingTypeChanged: (event: MapEvent) => void;
}>;

/**
 * Maps the camelCased names of event-props to the corresponding event-types
 * used in the maps API.
 */
const propNameToEventType: {[prop in keyof Required<MapEventProps>]: string} = {
  onBoundsChanged: 'bounds_changed',
  onCenterChanged: 'center_changed',
  onClick: 'click',
  onContextmenu: 'contextmenu',
  onDblclick: 'dblclick',
  onDrag: 'drag',
  onDragend: 'dragend',
  onDragstart: 'dragstart',
  onHeadingChanged: 'heading_changed',
  onIdle: 'idle',
  onIsFractionalZoomEnabledChanged: 'isfractionalzoomenabled_changed',
  onMapCapabilitiesChanged: 'mapcapabilities_changed',
  onMapTypeIdChanged: 'maptypeid_changed',
  onMousemove: 'mousemove',
  onMouseout: 'mouseout',
  onMouseover: 'mouseover',
  onProjectionChanged: 'projection_changed',
  onRenderingTypeChanged: 'renderingtype_changed',
  onTilesLoaded: 'tilesloaded',
  onTiltChanged: 'tilt_changed',
  onZoomChanged: 'zoom_changed'
} as const;

type MapEventPropName = keyof MapEventProps;
const eventPropNames = Object.freeze(
  Object.keys(propNameToEventType) as MapEventPropName[]
);

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

  if (!context) {
    throw new Error(
      '<Map> can only be used inside an <ApiProvider> component.'
    );
  }

  const [map, mapRef] = useMapInstanceEffects(props, context);
  useMapOptionsEffects(map, props);
  useMapEvents(map, props);
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
function useMapInstanceEffects(
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

/**
 * Internal hook to update the map-options and view-parameters when
 * props are changed.
 * @internal
 */
function useMapOptionsEffects(map: google.maps.Map | null, mapProps: MapProps) {
  const {center, zoom, heading, tilt, ...mapOptions} = mapProps;

  /* eslint-disable react-hooks/exhaustive-deps --
   *
   * The following effects aren't triggered when the map is changed.
   * In that case, the values will be or have been passed to the map
   * constructor as mapOptions.
   */

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
  /* eslint-enable react-hooks/exhaustive-deps */
}

/**
 * Sets up effects to bind event-handlers for all event-props in MapEventProps.
 * @internal
 */
function useMapEvents(map: google.maps.Map | null, props: MapEventProps) {
  // note: calling a useEffect hook from within a loop is prohibited by the
  // rules of hooks, but it's ok here since it's unconditional and the number
  // and order of iterations is always strictly the same.
  // (see https://legacy.reactjs.org/docs/hooks-rules.html)

  for (const propName of eventPropNames) {
    // fixme: this cast is essentially a 'trust me, bro' for typescript, but
    //   a proper solution seems way too complicated right now
    const handler = props[propName] as (ev: MapEvent) => void;
    const eventType = propNameToEventType[propName];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!map) return;
      if (!handler) return;

      const listener = map.addListener(
        eventType,
        (ev?: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
          handler(createMapEvent(eventType, map, ev));
        }
      );

      return () => listener.remove();
    }, [map, eventType, handler]);
  }
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

export type MapEvent<T = unknown> = {
  type: string;
  map: google.maps.Map;
  detail: T;

  stoppable: boolean;
  stop: () => void;
  domEvent?: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event;
};

export type MapMouseEvent = MapEvent<{
  latLng: google.maps.LatLngLiteral | null;
  placeId: string | null;
}>;

export type MapCameraChangedEvent = MapEvent<{
  center: google.maps.LatLngLiteral;
  bounds: google.maps.LatLngBoundsLiteral;
  zoom: number;
  heading: number;
  tilt: number;
}>;

const cameraEventTypes = [
  'bounds_changed',
  'center_changed',
  'heading_changed',
  'projection_changed',
  'tilt_changed',
  'zoom_changed'
];

const mouseEventTypes = [
  'click',
  'contextmenu',
  'dblclick',
  'mousemove',
  'mouseout',
  'mouseover'
];

export function createMapEvent(
  type: string,
  map: google.maps.Map,
  srcEvent?: google.maps.MapMouseEvent | google.maps.IconMouseEvent
): MapEvent {
  const ev: MapEvent = {
    type,
    map,
    detail: {},
    stoppable: false,
    stop: () => {}
  };

  if (cameraEventTypes.includes(type)) {
    const camEvent = ev as MapCameraChangedEvent;

    const center = map.getCenter();
    const zoom = map.getZoom();
    const heading = map.getHeading() || 0;
    const tilt = map.getTilt() || 0;
    const bounds = map.getBounds();

    if (!center || !bounds || !Number.isFinite(zoom)) {
      console.warn(
        '[createEvent] at least one of the values from the map ' +
          'returned undefined. This is not expected to happen. Please ' +
          'report an issue at https://github.com/visgl/react-google-maps/issues/new'
      );
    }

    camEvent.detail = {
      center: center?.toJSON() || {lat: 0, lng: 0},
      zoom: zoom as number,
      heading: heading as number,
      tilt: tilt as number,
      bounds: bounds?.toJSON() || {
        north: 90,
        east: 180,
        south: -90,
        west: -180
      }
    };

    return camEvent;
  } else if (mouseEventTypes.includes(type)) {
    if (!srcEvent)
      throw new Error('[createEvent] mouse events must provide a srcEvent');
    const mouseEvent = ev as MapMouseEvent;

    mouseEvent.domEvent = srcEvent.domEvent;
    mouseEvent.stoppable = true;
    mouseEvent.stop = () => srcEvent.stop();

    mouseEvent.detail = {
      latLng: srcEvent.latLng?.toJSON() || null,
      placeId: (srcEvent as google.maps.IconMouseEvent).placeId
    };

    return mouseEvent;
  }

  return ev;
}
