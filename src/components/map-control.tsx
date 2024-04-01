import {useEffect, useMemo} from 'react';
import {createPortal} from 'react-dom';
import {useMap} from '../hooks/use-map';

import type {PropsWithChildren} from 'react';

type MapControlProps = PropsWithChildren<{
  position: ControlPosition;
}>;

/**
 * Copy of the `google.maps.ControlPosition` constants.
 * They have to be duplicated here since we can't wait for the maps API to load to be able to use them.
 */
export const ControlPosition = {
  TOP_LEFT: 1,
  TOP_CENTER: 2,
  TOP: 2,
  TOP_RIGHT: 3,
  LEFT_CENTER: 4,
  LEFT_TOP: 5,
  LEFT: 5,
  LEFT_BOTTOM: 6,
  RIGHT_TOP: 7,
  RIGHT: 7,
  RIGHT_CENTER: 8,
  RIGHT_BOTTOM: 9,
  BOTTOM_LEFT: 10,
  BOTTOM_CENTER: 11,
  BOTTOM: 11,
  BOTTOM_RIGHT: 12,
  CENTER: 13,
  BLOCK_START_INLINE_START: 14,
  BLOCK_START_INLINE_CENTER: 15,
  BLOCK_START_INLINE_END: 16,
  INLINE_START_BLOCK_CENTER: 17,
  INLINE_START_BLOCK_START: 18,
  INLINE_START_BLOCK_END: 19,
  INLINE_END_BLOCK_START: 20,
  INLINE_END_BLOCK_CENTER: 21,
  INLINE_END_BLOCK_END: 22,
  BLOCK_END_INLINE_START: 23,
  BLOCK_END_INLINE_CENTER: 24,
  BLOCK_END_INLINE_END: 25
} as const;
export type ControlPosition =
  (typeof ControlPosition)[keyof typeof ControlPosition];

export const MapControl = ({children, position}: MapControlProps) => {
  const controlContainer = useMemo(() => document.createElement('div'), []);
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const controls = map.controls[position];

    controls.push(controlContainer);

    return () => {
      const controlsArray = controls.getArray();
      // controlsArray could be undefined if the map is in an undefined state (e.g. invalid API-key, see #276
      if (!controlsArray) return;

      const index = controlsArray.indexOf(controlContainer);
      controls.removeAt(index);
    };
  }, [controlContainer, map, position]);

  return createPortal(children, controlContainer);
};
