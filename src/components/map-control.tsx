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
export enum ControlPosition {
  BLOCK_END_INLINE_CENTER = 0,
  BLOCK_END_INLINE_END = 1,
  BLOCK_END_INLINE_START = 2,
  BLOCK_START_INLINE_CENTER = 3,
  BLOCK_START_INLINE_END = 4,
  BLOCK_START_INLINE_START = 5,
  BOTTOM_CENTER = 6,
  BOTTOM_LEFT = 7,
  BOTTOM_RIGHT = 8,
  INLINE_END_BLOCK_CENTER = 9,
  INLINE_END_BLOCK_END = 10,
  INLINE_END_BLOCK_START = 11,
  INLINE_START_BLOCK_CENTER = 12,
  INLINE_START_BLOCK_END = 13,
  INLINE_START_BLOCK_START = 14,
  LEFT_BOTTOM = 15,
  LEFT_CENTER = 16,
  LEFT_TOP = 17,
  RIGHT_BOTTOM = 18,
  RIGHT_CENTER = 19,
  RIGHT_TOP = 20,
  TOP_CENTER = 21,
  TOP_LEFT = 22,
  TOP_RIGHT = 23
}

export const MapControl = ({children, position}: MapControlProps) => {
  const controlContainer = useMemo(() => document.createElement('div'), []);
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const controls = map.controls[position];

    controls.push(controlContainer);

    return () => {
      const index = controls.getArray().indexOf(controlContainer);
      controls.removeAt(index);
    };
  }, [map, position]);

  return createPortal(children, controlContainer);
};
