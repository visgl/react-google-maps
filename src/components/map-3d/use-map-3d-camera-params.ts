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
 * Compares props to the tracked camera state and updates the map if different.
 *
 * This follows the same pattern as the regular Map component's useMapCameraParams.
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

  // This effect runs on every render and checks if there are differences
  // between the known state of the map (cameraStateRef, updated by events)
  // and the desired state in props.
  useLayoutEffect(() => {
    if (!map3d) return;

    const state = cameraStateRef.current;

    const nextCamera: {
      center?: google.maps.LatLngAltitudeLiteral;
      range?: number;
      heading?: number;
      tilt?: number;
    } = {};
    let needsUpdate = false;

    // Check center
    if (
      lat !== null &&
      lng !== null &&
      (state.center.lat !== lat ||
        state.center.lng !== lng ||
        (altitude !== null && state.center.altitude !== altitude))
    ) {
      nextCamera.center = {
        lat,
        lng,
        altitude: altitude ?? state.center.altitude ?? 0
      };
      needsUpdate = true;
    }

    // Check range
    if (range !== null && state.range !== range) {
      nextCamera.range = range;
      needsUpdate = true;
    }

    // Check heading
    if (heading !== null && state.heading !== heading) {
      nextCamera.heading = heading;
      needsUpdate = true;
    }

    // Check tilt
    if (tilt !== null && state.tilt !== tilt) {
      nextCamera.tilt = tilt;
      needsUpdate = true;
    }

    // Check roll (handled separately since flyCameraTo doesn't support it)
    if (roll !== null && state.roll !== roll) {
      map3d.roll = roll;
    }

    if (needsUpdate) {
      // Use flyCameraTo with 0 duration for instant camera updates.
      // Direct property assignment doesn't reliably trigger visual updates
      // after manual user interaction due to Map3D's internal dirty-checking.
      // Cast to 'any' because flyCameraTo may not be in @types/google.maps yet.
      (map3d as any).flyCameraTo({
        endCamera: {
          center: nextCamera.center ?? state.center,
          range: nextCamera.range ?? state.range,
          heading: nextCamera.heading ?? state.heading,
          tilt: nextCamera.tilt ?? state.tilt
        },
        durationMillis: 0
      });
    }
  });
}
