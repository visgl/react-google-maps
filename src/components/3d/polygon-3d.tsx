import React, {forwardRef} from 'react';

import {AltitudeMode} from '../../constants';
import {useDomEventListener} from '../../hooks/use-dom-event-listener';
import {usePropBinding} from '../../hooks/use-prop-binding';
import {Maps3DEventProps} from './types';
import {useCustomElementRef} from './use-custom-element-ref';

export type Polygon3DElement =
  | google.maps.maps3d.Polygon3DElement
  | google.maps.maps3d.Polygon3DInteractiveElement;

export type Polygon3DProps = Omit<
  google.maps.maps3d.Polygon3DElementOptions,
  'altitudeMode'
> &
  Maps3DEventProps & {
    altitudeMode?: AltitudeMode;
  };

/**
 * Polygon3D component for displaying filled polygons on a 3D map.
 *
 * Automatically uses Polygon3DInteractiveElement when onClick is provided,
 * otherwise uses Polygon3DElement.
 */
export const Polygon3D = forwardRef<Polygon3DElement, Polygon3DProps>(
  function Polygon3D(props, ref) {
    const {
      onClick,
      altitudeMode,
      autofitsCamera,
      drawsOccludedSegments,
      extruded,
      fillColor,
      geodesic,
      innerCoordinates,
      innerPaths,
      outerCoordinates,
      path,
      strokeColor,
      strokeWidth,
      zIndex
    } = props;

    const [polygon, polygonRef] = useCustomElementRef<Polygon3DElement>(ref);
    const isInteractive = Boolean(onClick);

    useDomEventListener(polygon, 'gmp-click', onClick);

    usePropBinding(
      polygon,
      'altitudeMode',
      altitudeMode as google.maps.maps3d.AltitudeModeString
    );
    usePropBinding(polygon, 'autofitsCamera', autofitsCamera);
    usePropBinding(polygon, 'drawsOccludedSegments', drawsOccludedSegments);
    usePropBinding(polygon, 'extruded', extruded);
    usePropBinding(polygon, 'fillColor', fillColor);
    usePropBinding(polygon, 'geodesic', geodesic);
    usePropBinding(polygon, 'innerCoordinates', innerCoordinates);
    usePropBinding(polygon, 'innerPaths', innerPaths);
    usePropBinding(polygon, 'outerCoordinates', outerCoordinates);
    usePropBinding(polygon, 'path', path);
    usePropBinding(polygon, 'strokeColor', strokeColor);
    usePropBinding(polygon, 'strokeWidth', strokeWidth);
    usePropBinding(polygon, 'zIndex', zIndex);

    return isInteractive ? (
      <gmp-polygon-3d-interactive ref={polygonRef} />
    ) : (
      <gmp-polygon-3d ref={polygonRef} />
    );
  }
);

Polygon3D.displayName = 'Polygon3D';
