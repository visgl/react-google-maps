import {useEffect} from 'react';
import {MapProps} from '@vis.gl/react-google-maps';

/**
 * Internal hook to update the map-options and view-parameters when
 * props are changed.
 * @internal
 */
export function useMapOptions(map: google.maps.Map | null, mapProps: MapProps) {
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
