import React, {forwardRef} from 'react';

import {usePropBinding} from '../../hooks/use-prop-binding';
import {useCustomElementRef} from './use-custom-element-ref';

export type CirclePathProps = google.maps.maps3d.CirclePathElementOptions;

/**
 * CirclePath component for displaying circle paths on a 3D map.
 */
export const CirclePath = forwardRef<
  google.maps.maps3d.CirclePathElement,
  CirclePathProps
>(function CirclePath(props, ref) {
  const {center, radius} = props;

  const [circlePath, circlePathRef] =
    useCustomElementRef<google.maps.maps3d.CirclePathElement>(ref);

  usePropBinding(circlePath, 'center', center);
  usePropBinding(circlePath, 'radius', radius);

  return (
    <gmp-circle-path ref={circlePathRef} center={center} radius={radius} />
  );
});

CirclePath.displayName = 'CirclePath';
