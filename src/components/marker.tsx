/* eslint-disable complexity */
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';

import {GoogleMapsContext} from './map';

import type {Ref} from 'react';

type MarkerEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
};

export type MarkerProps = google.maps.MarkerOptions & MarkerEventProps;

export type MarkerRef = Ref<google.maps.Marker | null>;

function useMarker(props: MarkerProps) {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const map = useContext(GoogleMapsContext)?.map;

  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    ...markerOptions
  } = props;

  const {position, draggable} = markerOptions;

  // create marker instance and add to the map once the map is available
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Marker> has to be inside a Map component.');

      return;
    }

    const newMarker = new google.maps.Marker(markerOptions);
    newMarker.setMap(map);
    setMarker(newMarker);

    return () => {
      newMarker.setMap(null);
      setMarker(null);
    };
  }, [map]);

  // attach and re-attach event-handlers when any of the properties change
  useEffect(() => {
    if (!marker) return;

    const m = marker;

    // Add event listeners
    const gme = google.maps.event;

    if (onClick) gme.addListener(m, 'click', onClick);
    if (onDrag) gme.addListener(m, 'drag', onDrag);
    if (onDragStart) gme.addListener(m, 'dragstart', onDragStart);
    if (onDragEnd) gme.addListener(m, 'dragend', onDragEnd);
    if (onMouseOver) gme.addListener(m, 'mouseover', onMouseOver);
    if (onMouseOut) gme.addListener(m, 'mouseout', onMouseOut);

    marker.setDraggable(Boolean(draggable));

    return () => {
      gme.clearInstanceListeners(m);
    };
  }, [
    marker,
    draggable,
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut
  ]);

  // update markerOptions (note the dependencies aren't properly checked
  // here, we just assume that setOptions is smart enough to not waste a
  // lot of time updating values that didn't change)
  useEffect(() => {
    if (!marker) return;
    if (markerOptions) marker.setOptions(markerOptions);
  }, [marker, markerOptions]);

  // update position when changed
  useEffect(() => {
    // Should not update position when draggable
    if (draggable || !position || !marker) return;

    marker.setPosition(position);
  }, [draggable, position, marker]);

  return marker;
}

/**
 * Component to render a Google Maps Marker on a map
 */
export const Marker = forwardRef((props: MarkerProps, ref: MarkerRef) => {
  const marker = useMarker(props);

  useImperativeHandle(ref, () => marker, [marker]);

  return <></>;
});

export function useMarkerRef() {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  const refCallback = useCallback((m: google.maps.Marker | null) => {
    setMarker(m);
  }, []);

  return [refCallback, marker] as const;
}
