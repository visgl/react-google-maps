import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';

import {useMap} from '../hooks/use-map';
import {useMapsEventListener} from '../hooks/use-maps-event-listener';
import {latLngEquals} from '../libraries/lat-lng-utils';

import type {Ref} from 'react';

type CircleEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
  onRadiusChanged?: (radius: number) => void;
  onCenterChanged?: (center: google.maps.LatLng | null | undefined) => void;
};

export type CircleProps = Omit<
  google.maps.CircleOptions,
  'map' | 'center' | 'radius'
> &
  CircleEventProps & {
    /** Controlled center position */
    center?: google.maps.LatLngLiteral | google.maps.LatLng;
    /** Uncontrolled initial center position */
    defaultCenter?: google.maps.LatLngLiteral | google.maps.LatLng;
    /** Controlled radius in meters */
    radius?: number;
    /** Uncontrolled initial radius in meters */
    defaultRadius?: number;
  };

export type CircleRef = Ref<google.maps.Circle | null>;

function useCircle(props: CircleProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onRadiusChanged,
    onCenterChanged,
    center,
    defaultCenter,
    radius,
    defaultRadius,
    ...circleOptions
  } = props;

  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const map = useMap();

  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Circle> has to be inside a Map component.');

      return;
    }

    const newCircle = new google.maps.Circle({
      ...circleOptions,
      center: center ?? defaultCenter,
      radius: radius ?? defaultRadius
    });
    newCircle.setMap(map);
    setCircle(newCircle);

    return () => {
      newCircle.setMap(null);
      setCircle(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- circle options are handled separately to avoid recreating the instance
  }, [map]);

  useMapsEventListener(circle, 'click', onClick);
  useMapsEventListener(circle, 'drag', onDrag);
  useMapsEventListener(circle, 'dragstart', onDragStart);
  useMapsEventListener(circle, 'dragend', onDragEnd);
  useMapsEventListener(circle, 'mouseover', onMouseOver);
  useMapsEventListener(circle, 'mouseout', onMouseOut);
  useMapsEventListener(
    circle,
    'radius_changed',
    onRadiusChanged
      ? () => {
          const newRadius = circle?.getRadius();
          if (newRadius !== undefined) onRadiusChanged(newRadius);
        }
      : null
  );
  useMapsEventListener(
    circle,
    'center_changed',
    onCenterChanged
      ? () => {
          onCenterChanged(circle?.getCenter());
        }
      : null
  );

  useEffect(() => {
    if (!circle) return;

    circle.setOptions(circleOptions);
  }, [circle, circleOptions]);

  // Sync controlled center prop with the circle instance
  useEffect(() => {
    if (!circle || !center) return;

    if (!latLngEquals(center, circle.getCenter())) {
      circle.setCenter(center);
    }
  }, [circle, center]);

  // Sync controlled radius prop with the circle instance
  useEffect(() => {
    if (!circle || radius === undefined) return;

    if (radius !== circle.getRadius()) {
      circle.setRadius(radius);
    }
  }, [circle, radius]);

  return circle;
}

export const Circle = forwardRef((props: CircleProps, ref: CircleRef) => {
  const circle = useCircle(props);

  useImperativeHandle(ref, () => circle as google.maps.Circle, [circle]);

  return <></>;
});

Circle.displayName = 'Circle';
