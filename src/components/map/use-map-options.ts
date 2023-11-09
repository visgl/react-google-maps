import {useEffect, useLayoutEffect} from 'react';
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

    map.setOptions(mapOptions);
  }, [mapOptions]);

  useLayoutEffect(() => {
    if (!map || !center) return;

    map.moveCamera({center});
  }, [center]);

  useLayoutEffect(() => {
    if (!map || !Number.isFinite(zoom)) return;

    map.moveCamera({zoom: zoom as number});
  }, [zoom]);

  useLayoutEffect(() => {
    if (!map || !Number.isFinite(heading)) return;

    map.moveCamera({heading: heading as number});
  }, [heading]);

  useLayoutEffect(() => {
    if (!map || !Number.isFinite(tilt)) return;

    map.moveCamera({tilt: tilt as number});
  }, [tilt]);
  /* eslint-enable react-hooks/exhaustive-deps */
}
