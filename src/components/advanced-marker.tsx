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

export interface AdvancedMarkerContextValue {
  marker: google.maps.marker.AdvancedMarkerElement;
}

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
    'gmpDraggable' | 'map'
  > &
    AdvancedMarkerEventProps & {
      /**
       * A className for the content element.
       * (can only be used with HTML Marker content)
       */
      className?: string;
      /**
       * Additional styles to apply to the content element.
       */
      style?: CSSProperties;
      draggable?: boolean;
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
    if (numChildren > 0) {
      const contentElement = document.createElement('div');

      newMarker.content = contentElement;
      setContentContainer(contentElement);
    }

    return () => {
      newMarker.map = null;
      setMarker(null);
      setContentContainer(null);
    };
  }, [map, markerLibrary, numChildren]);

  // update className and styles of marker.content element
  useEffect(() => {
    if (!contentContainer) return;

    setValueForStyles(contentContainer, style || null, prevStyleRef.current);
    prevStyleRef.current = style || null;

    if (className !== contentContainer.className)
      contentContainer.className = className ?? '';
  }, [contentContainer, className, style]);

  // bind all marker events
  useEffect(() => {
    if (!marker) return;

    const gme = google.maps.event;

    if (onClick) gme.addListener(marker, 'click', onClick);
    if (onDrag) gme.addListener(marker, 'drag', onDrag);
    if (onDragStart) gme.addListener(marker, 'dragstart', onDragStart);
    if (onDragEnd) gme.addListener(marker, 'dragend', onDragEnd);

    if ((onDrag || onDragStart || onDragEnd) && !draggable) {
      console.warn(
        'You need to set the marker to draggable to listen to drag-events.'
      );
    }

    const m = marker;
    return () => {
      gme.clearInstanceListeners(m);
    };
  }, [marker, draggable, onClick, onDragStart, onDrag, onDragEnd]);

  // update other marker props when changed
  useEffect(() => {
    if (!marker) return;

    if (position !== undefined) marker.position = position;
    if (draggable !== undefined) marker.gmpDraggable = draggable;
    if (collisionBehavior !== undefined)
      marker.collisionBehavior = collisionBehavior;
    if (zIndex !== undefined) marker.zIndex = zIndex;
    if (typeof title === 'string') marker.title = title;
  }, [marker, position, draggable, collisionBehavior, zIndex, title]);

  return [marker, contentContainer] as const;
}

export const AdvancedMarker = forwardRef(
  (props: AdvancedMarkerProps, ref: Ref<AdvancedMarkerRef>) => {
    const {children} = props;
    const [marker, contentContainer] = useAdvancedMarker(props);

    const advancedMarkerContextValue: AdvancedMarkerContextValue | null =
      useMemo(() => (marker ? {marker} : null), [marker]);

    useImperativeHandle(ref, () => marker, [marker]);

    if (!marker) return null;

    return (
      <AdvancedMarkerContext.Provider value={advancedMarkerContextValue}>
        {contentContainer !== null && createPortal(children, contentContainer)}
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
