import React, {forwardRef} from 'react';

import {usePropBinding} from '../../hooks/use-prop-binding';
import {useCustomElementRef} from './use-custom-element-ref';

export type FlattenerProps = google.maps.maps3d.FlattenerElementOptions;

/**
 * Flattener component for flattening a specified area on a 3D map.
 */
export const Flattener = forwardRef<
  google.maps.maps3d.FlattenerElement,
  FlattenerProps
>(function Flattener(props, ref) {
  const {innerPaths, path} = props;

  const [flattener, flattenerRef] =
    useCustomElementRef<google.maps.maps3d.FlattenerElement>(ref);

  usePropBinding(flattener, 'innerPaths', innerPaths);
  usePropBinding(flattener, 'path', path);

  return (
    <gmp-flattener ref={flattenerRef} innerPaths={innerPaths} path={path} />
  );
});

Flattener.displayName = 'Flattener';
