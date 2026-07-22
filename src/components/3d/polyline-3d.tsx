import React, {forwardRef} from 'react';

import {AltitudeMode} from '../../constants';
import {useDomEventListener} from '../../hooks/use-dom-event-listener';
import {usePropBinding} from '../../hooks/use-prop-binding';
import {Maps3DEventProps} from './types';
import {useCustomElementRef} from './use-custom-element-ref';

export type Polyline3DElement =
  | google.maps.maps3d.Polyline3DElement
  | google.maps.maps3d.Polyline3DInteractiveElement;

export type Polyline3DProps = Omit<
  google.maps.maps3d.Polyline3DElementOptions,
  'altitudeMode'
> &
  Maps3DEventProps & {
    altitudeMode?: AltitudeMode;
  };

/**
 * Polyline3D component for displaying connected line segments on a 3D map.
 *
 * Automatically uses Polyline3DInteractiveElement when onClick is provided,
 * otherwise uses Polyline3DElement.
 */
export const Polyline3D = forwardRef<Polyline3DElement, Polyline3DProps>(
  function Polyline3D(props, ref) {
    const {
      onClick,
      altitudeMode,
      autofitsCamera,
      coordinates,
      drawsOccludedSegments,
      extruded,
      geodesic,
      outerColor,
      outerWidth,
      path,
      strokeColor,
      strokeWidth,
      zIndex
    } = props;

    const [polyline, polylineRef] = useCustomElementRef<Polyline3DElement>(ref);
    const isInteractive = Boolean(onClick);

    useDomEventListener(polyline, 'gmp-click', onClick);

    usePropBinding(
      polyline,
      'altitudeMode',
      altitudeMode as google.maps.maps3d.AltitudeModeString
    );
    usePropBinding(polyline, 'autofitsCamera', autofitsCamera);
    usePropBinding(polyline, 'coordinates', coordinates);
    usePropBinding(polyline, 'drawsOccludedSegments', drawsOccludedSegments);
    usePropBinding(polyline, 'extruded', extruded);
    usePropBinding(polyline, 'geodesic', geodesic);
    usePropBinding(polyline, 'outerColor', outerColor);
    usePropBinding(polyline, 'outerWidth', outerWidth);
    usePropBinding(polyline, 'path', path);
    usePropBinding(polyline, 'strokeColor', strokeColor);
    usePropBinding(polyline, 'strokeWidth', strokeWidth);
    usePropBinding(polyline, 'zIndex', zIndex);

    return isInteractive ? (
      <gmp-polyline-3d-interactive ref={polylineRef} />
    ) : (
      <gmp-polyline-3d ref={polylineRef} />
    );
  }
);

Polyline3D.displayName = 'Polyline3D';
