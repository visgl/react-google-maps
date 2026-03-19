import React, {
  createContext,
  forwardRef,
  PropsWithChildren,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react';
import {createPortal} from 'react-dom';

import {useDomEventListener} from '../hooks/use-dom-event-listener';
import {usePropBinding} from '../hooks/use-prop-binding';
import {CollisionBehavior} from './advanced-marker';

// Re-export CollisionBehavior for convenience
export {CollisionBehavior};

/**
 * Context for Marker3D component, providing access to the marker element.
 */
export interface Marker3DContextValue {
  marker:
    | google.maps.maps3d.Marker3DElement
    | google.maps.maps3d.Marker3DInteractiveElement
    | null;
  /** Set to true by child components (like Pin) that handle their own content */
  setContentHandledExternally: (handled: boolean) => void;
}

export const Marker3DContext = createContext<Marker3DContextValue | null>(null);

/**
 * Hook to access the Marker3D context.
 */
export function useMarker3D() {
  return useContext(Marker3DContext);
}

/**
 * AltitudeMode for specifying how altitude is interpreted for 3D elements.
 * This mirrors google.maps.maps3d.AltitudeMode but is available without waiting for the API to load.
 */
export const AltitudeMode = {
  /** Allows to express objects relative to the average mean sea level. */
  ABSOLUTE: 'ABSOLUTE',
  /** Allows to express objects placed on the ground. */
  CLAMP_TO_GROUND: 'CLAMP_TO_GROUND',
  /** Allows to express objects relative to the ground surface. */
  RELATIVE_TO_GROUND: 'RELATIVE_TO_GROUND',
  /** Allows to express objects relative to the highest of ground+building+water surface. */
  RELATIVE_TO_MESH: 'RELATIVE_TO_MESH'
} as const;
export type AltitudeMode = (typeof AltitudeMode)[keyof typeof AltitudeMode];

/**
 * Event props for Marker3D component.
 */
type Marker3DEventProps = {
  /** Click handler. When provided, the interactive variant (Marker3DInteractiveElement) is used. */
  onClick?: (e: Event) => void;
};

/**
 * Props for the Marker3D component.
 */
export type Marker3DProps = PropsWithChildren<
  Omit<
    google.maps.maps3d.Marker3DElementOptions,
    'collisionBehavior' | 'altitudeMode'
  > &
    Marker3DEventProps & {
      /**
       * Specifies how the altitude component of the position is interpreted.
       * @default AltitudeMode.CLAMP_TO_GROUND
       */
      altitudeMode?: AltitudeMode;

      /**
       * An enumeration specifying how a Marker3DElement should behave when it
       * collides with another Marker3DElement or with the basemap labels.
       * @default CollisionBehavior.REQUIRED
       */
      collisionBehavior?: CollisionBehavior;

      /**
       * Rollover text (only used when onClick is provided).
       */
      title?: string;
    }
>;

/**
 * Marker3D component for displaying markers on a Map3D.
 *
 * Automatically uses Marker3DInteractiveElement when onClick is provided,
 * otherwise uses Marker3DElement.
 *
 * Children can include:
 * - `<img>` elements (automatically wrapped in <template>)
 * - `<svg>` elements (automatically wrapped in <template>)
 * - PinElement instances (passed through directly)
 *
 * @example
 * ```tsx
 * // Basic marker
 * <Marker3D position={{ lat: 37.7749, lng: -122.4194 }} label="SF" />
 *
 * // Interactive marker
 * <Marker3D
 *   position={{ lat: 37.7749, lng: -122.4194 }}
 *   onClick={() => console.log('clicked')}
 *   title="Click me"
 * />
 *
 * // Custom marker with image
 * <Marker3D position={{ lat: 37.7749, lng: -122.4194 }}>
 *   <img src="/icon.png" width={32} height={32} />
 * </Marker3D>
 * ```
 */
export const Marker3D = forwardRef(function Marker3D(
  props: Marker3DProps,
  ref: Ref<
    | google.maps.maps3d.Marker3DElement
    | google.maps.maps3d.Marker3DInteractiveElement
  >
) {
  const {
    children,
    onClick,
    position,
    altitudeMode,
    collisionBehavior,
    drawsWhenOccluded,
    extruded,
    label,
    sizePreserved,
    zIndex,
    title
  } = props;

  const isInteractive = Boolean(onClick);

  const [marker, setMarker] = useState<
    | google.maps.maps3d.Marker3DElement
    | google.maps.maps3d.Marker3DInteractiveElement
    | null
  >(null);

  // Track if a child component (like Pin) is handling its own content
  const [contentHandledExternally, setContentHandledExternally] =
    useState(false);

  // Create a container for rendering React children to be wrapped and relocated
  // into the parent gmp-marker-3d element.
  const contentContainer = useMemo(() => {
    const container = document.createElement('div');
    container.style.display = 'none';
    document.body.appendChild(container);

    return container;
  }, []);

  // Remove the container on unmount
  useEffect(() => {
    return () => contentContainer.remove();
  }, [contentContainer]);

  // Callback ref that sets both internal state and forwards the ref
  const markerRef = useCallback(
    (node: google.maps.maps3d.Marker3DElement | null) => {
      setMarker(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.RefObject<typeof node>).current = node;
      }
    },
    [ref]
  );

  useDomEventListener(marker, 'gmp-click', onClick);

  // Move React children to marker's slot, wrapping img/svg in <template> as required by the API
  useLayoutEffect(() => {
    if (contentHandledExternally) return;
    if (!marker || !contentContainer) return;

    while (marker.firstChild) {
      marker.removeChild(marker.firstChild);
    }

    const childNodes = Array.from(contentContainer.childNodes);

    for (const node of childNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      if (tagName === 'img' || tagName === 'svg') {
        const template = document.createElement('template');
        template.content.appendChild(element.cloneNode(true));
        marker.appendChild(template);
      } else {
        marker.appendChild(element.cloneNode(true));
      }
    }
  }, [marker, contentContainer, children, contentHandledExternally]);

  const contextValue = useMemo(
    () => ({marker, setContentHandledExternally}),
    [marker]
  );

  usePropBinding(marker, 'position', position);
  usePropBinding(
    marker,
    'altitudeMode',
    altitudeMode as google.maps.maps3d.AltitudeMode
  );
  usePropBinding(marker, 'collisionBehavior', collisionBehavior);
  usePropBinding(marker, 'drawsWhenOccluded', drawsWhenOccluded);
  usePropBinding(marker, 'extruded', extruded);
  usePropBinding(marker, 'label', label);
  usePropBinding(marker, 'sizePreserved', sizePreserved);
  usePropBinding(marker, 'zIndex', zIndex);
  usePropBinding(marker, 'title', title ?? '');

  return (
    <Marker3DContext.Provider value={contextValue}>
      {isInteractive ? (
        <gmp-marker-3d-interactive ref={markerRef} />
      ) : (
        <gmp-marker-3d ref={markerRef} />
      )}
      {createPortal(children, contentContainer)}
    </Marker3DContext.Provider>
  );
});

Marker3D.displayName = 'Marker3D';
