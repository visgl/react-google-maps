import React, {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react';

import {usePropBinding} from '../hooks/use-prop-binding';
import {setValueForStyles} from '../libraries/set-value-for-styles';
import {AltitudeMode} from './marker-3d';

// Re-export AltitudeMode for convenience
export {AltitudeMode};

/**
 * Event props for Popover component.
 */
type PopoverEventProps = {
  /** Called when the popover is closed via light dismiss (click outside). */
  onClose?: () => void;

  /**
   * Content to render in the header slot of the popover.
   */
  headerContent?: ReactNode;
};

/**
 * Props for the Popover component.
 */
export type PopoverProps = PropsWithChildren<
  Omit<
    google.maps.maps3d.PopoverElementOptions,
    'altitudeMode' | 'positionAnchor'
  > &
    PopoverEventProps & {
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

      style?: CSSProperties;

      className?: string;
    }
>;

/**
 * Popover component for displaying info windows on a Map3D.
 *
 * Similar to InfoWindow for 2D maps, Popover provides a way to show
 * contextual information at a specific location or attached to a marker
 * on a 3D map.
 *
 * @example
 * ```tsx
 * // Basic popover at position
 * <Popover
 *   position={{ lat: 37.7749, lng: -122.4194 }}
 *   open={isOpen}
 * >
 *   <div>Hello from San Francisco!</div>
 * </Popover>
 *
 * // Popover anchored to a marker (place as sibling, use anchor prop)
 * <Marker3D
 *   ref={markerRef}
 *   position={{ lat: 37.7749, lng: -122.4194 }}
 *   onClick={() => setOpen(true)}
 * />
 * <Popover
 *   anchor={markerRef.current}
 *   open={isOpen}
 *   onClose={() => setOpen(false)}
 * >
 *   <div>Marker info</div>
 * </Popover>
 * ```
 */
export const Popover = forwardRef(function Popover(
  props: PopoverProps,
  ref: ForwardedRef<google.maps.maps3d.PopoverElement>
) {
  const {
    children,
    headerContent,
    style,
    className,
    open = true,
    position,
    anchor,
    anchorId,
    altitudeMode,
    lightDismissDisabled,
    autoPanDisabled,
    onClose
  } = props;

  const [popover, setPopover] =
    useState<google.maps.maps3d.PopoverElement | null>(null);

  const prevStyleRef = useRef<CSSProperties | null>(null);

  // Forward the ref to the parent
  useImperativeHandle(ref, () => popover!, [popover]);

  // Observe the open attribute and call onClose when popover is automatically
  // closed by the Maps API (light dismiss)
  usePopoverCloseObserver(popover, open, onClose);

  // Set properties on the popover element
  usePropBinding(popover, 'open', open ?? false);
  usePropBinding(
    popover,
    'altitudeMode',
    altitudeMode as google.maps.maps3d.AltitudeMode
  );
  usePropBinding(popover, 'lightDismissDisabled', lightDismissDisabled);
  usePropBinding(popover, 'autoPanDisabled', autoPanDisabled);

  // positionAnchor accepts a position, marker element, or marker ID string
  const positionAnchor = anchor ?? anchorId ?? position;
  usePropBinding(popover, 'positionAnchor', positionAnchor);

  // Set styles via ref for compatibility with older React versions
  useLayoutEffect(() => {
    if (!popover) return;

    setValueForStyles(popover, style || null, prevStyleRef.current);
    prevStyleRef.current = style || null;
  }, [popover, style]);

  return (
    <gmp-popover ref={setPopover} className={className}>
      {headerContent && <div slot="header">{headerContent}</div>}
      {children}
    </gmp-popover>
  );
});

Popover.displayName = 'Popover';

/**
 * Custom hook to observe the open attribute of a popover element
 * and call onClose when it transitions from open to closed due to light dismiss.
 * Does not call onClose when the open prop changes programmatically.
 */
function usePopoverCloseObserver(
  popover: google.maps.maps3d.PopoverElement | null,
  open: boolean | undefined,
  onClose?: () => void
) {
  const previousOpenState = useRef<boolean | undefined>(undefined);
  const openPropRef = useRef<boolean | undefined>(open);

  // Track the open prop value
  useEffect(() => {
    openPropRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!popover || !onClose) return;

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'open'
        ) {
          const isOpen = popover.hasAttribute('open');

          // Only call onClose when:
          // 1. Transitioning from open to closed
          // 2. The prop hasn't changed to false (meaning this was light dismiss, not programmatic)
          if (
            previousOpenState.current === true &&
            !isOpen &&
            openPropRef.current !== false
          ) {
            onClose();
          }

          previousOpenState.current = isOpen;
        }
      }
    });

    observer.observe(popover, {
      attributes: true,
      attributeFilter: ['open']
    });

    // Initialize the previous state
    previousOpenState.current = popover.hasAttribute('open');

    return () => {
      observer.disconnect();
    };
  }, [popover, onClose]);
}
