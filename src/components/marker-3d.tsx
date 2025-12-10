import type {PropsWithChildren} from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {createPortal} from 'react-dom';

import {useMap3D} from '../hooks/use-map-3d';
import {useMapsLibrary} from '../hooks/use-maps-library';
import {useDomEventListener} from '../hooks/use-dom-event-listener';
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
export function Marker3D(props: Marker3DProps) {
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

  const map3d = useMap3D();
  const maps3dLibrary = useMapsLibrary('maps3d');

  const [marker, setMarker] =
    useState<google.maps.maps3d.Marker3DElement | null>(null);

  // Track if a child component (like Pin) is handling its own content
  const [contentHandledExternally, setContentHandledExternally] =
    useState(false);

  // Container for rendering React children before moving to marker
  const [contentContainer, setContentContainer] =
    useState<HTMLDivElement | null>(null);

  // Track whether we need the interactive variant
  const isInteractive = Boolean(onClick);

  // Create marker element and attach to map
  useEffect(() => {
    if (!map3d || !maps3dLibrary) return;

    let newMarker:
      | google.maps.maps3d.Marker3DElement
      | google.maps.maps3d.Marker3DInteractiveElement;

    if (isInteractive) {
      newMarker = new maps3dLibrary.Marker3DInteractiveElement();
    } else {
      newMarker = new maps3dLibrary.Marker3DElement();
    }

    // Append marker to map3d element
    map3d.appendChild(newMarker);
    setMarker(newMarker);

    // Create content container for children
    const container = document.createElement('div');
    container.style.display = 'none';
    document.body.appendChild(container);
    setContentContainer(container);

    return () => {
      // Remove marker from map
      if (newMarker.parentElement) {
        newMarker.parentElement.removeChild(newMarker);
      }
      // Clean up content container
      container.remove();
      setMarker(null);
      setContentContainer(null);
    };
  }, [map3d, maps3dLibrary, isInteractive]);

  // Sync position prop
  useEffect(() => {
    if (!marker || position === undefined) return;
    marker.position = position;
  }, [marker, position]);

  // Sync altitudeMode prop
  useEffect(() => {
    if (!marker || altitudeMode === undefined) return;
    marker.altitudeMode =
      altitudeMode as unknown as google.maps.maps3d.AltitudeMode;
  }, [marker, altitudeMode]);

  // Sync collisionBehavior prop
  useEffect(() => {
    if (!marker || collisionBehavior === undefined) return;
    // Cast to the google.maps.CollisionBehavior type expected by Marker3DElement
    marker.collisionBehavior =
      collisionBehavior as google.maps.CollisionBehavior;
  }, [marker, collisionBehavior]);

  // Sync simple props
  useEffect(() => {
    if (!marker) return;
    if (drawsWhenOccluded !== undefined)
      marker.drawsWhenOccluded = drawsWhenOccluded;
  }, [marker, drawsWhenOccluded]);

  useEffect(() => {
    if (!marker) return;
    if (extruded !== undefined) marker.extruded = extruded;
  }, [marker, extruded]);

  useEffect(() => {
    if (!marker) return;
    if (label !== undefined) marker.label = label;
  }, [marker, label]);

  useEffect(() => {
    if (!marker) return;
    if (sizePreserved !== undefined) marker.sizePreserved = sizePreserved;
  }, [marker, sizePreserved]);

  useEffect(() => {
    if (!marker) return;
    if (zIndex !== undefined) marker.zIndex = zIndex;
  }, [marker, zIndex]);

  // Sync title prop (interactive only)
  useEffect(() => {
    if (!marker || !isInteractive) return;
    const interactiveMarker =
      marker as google.maps.maps3d.Marker3DInteractiveElement;
    if (title !== undefined) interactiveMarker.title = title;
  }, [marker, title, isInteractive]);

  // Bind click event for interactive marker
  useDomEventListener(marker, 'gmp-click', onClick);

  // Process children and move to marker slot with template wrapping
  useLayoutEffect(() => {
    // Skip if a child component (like Pin) is handling content
    if (contentHandledExternally) return;
    if (!marker || !contentContainer) return;

    // Clear any existing slotted content
    while (marker.firstChild) {
      marker.removeChild(marker.firstChild);
    }

    // Process each child node in the content container
    const childNodes = Array.from(contentContainer.childNodes);

    for (const node of childNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      if (tagName === 'img' || tagName === 'svg') {
        // Wrap img and svg in template element
        const template = document.createElement('template');
        template.content.appendChild(element.cloneNode(true));
        marker.appendChild(template);
      } else {
        // Append other elements directly (e.g., PinElement)
        marker.appendChild(element.cloneNode(true));
      }
    }
  }, [marker, contentContainer, children, contentHandledExternally]);

  // Memoize context value
  const contextValue = useMemo(
    () => ({marker, setContentHandledExternally}),
    [marker]
  );

  // Render children into hidden container, then useLayoutEffect moves them
  if (!contentContainer) return null;

  return (
    <Marker3DContext.Provider value={contextValue}>
      {createPortal(children, contentContainer)}
    </Marker3DContext.Provider>
  );
}

Marker3D.displayName = 'Marker3D';
