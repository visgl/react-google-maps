import React, {forwardRef} from 'react';

import {AltitudeMode} from '../../constants';
import {useDomEventListener} from '../../hooks/use-dom-event-listener';
import {usePropBinding} from '../../hooks/use-prop-binding';
import {Maps3DEventProps} from './types';
import {useCustomElementRef} from './use-custom-element-ref';

export type Model3DElement =
  | google.maps.maps3d.Model3DElement
  | google.maps.maps3d.Model3DInteractiveElement;

export type Model3DProps = Omit<
  google.maps.maps3d.Model3DElementOptions,
  'altitudeMode'
> &
  Maps3DEventProps & {
    altitudeMode?: AltitudeMode;
  };

/**
 * Model3D component for rendering glTF models on a 3D map.
 *
 * Automatically uses Model3DInteractiveElement when onClick is provided,
 * otherwise uses Model3DElement.
 */
export const Model3D = forwardRef<Model3DElement, Model3DProps>(
  function Model3D(props, ref) {
    const {onClick, altitudeMode, orientation, position, scale, src} = props;

    const [model, modelRef] = useCustomElementRef<Model3DElement>(ref);
    const isInteractive = Boolean(onClick);

    useDomEventListener(model, 'gmp-click', onClick);

    usePropBinding(
      model,
      'altitudeMode',
      altitudeMode as google.maps.maps3d.AltitudeModeString
    );
    usePropBinding(model, 'orientation', orientation);
    usePropBinding(model, 'position', position);
    usePropBinding(model, 'scale', scale);
    usePropBinding(model, 'src', src);

    return isInteractive ? (
      <gmp-model-3d-interactive ref={modelRef} />
    ) : (
      <gmp-model-3d ref={modelRef} />
    );
  }
);

Model3D.displayName = 'Model3D';
