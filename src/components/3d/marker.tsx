import React, {forwardRef, PropsWithChildren} from 'react';

import {AltitudeMode, CollisionBehavior} from '../../constants';
import {useDomEventListener} from '../../hooks/use-dom-event-listener';
import {usePropBinding} from '../../hooks/use-prop-binding';
import {Maps3DEventProps} from './types';
import {useCustomElementRef} from './use-custom-element-ref';

export type MarkerElement =
  | google.maps.maps3d.MarkerElement
  | google.maps.maps3d.MarkerInteractiveElement;

export type MarkerProps = PropsWithChildren<
  Omit<
    google.maps.maps3d.MarkerElementOptions,
    'altitudeMode' | 'collisionBehavior'
  > &
    Maps3DEventProps & {
      altitudeMode?: AltitudeMode;
      collisionBehavior?: CollisionBehavior;
      gmpPopoverTargetElement?: google.maps.maps3d.PopoverElement | null;
    }
>;

/**
 * Marker component for displaying custom HTML markers on a 3D map.
 *
 * Automatically uses MarkerInteractiveElement when onClick is provided,
 * otherwise uses MarkerElement.
 */
export const Marker = forwardRef<MarkerElement, MarkerProps>(
  function Marker(props, ref) {
    const {
      children,
      onClick,
      altitudeMode,
      anchorLeft,
      anchorTop,
      autofitsCamera,
      collisionBehavior,
      collisionPriority,
      gmpPopoverTargetElement,
      position,
      title
    } = props;

    const [marker, markerRef] = useCustomElementRef<MarkerElement>(ref);
    const isInteractive = Boolean(onClick);

    useDomEventListener(marker, 'gmp-click', onClick);

    usePropBinding(
      marker,
      'altitudeMode',
      altitudeMode as google.maps.maps3d.AltitudeModeString
    );
    usePropBinding(marker, 'anchorLeft', anchorLeft);
    usePropBinding(marker, 'anchorTop', anchorTop);
    usePropBinding(marker, 'autofitsCamera', autofitsCamera);
    usePropBinding(marker, 'collisionBehavior', collisionBehavior);
    usePropBinding(marker, 'collisionPriority', collisionPriority);
    usePropBinding(marker, 'position', position);
    usePropBinding(marker, 'title', title);
    usePropBinding(
      marker as google.maps.maps3d.MarkerInteractiveElement | null,
      'gmpPopoverTargetElement',
      gmpPopoverTargetElement
    );

    return isInteractive ? (
      <gmp-marker-interactive ref={markerRef}>
        {children}
      </gmp-marker-interactive>
    ) : (
      <gmp-marker ref={markerRef}>{children}</gmp-marker>
    );
  }
);

Marker.displayName = 'Marker';
