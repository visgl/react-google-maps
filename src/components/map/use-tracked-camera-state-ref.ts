import {MutableRefObject, useRef} from 'react';
import {MapCameraChangedEvent, MapEvent} from './use-map-events';

export type CameraState = {
  center: google.maps.LatLngLiteral;
  heading: number;
  tilt: number;
  zoom: number;
};

export type CameraStateRef = MutableRefObject<CameraState>;

/**
 * Creates a mutable ref object to track the last known state of the map camera.
 * This is updated by `trackDispatchedEvent` and used in `useMapOptions`.
 */
export function useTrackedCameraStateRef(): CameraStateRef {
  return useRef<CameraState>({
    center: {lat: 0, lng: 0},
    heading: 0,
    tilt: 0,
    zoom: 0
  });
}

/**
 * Records camera data from the last event dispatched to the React application.
 * This data can then be used to prevent feeding these values back to the
 * map-instance when a typical "controlled component" setup (state variable is
 * fed into and updated by the map).
 */
export function trackDispatchedEvent(
  ev: MapEvent,
  cameraStateRef: CameraStateRef
) {
  const cameraEvent = ev as MapCameraChangedEvent;

  // we're only interested in the camera-events here
  if (!cameraEvent.detail.center) return;
  const {center, zoom, heading, tilt} = cameraEvent.detail;

  cameraStateRef.current.center = center;
  cameraStateRef.current.heading = heading;
  cameraStateRef.current.tilt = tilt;
  cameraStateRef.current.zoom = zoom;
}
