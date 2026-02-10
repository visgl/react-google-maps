import type {PropsWithChildren, Ref} from 'react';
import React, {forwardRef} from 'react';

/**
 * Props for the Model3D component.
 */
export type Model3DProps =
  PropsWithChildren<google.maps.maps3d.Model3DElementOptions>;

/**
 * Model3D component for displaying 3D models on a Map3D.
 *
 * @example
 * ```tsx
 * <Model3D
 *   position={{ lat: 37.7749, lng: -122.4194, altitude: 150 }}
 *   altitudeMode="RELATIVE_TO_GROUND"
 *   src={new URL('./model.glb', import.meta.url)}
 *   scale={10}
 *   orientation={{ heading: 0, tilt: 0, roll: 0 }}
 * />
 * ```
 */
export const Model3D = forwardRef(function Model3D(
  props: Model3DProps,
  ref: Ref<google.maps.maps3d.Model3DElement>
) {
  const {position, altitudeMode, src, orientation, scale} = props;

  return (
    <gmp-model-3d
      ref={ref}
      position={position}
      altitude-mode={altitudeMode}
      src={src}
      orientation={orientation}
      scale={scale}
    />
  );
});

Model3D.displayName = 'Model3D';
