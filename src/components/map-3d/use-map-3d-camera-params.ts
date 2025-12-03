import {useLayoutEffect} from 'react';

import {CameraStateRef3D} from './use-tracked-camera-state-ref-3d';
import {Map3DProps} from './index';

/**
 * Converts a LatLngAltitude or LatLngAltitudeLiteral to a literal object.
 */
function toLatLngAltitudeLiteral(
  value:
    | google.maps.LatLngAltitude
    | google.maps.LatLngAltitudeLiteral
    | undefined
    | null
): google.maps.LatLngAltitudeLiteral | null {
  if (!value) return null;

  // Check if it's a LatLngAltitude object with toJSON method
  if ('toJSON' in value && typeof value.toJSON === 'function') {
    return value.toJSON();
  }

  return value as google.maps.LatLngAltitudeLiteral;
}

/**
 * Hook to update Map3D camera parameters when props change.
 * Compares the current camera state with props and updates only when there are differences.
 *
 * @internal
 */
export function useMap3DCameraParams(
  map3d: google.maps.maps3d.Map3DElement | null,
  cameraStateRef: CameraStateRef3D,
  props: Map3DProps
) {
  const centerLiteral = toLatLngAltitudeLiteral(props.center);

  const lat = centerLiteral?.lat ?? null;
  const lng = centerLiteral?.lng ?? null;
  const altitude = centerLiteral?.altitude ?? null;

  const range = props.range ?? null;
  const heading = props.heading ?? null;
  const tilt = props.tilt ?? null;
  const roll = props.roll ?? null;

  // This effect runs on every render to check for camera differences
  useLayoutEffect(() => {
    if (!map3d) return;

    const currentState = cameraStateRef.current;
    let needsUpdate = false;

    // Check center
    if (
      lat !== null &&
      lng !== null &&
      (currentState.center.lat !== lat ||
        currentState.center.lng !== lng ||
        (altitude !== null && currentState.center.altitude !== altitude))
    ) {
      map3d.center = {
        lat,
        lng,
        altitude: altitude ?? currentState.center.altitude ?? 0
      };
      needsUpdate = true;
    }

    // Check range
    if (range !== null && currentState.range !== range) {
      map3d.range = range;
      needsUpdate = true;
    }

    // Check heading
    if (heading !== null && currentState.heading !== heading) {
      map3d.heading = heading;
      needsUpdate = true;
    }

    // Check tilt
    if (tilt !== null && currentState.tilt !== tilt) {
      map3d.tilt = tilt;
      needsUpdate = true;
    }

    // Check roll
    if (roll !== null && currentState.roll !== roll) {
      map3d.roll = roll;
      needsUpdate = true;
    }
  });
}
