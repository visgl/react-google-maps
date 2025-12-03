import {MutableRefObject, RefObject, useEffect, useRef} from 'react';

import {useForceUpdate} from '../../hooks/use-force-update';

/**
 * Represents the 3D camera state with all position and orientation parameters.
 */
export type CameraState3D = {
  center: google.maps.LatLngAltitudeLiteral;
  range: number;
  heading: number;
  tilt: number;
  roll: number;
};

export type CameraStateRef3D = RefObject<CameraState3D>;

const DEFAULT_CAMERA_STATE: CameraState3D = {
  center: {lat: 0, lng: 0, altitude: 0},
  range: 0,
  heading: 0,
  tilt: 0,
  roll: 0
};

/**
 * Camera property names that correspond to gmp-*change events.
 */
const CAMERA_PROPS = ['center', 'range', 'heading', 'tilt', 'roll'] as const;
type CameraProp = (typeof CAMERA_PROPS)[number];

/**
 * Updates the camera state ref with values from the map element.
 */
function updateCameraState(
  map3d: google.maps.maps3d.Map3DElement,
  ref: CameraStateRef3D,
  prop: CameraProp
) {
  const value = map3d[prop];

  if (value == null) return;

  if (prop === 'center') {
    // The center property returns a LatLngAltitude object, convert to literal
    const center = value as google.maps.LatLngAltitude;
    ref.current.center = center.toJSON
      ? center.toJSON()
      : (center as google.maps.LatLngAltitudeLiteral);
  } else {
    ref.current[prop] = value as number;
  }
}

/**
 * Creates a mutable ref object to track the last known state of the 3D map camera.
 * This is used in `useMap3DCameraParams` to reduce stuttering by avoiding updates
 * of the map camera with values that have already been processed.
 *
 * @internal
 */
export function useTrackedCameraStateRef3D(
  map3d: google.maps.maps3d.Map3DElement | null
): CameraStateRef3D {
  const forceUpdate = useForceUpdate();
  const ref = useRef<CameraState3D>({...DEFAULT_CAMERA_STATE});

  useEffect(() => {
    if (!map3d) return;

    const listeners: (() => void)[] = [];

    for (const prop of CAMERA_PROPS) {
      const eventName = `gmp-${prop}change`;

      const handler = () => {
        updateCameraState(map3d, ref, prop);
        // Force update to allow controlled component pattern to work
        forceUpdate();
      };

      map3d.addEventListener(eventName, handler);
      listeners.push(() => map3d.removeEventListener(eventName, handler));
    }

    return () => {
      for (const removeListener of listeners) {
        removeListener();
      }
    };
  }, [map3d, forceUpdate]);

  return ref;
}
