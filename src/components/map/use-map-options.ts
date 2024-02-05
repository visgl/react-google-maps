import {MapProps} from '../map';
import {useDeepCompareEffect} from '../../libraries/use-deep-compare-effect';

const mapOptionKeys = new Set([
  'backgroundColor',
  'clickableIcons',
  'controlSize',
  'disableDefaultUI',
  'disableDoubleClickZoom',
  'draggable',
  'draggableCursor',
  'draggingCursor',
  'fullscreenControl',
  'fullscreenControlOptions',
  'gestureHandling',
  'isFractionalZoomEnabled',
  'keyboardShortcuts',
  'mapTypeControl',
  'mapTypeControlOptions',
  'mapTypeId',
  'maxZoom',
  'minZoom',
  'noClear',
  'panControl',
  'panControlOptions',
  'restriction',
  'rotateControl',
  'rotateControlOptions',
  'scaleControl',
  'scaleControlOptions',
  'scrollwheel',
  'streetView',
  'streetViewControl',
  'streetViewControlOptions',
  'styles',
  'zoomControl',
  'zoomControlOptions'
]);

/**
 * Internal hook to update the map-options when props are changed.
 *
 * @param map the map instance
 * @param mapProps the props to update the map-instance with
 * @internal
 */
export function useMapOptions(map: google.maps.Map | null, mapProps: MapProps) {
  /* eslint-disable react-hooks/exhaustive-deps --
   *
   * The following effects aren't triggered when the map is changed.
   * In that case, the values will be or have been passed to the map
   * constructor via mapOptions.
   */

  const mapOptions: google.maps.MapOptions = {};
  const keys = Object.keys(mapProps) as (keyof google.maps.MapOptions)[];
  for (const key of keys) {
    if (!mapOptionKeys.has(key)) continue;

    mapOptions[key] = mapProps[key] as never;
  }

  // update the map options when mapOptions is changed
  // Note: due to the destructuring above, mapOptions will be seen as changed
  //   with every re-render, so we're assuming the maps-api will properly
  //   deal with unchanged option-values passed into setOptions.
  useDeepCompareEffect(() => {
    if (!map) return;

    map.setOptions(mapOptions);
  }, [mapOptions]);
  /* eslint-enable react-hooks/exhaustive-deps */
}
