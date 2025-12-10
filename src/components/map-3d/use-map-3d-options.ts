import {useDeepCompareEffect} from '../../hooks/use-deep-compare-effect';
import {Map3DProps} from './index';

/**
 * Set of option keys that can be updated on Map3DElement.
 * Camera props (center, heading, tilt, range, roll) are handled separately.
 */
const MAP_3D_OPTION_KEYS = new Set([
  'bounds',
  'defaultUIHidden',
  'gestureHandling',
  'internalUsageAttributionIds',
  'maxAltitude',
  'maxHeading',
  'maxTilt',
  'minAltitude',
  'minHeading',
  'minTilt',
  'mode'
] as const);

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
  const options: Record<string, unknown> = {};
  const keys = Object.keys(props);

  for (const key of keys) {
    if (
      !MAP_3D_OPTION_KEYS.has(
        key as typeof MAP_3D_OPTION_KEYS extends Set<infer T> ? T : never
      )
    )
      continue;
    const value = (props as Record<string, unknown>)[key];

    if (value === undefined) continue;

    options[key] = value;
  }

  useDeepCompareEffect(() => {
    if (!map3d) return;

    Object.assign(map3d, options);
  }, [map3d, options]);
}
