/* eslint-disable complexity */
import React, {
  Children,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';

import {createPortal} from 'react-dom';
import {GoogleMapsContext} from './map';

import type {Ref, PropsWithChildren} from 'react';
import {useMapsLibrary} from '../hooks/use-maps-library';

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
  Omit<google.maps.marker.AdvancedMarkerElementOptions, 'gmpDraggable'> &
    AdvancedMarkerEventProps & {
      /**
       * className to add a class to the advanced marker element
       * Can only be used with HTML Marker content
       */
      className?: string;
      draggable?: boolean;
    }
>;

export type AdvancedMarkerRef = google.maps.marker.AdvancedMarkerElement | null;
function useAdvancedMarker(props: AdvancedMarkerProps) {
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [contentContainer, setContentContainer] =
    useState<HTMLDivElement | null>(null);

  const map = useContext(GoogleMapsContext)?.map;
  const markerLibrary = useMapsLibrary('marker');

  const {
    children,
    className,
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

  const numChilds = Children.count(children);

  // create marker instance and add it to the map when map becomes available
  useEffect(() => {
    if (!map || !markerLibrary) return;

    const newMarker = new markerLibrary.AdvancedMarkerElement();
    newMarker.map = map;

    setMarker(newMarker);

    // create container for marker content if there are children
    if (numChilds > 0) {
      const el = document.createElement('div');
      if (className) el.className = className;

      newMarker.content = el;

      setContentContainer(el);
    }

    return () => {
      newMarker.map = null;
      setMarker(null);
      setContentContainer(null);
    };
  }, [map, markerLibrary, numChilds]);

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

    useImperativeHandle(ref, () => marker, [marker]);

    if (!marker) {
      return null;
    }

    return (
      <AdvancedMarkerContext.Provider value={{marker}}>
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
