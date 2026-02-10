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

type PolygonEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
};

export type PolygonProps = Omit<google.maps.PolygonOptions, 'map'> &
  PolygonEventProps & {
    /**
     * An array of encoded polyline strings as created by the encoding algorithm.
     * (https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
     * When provided, will be decoded and used as the paths.
     * Takes precedence over the `paths` prop if both are specified.
     */
    encodedPaths?: string[];
  };

export type PolygonRef = Ref<google.maps.Polygon | null>;

function usePolygon(props: PolygonProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    encodedPaths,
    paths,
    ...polygonOptions
  } = props;

  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const map = useMap();

  const geometryLibrary = useMapsLibrary('geometry');

  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Polygon> has to be inside a Map component.');

      return;
    }

    const polygonOptionsWithPaths: google.maps.PolygonOptions = {
      ...polygonOptions
    };

    // Google Maps throws "not an Array" error if paths is undefined
    if (paths && Array.isArray(paths)) {
      polygonOptionsWithPaths.paths = paths;
    }

    const newPolygon = new google.maps.Polygon(polygonOptionsWithPaths);
    newPolygon.setMap(map);
    setPolygon(newPolygon);

    return () => {
      newPolygon.setMap(null);
      setPolygon(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options are handled separately to avoid recreating the instance
  }, [map]);

  useMapsEventListener(polygon, 'click', onClick);
  useMapsEventListener(polygon, 'drag', onDrag);
  useMapsEventListener(polygon, 'dragstart', onDragStart);
  useMapsEventListener(polygon, 'dragend', onDragEnd);
  useMapsEventListener(polygon, 'mouseover', onMouseOver);
  useMapsEventListener(polygon, 'mouseout', onMouseOut);

  useEffect(() => {
    if (!polygon) return;

    polygon.setOptions(polygonOptions);
  }, [polygon, polygonOptions]);

  useEffect(() => {
    if (!polygon || !paths) return;

    polygon.setPaths(paths);
  }, [polygon, paths]);

  useEffect(() => {
    if (!polygon || !encodedPaths || !geometryLibrary) return;

    const decodedPaths = encodedPaths.map(encodedPath =>
      geometryLibrary.encoding.decodePath(encodedPath)
    );
    polygon.setPaths(decodedPaths);
  }, [polygon, encodedPaths, geometryLibrary]);

  return polygon;
}

export const Polygon = forwardRef((props: PolygonProps, ref: PolygonRef) => {
  const polygon = usePolygon(props);

  useImperativeHandle(ref, () => polygon as google.maps.Polygon, [polygon]);

  return <></>;
});

Polygon.displayName = 'Polygon';
