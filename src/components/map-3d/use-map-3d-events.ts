import {useEffect} from 'react';

/**
 * Base event type for all Map3D events.
 */
export interface Map3DEvent {
  type: string;
  map3d: google.maps.maps3d.Map3DElement;
}

/**
 * Event fired when a camera property changes.
 */
export interface Map3DCameraChangedEvent extends Map3DEvent {
  detail: {
    center: google.maps.LatLngAltitudeLiteral;
    range: number;
    heading: number;
    tilt: number;
    roll: number;
  };
}

/**
 * Event fired when the map is clicked.
 */
export interface Map3DClickEvent extends Map3DEvent {
  detail: {
    position: google.maps.LatLngAltitude | null;
    placeId?: string;
  };
}

/**
 * Event fired when the map's steady state changes.
 */
export interface Map3DSteadyChangeEvent extends Map3DEvent {
  detail: {
    isSteady: boolean;
  };
}

/**
 * Props for Map3D event handlers.
 */
export interface Map3DEventProps {
  /** Called when the center property changes. */
  onCenterChanged?: (event: Map3DCameraChangedEvent) => void;
  /** Called when the heading property changes. */
  onHeadingChanged?: (event: Map3DCameraChangedEvent) => void;
  /** Called when the tilt property changes. */
  onTiltChanged?: (event: Map3DCameraChangedEvent) => void;
  /** Called when the range property changes. */
  onRangeChanged?: (event: Map3DCameraChangedEvent) => void;
  /** Called when the roll property changes. */
  onRollChanged?: (event: Map3DCameraChangedEvent) => void;
  /** Called when any camera property changes (aggregated). */
  onCameraChanged?: (event: Map3DCameraChangedEvent) => void;
  /** Called when the map is clicked. */
  onClick?: (event: Map3DClickEvent) => void;
  /** Called when the map's steady state changes. */
  onSteadyChange?: (event: Map3DSteadyChangeEvent) => void;
  /** Called when a fly animation ends. */
  onAnimationEnd?: (event: Map3DEvent) => void;
  /** Called when a map error occurs. */
  onError?: (event: Map3DEvent) => void;
}

/**
 * Mapping from prop names to DOM event names.
 */
const EVENT_MAP: Record<keyof Map3DEventProps, string> = {
  onCenterChanged: 'gmp-centerchange',
  onHeadingChanged: 'gmp-headingchange',
  onTiltChanged: 'gmp-tiltchange',
  onRangeChanged: 'gmp-rangechange',
  onRollChanged: 'gmp-rollchange',
  onCameraChanged: '', // Special case: synthetic event
  onClick: 'gmp-click',
  onSteadyChange: 'gmp-steadychange',
  onAnimationEnd: 'gmp-animationend',
  onError: 'gmp-error'
};

/**
 * Camera-related event types for the aggregated onCameraChanged handler.
 */
const CAMERA_EVENTS = [
  'gmp-centerchange',
  'gmp-headingchange',
  'gmp-tiltchange',
  'gmp-rangechange',
  'gmp-rollchange'
];

/**
 * Creates a camera changed event with current camera state.
 */
function createCameraEvent(
  map3d: google.maps.maps3d.Map3DElement,
  type: string
): Map3DCameraChangedEvent {
  const center = map3d.center;

  // Normalize center to LatLngAltitudeLiteral
  // If center is a LatLngAltitude class instance, it has a toJSON method
  // Otherwise it's already a literal object
  let centerLiteral: google.maps.LatLngAltitudeLiteral;
  if (center && 'toJSON' in center && typeof center.toJSON === 'function') {
    centerLiteral = (center as google.maps.LatLngAltitude).toJSON();
  } else if (center) {
    centerLiteral = center as google.maps.LatLngAltitudeLiteral;
  } else {
    centerLiteral = {lat: 0, lng: 0, altitude: 0};
  }

  return {
    type,
    map3d,
    detail: {
      center: centerLiteral,
      range: map3d.range || 0,
      heading: map3d.heading || 0,
      tilt: map3d.tilt || 0,
      roll: map3d.roll || 0
    }
  };
}

/**
 * Creates a click event from a LocationClickEvent or PlaceClickEvent.
 */
function createClickEvent(
  map3d: google.maps.maps3d.Map3DElement,
  srcEvent:
    | google.maps.maps3d.LocationClickEvent
    | google.maps.maps3d.PlaceClickEvent
): Map3DClickEvent {
  const placeClickEvent = srcEvent as google.maps.maps3d.PlaceClickEvent;

  return {
    type: 'gmp-click',
    map3d,
    detail: {
      position: srcEvent.position || null,
      placeId: placeClickEvent.placeId
    }
  };
}

/**
 * Creates a steady change event.
 */
function createSteadyChangeEvent(
  map3d: google.maps.maps3d.Map3DElement,
  srcEvent: google.maps.maps3d.SteadyChangeEvent
): Map3DSteadyChangeEvent {
  return {
    type: 'gmp-steadychange',
    map3d,
    detail: {
      isSteady: srcEvent.isSteady
    }
  };
}

/**
 * Hook to set up event handlers for Map3D events.
 *
 * @internal
 */
export function useMap3DEvents(
  map3d: google.maps.maps3d.Map3DElement | null,
  props: Map3DEventProps
) {
  const {
    onCenterChanged,
    onHeadingChanged,
    onTiltChanged,
    onRangeChanged,
    onRollChanged,
    onCameraChanged,
    onClick,
    onSteadyChange,
    onAnimationEnd,
    onError
  } = props;

  // Individual camera events
  useMap3DEvent(map3d, 'gmp-centerchange', onCenterChanged, createCameraEvent);
  useMap3DEvent(
    map3d,
    'gmp-headingchange',
    onHeadingChanged,
    createCameraEvent
  );
  useMap3DEvent(map3d, 'gmp-tiltchange', onTiltChanged, createCameraEvent);
  useMap3DEvent(map3d, 'gmp-rangechange', onRangeChanged, createCameraEvent);
  useMap3DEvent(map3d, 'gmp-rollchange', onRollChanged, createCameraEvent);

  // Aggregated camera changed event
  useEffect(() => {
    if (!map3d || !onCameraChanged) return;

    const handler = () => {
      onCameraChanged(createCameraEvent(map3d, 'camerachange'));
    };

    for (const eventName of CAMERA_EVENTS) {
      map3d.addEventListener(eventName, handler);
    }

    return () => {
      for (const eventName of CAMERA_EVENTS) {
        map3d.removeEventListener(eventName, handler);
      }
    };
  }, [map3d, onCameraChanged]);

  // Click event
  useEffect(() => {
    if (!map3d || !onClick) return;

    const handler = (ev: Event) => {
      onClick(
        createClickEvent(
          map3d,
          ev as
            | google.maps.maps3d.LocationClickEvent
            | google.maps.maps3d.PlaceClickEvent
        )
      );
    };

    map3d.addEventListener('gmp-click', handler);
    return () => map3d.removeEventListener('gmp-click', handler);
  }, [map3d, onClick]);

  // Steady change event
  useEffect(() => {
    if (!map3d || !onSteadyChange) return;

    const handler = (ev: Event) => {
      onSteadyChange(
        createSteadyChangeEvent(
          map3d,
          ev as google.maps.maps3d.SteadyChangeEvent
        )
      );
    };

    map3d.addEventListener('gmp-steadychange', handler);
    return () => map3d.removeEventListener('gmp-steadychange', handler);
  }, [map3d, onSteadyChange]);

  // Animation end event
  useMap3DEvent(map3d, 'gmp-animationend', onAnimationEnd, (map3d, type) => ({
    type,
    map3d
  }));

  // Error event
  useMap3DEvent(map3d, 'gmp-error', onError, (map3d, type) => ({
    type,
    map3d
  }));
}

/**
 * Helper hook for individual events.
 */
function useMap3DEvent<T extends Map3DEvent>(
  map3d: google.maps.maps3d.Map3DElement | null,
  eventName: string,
  handler: ((event: T) => void) | undefined,
  createEvent: (map3d: google.maps.maps3d.Map3DElement, type: string) => T
) {
  useEffect(() => {
    if (!map3d || !handler) return;

    const listener = () => {
      handler(createEvent(map3d, eventName));
    };

    map3d.addEventListener(eventName, listener);
    return () => map3d.removeEventListener(eventName, listener);
  }, [map3d, eventName, handler, createEvent]);
}
