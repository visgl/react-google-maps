import {useEffect} from 'react';
import {
  InternalCameraStateRef,
  trackDispatchedEvent
} from './use-internal-camera-state';

/**
 * Handlers for all events that could be emitted by map-instances.
 */
export type MapEventProps = Partial<{
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
 * Sets up effects to bind event-handlers for all event-props in MapEventProps.
 * @internal
 */
export function useMapEvents(
  map: google.maps.Map | null,
  cameraStateRef: InternalCameraStateRef,
  props: MapEventProps
) {
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

      const listener = google.maps.event.addListener(
        map,
        eventType,
        (ev?: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
          const mapEvent = createMapEvent(eventType, map, ev);

          trackDispatchedEvent(mapEvent, cameraStateRef);
          handler(mapEvent);
        }
      );

      return () => listener.remove();
    }, [map, cameraStateRef, eventType, handler]);
  }
}

/**
 * Create the wrapped map-events used for the event-props.
 * @param type the event type as it is specified to the maps api
 * @param map the map instance the event originates from
 * @param srcEvent the source-event if there is one.
 */
function createMapEvent(
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

/**
 * maps the camelCased names of event-props to the corresponding event-types
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

type MapEventPropName = keyof MapEventProps;
const eventPropNames = Object.keys(propNameToEventType) as MapEventPropName[];

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
