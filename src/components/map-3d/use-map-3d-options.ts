import {useDeepCompareEffect} from '../../hooks/use-deep-compare-effect';
import {Map3DProps} from './index';

/**
 * Set of option keys that can be updated on Map3DElement.
 * Camera props (center, heading, tilt, range, roll) are handled separately.
 */
const MAP_3D_OPTION_KEYS = new Set<
  keyof google.maps.maps3d.Map3DElementOptions
>([
  'bounds',
  'defaultUIHidden',
  'internalUsageAttributionIds',
  'maxAltitude',
  'maxHeading',
  'maxTilt',
  'minAltitude',
  'minHeading',
  'minTilt',
  'mode'
]);

/**
 * Hook to update Map3D options when props change.
 *
 * @internal
 */
export function useMap3DOptions(
  map3d: google.maps.maps3d.Map3DElement | null,
  props: Map3DProps
) {
  // Filter props to only include valid option keys
  const options: Partial<google.maps.maps3d.Map3DElementOptions> = {};
  const keys = Object.keys(
    props
  ) as (keyof google.maps.maps3d.Map3DElementOptions)[];

  for (const key of keys) {
    if (!MAP_3D_OPTION_KEYS.has(key)) continue;
    if (props[key] === undefined) continue;

    options[key] = props[key] as never;
  }

  useDeepCompareEffect(() => {
    if (!map3d) return;

    Object.assign(map3d, options);
  }, [map3d, options]);
}
