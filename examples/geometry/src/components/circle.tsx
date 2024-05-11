/* eslint-disable complexity */
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react';

import type {Ref} from 'react';
import {GoogleMapsContext, latLngEquals} from '@vis.gl/react-google-maps';

type CircleEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
  onRadiusChanged?: (r: ReturnType<google.maps.Circle['getRadius']>) => void;
  onCenterChanged?: (p: ReturnType<google.maps.Circle['getCenter']>) => void;
};

export type CircleProps = google.maps.CircleOptions & CircleEventProps;

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
    radius,
    center,
    ...circleOptions
  } = props;
  // This is here to avoid triggering the useEffect below when the callbacks change (which happen if the user didn't memoize them)
  const callbacks = useRef<Record<string, (e: unknown) => void>>({});
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onRadiusChanged,
    onCenterChanged
  });

  const circle = useRef(new google.maps.Circle()).current;
  // update circleOptions (note the dependencies aren't properly checked
  // here, we just assume that setOptions is smart enough to not waste a
  // lot of time updating values that didn't change)
  circle.setOptions(circleOptions);

  useEffect(() => {
    if (!center) return;
    if (!latLngEquals(center, circle.getCenter())) circle.setCenter(center);
  }, [center]);

  useEffect(() => {
    if (radius === undefined || radius === null) return;
    if (radius !== circle.getRadius()) circle.setRadius(radius);
  }, [radius]);

  const map = useContext(GoogleMapsContext)?.map;

  // create circle instance and add to the map once the map is available
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Circle> has to be inside a Map component.');

      return;
    }

    circle.setMap(map);

    return () => {
      circle.setMap(null);
    };
  }, [map]);

  // attach and re-attach event-handlers when any of the properties change
  useEffect(() => {
    if (!circle) return;

    // Add event listeners
    const gme = google.maps.event;
    [
      ['click', 'onClick'],
      ['drag', 'onDrag'],
      ['dragstart', 'onDragStart'],
      ['dragend', 'onDragEnd'],
      ['mouseover', 'onMouseOver'],
      ['mouseout', 'onMouseOut']
    ].forEach(([eventName, eventCallback]) => {
      gme.addListener(circle, eventName, (e: google.maps.MapMouseEvent) => {
        const callback = callbacks.current[eventCallback];
        if (callback) callback(e);
      });
    });
    gme.addListener(circle, 'radius_changed', () => {
      const newRadius = circle.getRadius();
      callbacks.current.onRadiusChanged?.(newRadius);
    });
    gme.addListener(circle, 'center_changed', () => {
      const newCenter = circle.getCenter();
      callbacks.current.onCenterChanged?.(newCenter);
    });

    return () => {
      gme.clearInstanceListeners(circle);
    };
  }, [circle]);

  return circle;
}

/**
 * Component to render a circle on a map
 */
export const Circle = forwardRef((props: CircleProps, ref: CircleRef) => {
  const circle = useCircle(props);

  useImperativeHandle(ref, () => circle);

  return null;
});
