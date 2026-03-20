import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

import isDeepEqual from 'fast-deep-equal';

import {useMap} from '../hooks/use-map';
import {useMapsLibrary} from '../hooks/use-maps-library';
import {useMapsEventListener} from '../hooks/use-maps-event-listener';
import {useMemoized} from '../hooks/use-memoized';
import {pathsEquals} from '../libraries/lat-lng-utils';

import type {Ref} from 'react';

type PolygonEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
  onPathsChanged?: (paths: google.maps.LatLng[][]) => void;
};

type PathsType =
  | google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>
  | google.maps.MVCArray<google.maps.LatLng>
  | Array<google.maps.LatLng | google.maps.LatLngLiteral>
  | Array<Array<google.maps.LatLng | google.maps.LatLngLiteral>>;

export type PolygonProps = Omit<google.maps.PolygonOptions, 'map' | 'paths'> &
  PolygonEventProps & {
    /**
     * An existing Polygon instance to use instead of creating a new one.
     * Other props will still be applied to this instance.
     */
    polygon?: google.maps.Polygon;
    /**
     * An array of encoded polyline strings as created by the encoding algorithm.
     * (https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
     * When provided, will be decoded and used as the paths.
     * Takes precedence over the `paths` prop if both are specified.
     */
    encodedPaths?: string[];
    /** Controlled paths */
    paths?: PathsType;
    /** Uncontrolled initial paths */
    defaultPaths?: PathsType;
  };

export type PolygonRef = Ref<google.maps.Polygon | null>;

/**
 * Extracts paths as a nested array from a Polygon instance.
 */
function getPathsArray(polygon: google.maps.Polygon): google.maps.LatLng[][] {
  const mvcPaths = polygon.getPaths();
  const result: google.maps.LatLng[][] = [];
  for (let i = 0; i < mvcPaths.getLength(); i++) {
    result.push(mvcPaths.getAt(i).getArray());
  }
  return result;
}

function usePolygon(props: PolygonProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    onPathsChanged,
    polygon: externalPolygon,
    encodedPaths,
    paths,
    defaultPaths,
    ...destructuredOptions
  } = props;

  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
  const map = useMap();
  const geometryLibrary = useMapsLibrary('geometry');

  // Track if we're programmatically updating to avoid firing onPathsChanged
  const isUpdatingRef = useRef(false);

  // Memoize options with automatic inference of clickable/draggable/editable
  const polygonOptions = useMemoized(
    {
      ...destructuredOptions,
      clickable: destructuredOptions.clickable ?? Boolean(onClick),
      draggable:
        destructuredOptions.draggable ??
        Boolean(onDrag || onDragStart || onDragEnd || onPathsChanged),
      editable: destructuredOptions.editable ?? Boolean(onPathsChanged)
    },
    isDeepEqual
  );

  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Polygon> has to be inside a Map component.');

      return;
    }

    // Use provided instance or create a new one
    let instance: google.maps.Polygon;

    if (externalPolygon) {
      instance = externalPolygon;
      // Apply initial paths and options to the existing instance
      const initialPaths = paths ?? defaultPaths;
      if (initialPaths && Array.isArray(initialPaths)) {
        instance.setPaths(initialPaths);
      }
      instance.setOptions(polygonOptions);
    } else {
      const initialPaths = paths ?? defaultPaths;
      const polygonOptionsWithPaths: google.maps.PolygonOptions = {
        ...polygonOptions
      };

      // Google Maps throws "not an Array" error if paths is undefined
      if (initialPaths && Array.isArray(initialPaths)) {
        polygonOptionsWithPaths.paths = initialPaths;
      }

      instance = new google.maps.Polygon(polygonOptionsWithPaths);
    }

    instance.setMap(map);
    setPolygon(instance);

    return () => {
      instance.setMap(null);
      setPolygon(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options are handled separately to avoid recreating the instance
  }, [map, externalPolygon]);

  useMapsEventListener(polygon, 'click', onClick);
  useMapsEventListener(polygon, 'drag', onDrag);
  useMapsEventListener(polygon, 'dragstart', onDragStart);
  useMapsEventListener(polygon, 'mouseover', onMouseOver);
  useMapsEventListener(polygon, 'mouseout', onMouseOut);

  // Fire onPathsChanged on dragend (when whole polygon is dragged)
  useMapsEventListener(polygon, 'dragend', (e: google.maps.MapMouseEvent) => {
    onDragEnd?.(e);
    if (onPathsChanged && polygon && !isUpdatingRef.current) {
      onPathsChanged(getPathsArray(polygon));
    }
  });

  // Subscribe to MVCArray events for vertex-level edits
  useEffect(() => {
    if (!polygon || !onPathsChanged) return;

    const listeners: google.maps.MapsEventListener[] = [];
    const mvcPaths = polygon.getPaths();

    if (
      typeof (mvcPaths as unknown as {getLength?: unknown}).getLength !==
        'function' ||
      typeof (mvcPaths as unknown as {getAt?: unknown}).getAt !== 'function'
    ) {
      return;
    }

    const handlePathsChange = () => {
      if (!isUpdatingRef.current) {
        onPathsChanged(getPathsArray(polygon));
      }
    };

    // Subscribe to each inner path's events
    const subscribeToInnerPath = (
      innerPath: google.maps.MVCArray<google.maps.LatLng>
    ) => {
      listeners.push(
        google.maps.event.addListener(innerPath, 'insert_at', handlePathsChange)
      );
      listeners.push(
        google.maps.event.addListener(innerPath, 'remove_at', handlePathsChange)
      );
      listeners.push(
        google.maps.event.addListener(innerPath, 'set_at', handlePathsChange)
      );
    };

    // Subscribe to existing inner paths
    for (let i = 0; i < mvcPaths.getLength(); i++) {
      subscribeToInnerPath(mvcPaths.getAt(i));
    }

    // Subscribe to outer array changes (paths added/removed)
    listeners.push(
      google.maps.event.addListener(mvcPaths, 'insert_at', (index: number) => {
        subscribeToInnerPath(mvcPaths.getAt(index));
        handlePathsChange();
      })
    );
    listeners.push(
      google.maps.event.addListener(mvcPaths, 'set_at', (index: number) => {
        subscribeToInnerPath(mvcPaths.getAt(index));
        handlePathsChange();
      })
    );
    listeners.push(
      google.maps.event.addListener(mvcPaths, 'remove_at', handlePathsChange)
    );

    return () => {
      listeners.forEach(listener => listener.remove());
    };
  }, [
    polygon,
    onPathsChanged,
    paths,
    encodedPaths,
    polygonOptions.editable,
    polygonOptions.draggable
  ]);

  useEffect(() => {
    if (!polygon) return;

    polygon.setOptions(polygonOptions);
  }, [polygon, polygonOptions]);

  // Sync controlled paths prop with the polygon instance
  useEffect(() => {
    if (!polygon || !paths) return;
    if (!Array.isArray(paths)) return;

    // Normalize to nested array for comparison
    const firstPath = paths[0];
    const normalizedPaths = Array.isArray(firstPath) ? paths : [paths];
    const currentPaths = polygon.getPaths();

    if (
      !pathsEquals(
        normalizedPaths as google.maps.LatLngLiteral[][],
        currentPaths
      )
    ) {
      isUpdatingRef.current = true;
      polygon.setPaths(paths);
      isUpdatingRef.current = false;
    }
  }, [polygon, paths]);

  // Handle encoded paths
  useEffect(() => {
    if (!polygon || !encodedPaths || !geometryLibrary) return;

    isUpdatingRef.current = true;
    const decodedPaths = encodedPaths.map(encodedPath =>
      geometryLibrary.encoding.decodePath(encodedPath)
    );
    polygon.setPaths(decodedPaths);
    isUpdatingRef.current = false;
  }, [polygon, encodedPaths, geometryLibrary]);

  return polygon;
}

export const Polygon = forwardRef((props: PolygonProps, ref: PolygonRef) => {
  const polygon = usePolygon(props);

  useImperativeHandle(ref, () => polygon as google.maps.Polygon, [polygon]);

  return <></>;
});

Polygon.displayName = 'Polygon';
