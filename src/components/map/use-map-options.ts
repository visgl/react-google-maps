import {useEffect, useLayoutEffect} from 'react';
import {MapProps} from '@vis.gl/react-google-maps';
import {InternalCameraStateRef} from './use-internal-camera-state';
import {isLatLngLiteral} from '../../libraries/is-lat-lng-literal';

/**
 * Internal hook to update the map-options and camera parameters when
 * props are changed.
 *
 * @param map the map instance
 * @param cameraStateRef stores the last values seen during dispatch into the
 * react-application in useMapEvents(). We can safely assume that we
 * don't need to feed these values back into the map.
 * @param mapProps the props to update the map-instance with
 * @internal
 */
export function useMapOptions(
  map: google.maps.Map | null,
  cameraStateRef: InternalCameraStateRef,
  mapProps: MapProps
) {
  const {center: rawCenter, zoom, heading, tilt, ...mapOptions} = mapProps;
  const center = rawCenter
    ? isLatLngLiteral(rawCenter)
      ? rawCenter
      : rawCenter.toJSON()
    : null;
  const lat = center && center.lat;
  const lng = center && center.lng;

  /* eslint-disable react-hooks/exhaustive-deps --
   *
   * The following effects aren't triggered when the map is changed.
   * In that case, the values will be or have been passed to the map
   * constructor as mapOptions.
   */

  // update the map options when mapOptions is changed
  // Note: due to the destructuring above, mapOptions will be seen as changed
  //   with every re-render, so we're boldly assuming the maps-api will properly
  //   deal with unchanged option-values passed into setOptions.
  useEffect(() => {
    if (!map) return;

    // Changing the mapId via setOptions will trigger an error-message.
    // We will re-create the map-instance in that case anyway, so we
    // remove it here to avoid this error-message.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {mapId, ...opts} = mapOptions;
    map.setOptions(opts);
  }, [mapOptions]);

  useLayoutEffect(() => {
    if (!map || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (
      cameraStateRef.current.center.lat === lat &&
      cameraStateRef.current.center.lng === lng
    )
      return;

    map.moveCamera({center: {lat: lat as number, lng: lng as number}});
  }, [lat, lng]);

  useLayoutEffect(() => {
    if (!map || !Number.isFinite(zoom)) return;
    if (cameraStateRef.current.zoom === zoom) return;

    map.moveCamera({zoom: zoom as number});
  }, [zoom]);

  useLayoutEffect(() => {
    if (!map || !Number.isFinite(heading)) return;
    if (cameraStateRef.current.heading === heading) return;

    map.moveCamera({heading: heading as number});
  }, [heading]);

  useLayoutEffect(() => {
    if (!map || !Number.isFinite(tilt)) return;
    if (cameraStateRef.current.tilt === tilt) return;

    map.moveCamera({tilt: tilt as number});
  }, [tilt]);
  /* eslint-enable react-hooks/exhaustive-deps */
}
