import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';

import isDeepEqual from 'fast-deep-equal';

import {useMap} from '../hooks/use-map';
import {useMapsEventListener} from '../hooks/use-maps-event-listener';
import {useMemoized} from '../hooks/use-memoized';
import {boundsEquals} from '../libraries/lat-lng-utils';

import type {Ref} from 'react';

type RectangleEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
  onBoundsChanged?: (
    bounds: google.maps.LatLngBounds | null | undefined
  ) => void;
};

export type RectangleProps = Omit<
  google.maps.RectangleOptions,
  'map' | 'bounds'
> &
  RectangleEventProps & {
    /** Controlled bounds */
    bounds?: google.maps.LatLngBoundsLiteral | google.maps.LatLngBounds;
    /** Uncontrolled initial bounds */
    defaultBounds?: google.maps.LatLngBoundsLiteral | google.maps.LatLngBounds;
  };

export type RectangleRef = Ref<google.maps.Rectangle | null>;

function useRectangle(props: RectangleProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onBoundsChanged,
    bounds,
    defaultBounds,
    ...destructuredOptions
  } = props;

  const [rectangle, setRectangle] = useState<google.maps.Rectangle | null>(
    null
  );
  const map = useMap();

  // Memoize options with automatic inference of clickable/draggable/editable
  const rectangleOptions = useMemoized(
    {
      ...destructuredOptions,
      clickable: destructuredOptions.clickable ?? Boolean(onClick),
      draggable:
        destructuredOptions.draggable ??
        Boolean(onDrag || onDragStart || onDragEnd || onBoundsChanged),
      editable: destructuredOptions.editable ?? Boolean(onBoundsChanged)
    },
    isDeepEqual
  );

  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Rectangle> has to be inside a Map component.');

      return;
    }

    const newRectangle = new google.maps.Rectangle({
      ...rectangleOptions,
      bounds: bounds ?? defaultBounds
    });
    newRectangle.setMap(map);
    setRectangle(newRectangle);

    return () => {
      newRectangle.setMap(null);
      setRectangle(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rectangle options are handled separately to avoid recreating the instance
  }, [map]);

  useMapsEventListener(rectangle, 'click', onClick);
  useMapsEventListener(rectangle, 'drag', onDrag);
  useMapsEventListener(rectangle, 'dragstart', onDragStart);
  useMapsEventListener(rectangle, 'dragend', onDragEnd);
  useMapsEventListener(rectangle, 'mouseover', onMouseOver);
  useMapsEventListener(rectangle, 'mouseout', onMouseOut);
  useMapsEventListener(
    rectangle,
    'bounds_changed',
    onBoundsChanged
      ? () => {
          onBoundsChanged(rectangle?.getBounds());
        }
      : null
  );

  useEffect(() => {
    if (!rectangle) return;

    rectangle.setOptions(rectangleOptions);
  }, [rectangle, rectangleOptions]);

  // Sync controlled bounds prop with the rectangle instance
  useEffect(() => {
    if (!rectangle || !bounds) return;

    if (!boundsEquals(bounds, rectangle.getBounds())) {
      rectangle.setBounds(bounds);
    }
  }, [rectangle, bounds]);

  return rectangle;
}

export const Rectangle = forwardRef(
  (props: RectangleProps, ref: RectangleRef) => {
    const rectangle = useRectangle(props);

    useImperativeHandle(ref, () => rectangle as google.maps.Rectangle, [
      rectangle
    ]);

    return <></>;
  }
);

Rectangle.displayName = 'Rectangle';
