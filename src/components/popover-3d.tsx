import type {PropsWithChildren} from 'react';
import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';

import {useMap3D} from '../hooks/use-map-3d';
import {useMapsLibrary} from '../hooks/use-maps-library';
import {useDomEventListener} from '../hooks/use-dom-event-listener';
import {AltitudeMode} from './marker-3d';

// Re-export AltitudeMode for convenience
export {AltitudeMode};

/**
 * Event props for Popover3D component.
 */
type Popover3DEventProps = {
  /** Called when the popover is closed via light dismiss (click outside). */
  onClose?: (e: Event) => void;
};

/**
 * Props for the Popover3D component.
 */
export type Popover3DProps = PropsWithChildren<
  Omit<
    google.maps.maps3d.PopoverElementOptions,
    'altitudeMode' | 'positionAnchor'
  > &
    Popover3DEventProps & {
      /**
       * Specifies how the altitude component of the position is interpreted.
       * @default AltitudeMode.CLAMP_TO_GROUND
       */
      altitudeMode?: AltitudeMode;

      /**
       * The position at which to display this popover.
       * Can be a LatLng position or LatLngAltitude position.
       */
      position?: google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral;

      /**
       * A Marker3DInteractiveElement to anchor the popover to.
       * When specified, the popover will be positioned relative to the marker.
       */
      anchor?: google.maps.maps3d.Marker3DInteractiveElement | null;

      /**
       * A string ID referencing a Marker3DInteractiveElement to anchor the popover to.
       */
      anchorId?: string;
    }
>;

/**
 * Popover3D component for displaying info windows on a Map3D.
 *
 * Similar to InfoWindow for 2D maps, Popover3D provides a way to show
 * contextual information at a specific location or attached to a marker
 * on a 3D map.
 *
 * @example
 * ```tsx
 * // Basic popover at position
 * <Popover3D
 *   position={{ lat: 37.7749, lng: -122.4194 }}
 *   open={isOpen}
 * >
 *   <div>Hello from San Francisco!</div>
 * </Popover3D>
 *
 * // Popover anchored to a marker (place as sibling, use anchor prop)
 * <Marker3D
 *   ref={markerRef}
 *   position={{ lat: 37.7749, lng: -122.4194 }}
 *   onClick={() => setOpen(true)}
 * />
 * <Popover3D
 *   anchor={markerRef.current}
 *   open={isOpen}
 *   onClose={() => setOpen(false)}
 * >
 *   <div>Marker info</div>
 * </Popover3D>
 * ```
 */
export function Popover3D(props: Popover3DProps) {
  const {
    children,
    open,
    position,
    anchor,
    anchorId,
    altitudeMode,
    lightDismissDisabled,
    onClose
  } = props;

  const map3d = useMap3D();
  const maps3dLibrary = useMapsLibrary('maps3d');

  const [popover, setPopover] =
    useState<google.maps.maps3d.PopoverElement | null>(null);

  // Container for rendering React children
  const [contentContainer, setContentContainer] =
    useState<HTMLDivElement | null>(null);

  // Create popover element and attach to map
  useEffect(() => {
    if (!map3d || !maps3dLibrary) return;

    // PopoverElement may not be available in all versions
    if (!('PopoverElement' in maps3dLibrary)) {
      console.warn(
        'PopoverElement is not available in the current Maps API version'
      );
      return;
    }

    const newPopover = new maps3dLibrary.PopoverElement();

    // Create content container for children - this stays as React's render target
    const container = document.createElement('div');
    setContentContainer(container);

    // Append container to popover (container stays in popover, React manages its contents)
    newPopover.appendChild(container);

    // Append popover to map3d element
    map3d.appendChild(newPopover);
    setPopover(newPopover);

    return () => {
      // Remove popover from map
      if (newPopover.parentElement) {
        newPopover.parentElement.removeChild(newPopover);
      }
      setPopover(null);
      setContentContainer(null);
    };
  }, [map3d, maps3dLibrary]);

  // Sync open prop
  useEffect(() => {
    if (!popover) return;
    popover.open = open ?? false;
  }, [popover, open]);

  // Sync positionAnchor - can be position, anchor element, or anchorId string
  useEffect(() => {
    if (!popover) return;

    if (anchor) {
      popover.positionAnchor = anchor;
    } else if (anchorId) {
      popover.positionAnchor = anchorId;
    } else if (position) {
      popover.positionAnchor = position;
    }
  }, [popover, position, anchor, anchorId]);

  // Sync altitudeMode prop
  useEffect(() => {
    if (!popover || altitudeMode === undefined) return;
    popover.altitudeMode =
      altitudeMode as unknown as google.maps.maps3d.AltitudeMode;
  }, [popover, altitudeMode]);

  // Sync lightDismissDisabled prop
  useEffect(() => {
    if (!popover) return;
    if (lightDismissDisabled !== undefined) {
      popover.lightDismissDisabled = lightDismissDisabled;
    }
  }, [popover, lightDismissDisabled]);

  // Bind close event (gmp-close fires on light dismiss)
  useDomEventListener(popover, 'gmp-close', onClose);

  // Render children directly into contentContainer which is already inside the popover
  if (!contentContainer) return null;

  return createPortal(children, contentContainer);
}

Popover3D.displayName = 'Popover3D';
