import {useLayoutEffect} from 'react';
import {CameraStateRef} from './use-tracked-camera-state-ref';
import {MapProps} from '@vis.gl/react-google-maps';
import {isLatLngLiteral} from '../../libraries/is-lat-lng-literal';

export function useMapCameraParams(
  map: google.maps.Map | null,
  cameraStateRef: CameraStateRef,
  mapProps: MapProps
) {
  const center = mapProps.center
    ? isLatLngLiteral(mapProps.center)
      ? mapProps.center
      : mapProps.center.toJSON()
    : null;

  let lat: number | null = null;
  let lng: number | null = null;

  if (center && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
    lat = center.lat as number;
    lng = center.lng as number;
  }

  const zoom: number | null = Number.isFinite(mapProps.zoom)
    ? (mapProps.zoom as number)
    : null;
  const heading: number | null = Number.isFinite(mapProps.heading)
    ? (mapProps.heading as number)
    : null;
  const tilt: number | null = Number.isFinite(mapProps.tilt)
    ? (mapProps.tilt as number)
    : null;

  /* eslint-disable react-hooks/exhaustive-deps --
   *
   * The following effects aren't triggered when the map is changed.
   * In that case, the values will be or have been passed to the map
   * constructor via mapOptions.
   */
  useLayoutEffect(() => {
    if (!map) return;

    const nextCamera: google.maps.CameraOptions = {};
    let needsUpdate = false;

    if (
      lat !== null &&
      lng !== null &&
      (cameraStateRef.current.center.lat !== lat ||
        cameraStateRef.current.center.lng !== lng)
    ) {
      nextCamera.center = {lat, lng};
      needsUpdate = true;
    }

    if (zoom !== null && cameraStateRef.current.zoom !== zoom) {
      nextCamera.zoom = zoom as number;
      needsUpdate = true;
    }

    if (heading !== null && cameraStateRef.current.heading !== heading) {
      nextCamera.heading = heading as number;
      needsUpdate = true;
    }

    if (tilt !== null && cameraStateRef.current.tilt !== tilt) {
      nextCamera.tilt = tilt as number;
      needsUpdate = true;
    }

    if (needsUpdate) {
      map.moveCamera(nextCamera);
    }
  }, [cameraStateRef, lat, lng, zoom, heading, tilt]);
}
