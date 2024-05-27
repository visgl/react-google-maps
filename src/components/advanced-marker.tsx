/* eslint-disable complexity */
import React, {
  Children,
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';

import {createPortal} from 'react-dom';
import {useMap} from '../hooks/use-map';
import {useMapsLibrary} from '../hooks/use-maps-library';
import {setValueForStyles} from '../libraries/set-value-for-styles';

import type {Ref, PropsWithChildren} from 'react';
import {useMapsEventListener} from '../hooks/use-maps-event-listener';
import {usePropBinding} from '../hooks/use-prop-binding';

export interface AdvancedMarkerContextValue {
  marker: google.maps.marker.AdvancedMarkerElement;
}

/**
 * Copy of the `google.maps.CollisionBehavior` constants.
 * They have to be duplicated here since we can't wait for the maps API to load to be able to use them.
 */
export const CollisionBehavior = {
  REQUIRED: 'REQUIRED',
  REQUIRED_AND_HIDES_OPTIONAL: 'REQUIRED_AND_HIDES_OPTIONAL',
  OPTIONAL_AND_HIDES_LOWER_PRIORITY: 'OPTIONAL_AND_HIDES_LOWER_PRIORITY'
} as const;
export type CollisionBehavior =
  (typeof CollisionBehavior)[keyof typeof CollisionBehavior];

export const AdvancedMarkerContext =
  React.createContext<AdvancedMarkerContextValue | null>(null);

type AdvancedMarkerEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
};

export type AdvancedMarkerProps = PropsWithChildren<
  Omit<
    google.maps.marker.AdvancedMarkerElementOptions,
    'gmpDraggable' | 'gmpClickable' | 'content' | 'map' | 'collisionBehavior'
  > &
    AdvancedMarkerEventProps & {
      draggable?: boolean;
      clickable?: boolean;
      collisionBehavior?: CollisionBehavior;
      /**
       * A className for the content element.
       * (can only be used with HTML Marker content)
       */
      className?: string;
      /**
       * Additional styles to apply to the content element.
       */
      style?: CSSProperties;
    }
>;

export type AdvancedMarkerRef = google.maps.marker.AdvancedMarkerElement | null;
function useAdvancedMarker(props: AdvancedMarkerProps) {
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [contentContainer, setContentContainer] =
    useState<HTMLDivElement | null>(null);

  const prevStyleRef = useRef<CSSProperties | null>(null);

  const map = useMap();
  const markerLibrary = useMapsLibrary('marker');

  const {
    children,
    className,
    style,
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    collisionBehavior,
    clickable,
    draggable,
    position,
    title,
    zIndex
  } = props;

  const numChildren = Children.count(children);

  // create an AdvancedMarkerElement instance and add it to the map once available
  useEffect(() => {
    if (!map || !markerLibrary) return;

    const newMarker = new markerLibrary.AdvancedMarkerElement();
    newMarker.map = map;

    setMarker(newMarker);

    // create the container for marker content if there are children
    let contentElement: HTMLDivElement | null = null;
    if (numChildren > 0) {
      contentElement = document.createElement('div');

      newMarker.content = contentElement;
      setContentContainer(contentElement);
    }

    return () => {
      newMarker.map = null;
      contentElement?.remove();
      setMarker(null);
      setContentContainer(null);
    };
  }, [map, markerLibrary, numChildren]);

  // update className and styles of marker.content element
  useEffect(() => {
    if (!marker || !marker.content) return;

    (marker.content as HTMLElement).className = className || '';
  }, [marker, className]);

  usePropBinding(contentContainer, 'className', className ?? '');
  useEffect(() => {
    if (!contentContainer) return;

    setValueForStyles(contentContainer, style || null, prevStyleRef.current);
    prevStyleRef.current = style || null;
  }, [contentContainer, className, style]);

  // copy other props
  usePropBinding(marker, 'position', position);
  usePropBinding(marker, 'title', title ?? '');
  usePropBinding(marker, 'zIndex', zIndex);
  usePropBinding(
    marker,
    'collisionBehavior',
    collisionBehavior as google.maps.CollisionBehavior
  );

  // set gmpDraggable from props (when unspecified, it's true if any drag-event
  // callbacks are specified)
  useEffect(() => {
    if (!marker) return;

    if (draggable !== undefined) marker.gmpDraggable = draggable;
    else if (onDrag || onDragStart || onDragEnd) marker.gmpDraggable = true;
    else marker.gmpDraggable = false;
  }, [marker, draggable, onDrag, onDragEnd, onDragStart]);

  // set gmpClickable from props (when unspecified, it's true if the onClick event
  // callback is specified)
  useEffect(() => {
    if (!marker) return;

    if (clickable !== undefined) marker.gmpClickable = clickable;
    else if (onClick) marker.gmpClickable = true;
    else marker.gmpClickable = false;
  }, [marker, clickable, onClick]);

  useMapsEventListener(marker, 'click', onClick);
  useMapsEventListener(marker, 'drag', onDrag);
  useMapsEventListener(marker, 'dragstart', onDragStart);
  useMapsEventListener(marker, 'dragend', onDragEnd);

  return [marker, contentContainer] as const;
}

export const AdvancedMarker = forwardRef(
  (props: AdvancedMarkerProps, ref: Ref<AdvancedMarkerRef>) => {
    const {children} = props;
    const [marker, contentContainer] = useAdvancedMarker(props);

    const advancedMarkerContextValue: AdvancedMarkerContextValue | null =
      useMemo(() => (marker ? {marker} : null), [marker]);

    useImperativeHandle(ref, () => marker, [marker]);

    if (!contentContainer) return null;

    return (
      <AdvancedMarkerContext.Provider value={advancedMarkerContextValue}>
        {createPortal(children, contentContainer)}
      </AdvancedMarkerContext.Provider>
    );
  }
);

export function useAdvancedMarkerRef() {
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const refCallback = useCallback((m: AdvancedMarkerRef | null) => {
    setMarker(m);
  }, []);

  return [refCallback, marker] as const;
}
