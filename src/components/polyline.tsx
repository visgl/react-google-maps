import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';

import {useMap} from '../hooks/use-map';
import {useMapsLibrary} from '../hooks/use-maps-library';
import {useMapsEventListener} from '../hooks/use-maps-event-listener';

import type {Ref} from 'react';

type PolylineEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
};

export type PolylineProps = Omit<google.maps.PolylineOptions, 'map'> &
  PolylineEventProps & {
    /**
     * An encoded polyline string as created by the encoding algorithm.
     * (https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
     * When provided, will be decoded and used as the path.
     * Takes precedence over the `path` prop if both are specified.
     */
    encodedPath?: string;
  };

export type PolylineRef = Ref<google.maps.Polyline | null>;

function usePolyline(props: PolylineProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    encodedPath,
    path,
    ...polylineOptions
  } = props;

  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const map = useMap();

  const geometryLibrary = useMapsLibrary('geometry');

  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Polyline> has to be inside a Map component.');

      return;
    }

    const polylineOptionsWithPath: google.maps.PolylineOptions = {
      ...polylineOptions
    };

    // Google Maps throws "not an Array" error if path is undefined
    if (path && Array.isArray(path)) {
      polylineOptionsWithPath.path = path;
    }

    const newPolyline = new google.maps.Polyline(polylineOptionsWithPath);
    newPolyline.setMap(map);
    setPolyline(newPolyline);

    return () => {
      newPolyline.setMap(null);
      setPolyline(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options are handled separately to avoid recreating the instance
  }, [map]);

  useMapsEventListener(polyline, 'click', onClick);
  useMapsEventListener(polyline, 'drag', onDrag);
  useMapsEventListener(polyline, 'dragstart', onDragStart);
  useMapsEventListener(polyline, 'dragend', onDragEnd);
  useMapsEventListener(polyline, 'mouseover', onMouseOver);
  useMapsEventListener(polyline, 'mouseout', onMouseOut);

  useEffect(() => {
    if (!polyline) return;

    polyline.setOptions(polylineOptions);
  }, [polyline, polylineOptions]);

  useEffect(() => {
    if (!polyline || !path) return;

    polyline.setPath(path);
  }, [polyline, path]);

  useEffect(() => {
    if (!polyline || !encodedPath || !geometryLibrary) return;

    const decodedPath = geometryLibrary.encoding.decodePath(encodedPath);
    polyline.setPath(decodedPath);
  }, [polyline, encodedPath, geometryLibrary]);

  return polyline;
}

export const Polyline = forwardRef((props: PolylineProps, ref: PolylineRef) => {
  const polyline = usePolyline(props);

  useImperativeHandle(ref, () => polyline as google.maps.Polyline, [polyline]);

  return <></>;
});

Polyline.displayName = 'Polyline';
