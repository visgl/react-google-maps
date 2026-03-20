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
import {pathEquals} from '../libraries/lat-lng-utils';

import type {Ref} from 'react';

type PolylineEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
  onPathChanged?: (path: google.maps.LatLng[]) => void;
};

type PathType =
  | google.maps.MVCArray<google.maps.LatLng>
  | Array<google.maps.LatLng | google.maps.LatLngLiteral>;

export type PolylineProps = Omit<google.maps.PolylineOptions, 'map' | 'path'> &
  PolylineEventProps & {
    /**
     * An existing Polyline instance to use instead of creating a new one.
     * Other props will still be applied to this instance.
     */
    polyline?: google.maps.Polyline;
    /**
     * An encoded polyline string as created by the encoding algorithm.
     * (https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
     * When provided, will be decoded and used as the path.
     * Takes precedence over the `path` prop if both are specified.
     */
    encodedPath?: string;
    /** Controlled path */
    path?: PathType;
    /** Uncontrolled initial path */
    defaultPath?: PathType;
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
    onPathChanged,
    polyline: externalPolyline,
    encodedPath,
    path,
    defaultPath,
    ...destructuredOptions
  } = props;

  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
  const map = useMap();
  const geometryLibrary = useMapsLibrary('geometry');

  // Track if we're programmatically updating to avoid firing onPathChanged
  const isUpdatingRef = useRef(false);

  // Memoize options with automatic inference of clickable/draggable/editable
  const polylineOptions = useMemoized(
    {
      ...destructuredOptions,
      clickable: destructuredOptions.clickable ?? Boolean(onClick),
      draggable:
        destructuredOptions.draggable ??
        Boolean(onDrag || onDragStart || onDragEnd || onPathChanged),
      editable: destructuredOptions.editable ?? Boolean(onPathChanged)
    },
    isDeepEqual
  );

  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error('<Polyline> has to be inside a Map component.');

      return;
    }

    // Use provided instance or create a new one
    let instance: google.maps.Polyline;

    if (externalPolyline) {
      instance = externalPolyline;
      // Apply initial path and options to the existing instance
      const initialPath = path ?? defaultPath;
      if (initialPath && Array.isArray(initialPath)) {
        instance.setPath(initialPath);
      }
      instance.setOptions(polylineOptions);
    } else {
      const initialPath = path ?? defaultPath;
      const polylineOptionsWithPath: google.maps.PolylineOptions = {
        ...polylineOptions
      };

      // Google Maps throws "not an Array" error if path is undefined
      if (initialPath && Array.isArray(initialPath)) {
        polylineOptionsWithPath.path = initialPath;
      }

      instance = new google.maps.Polyline(polylineOptionsWithPath);
    }

    instance.setMap(map);
    setPolyline(instance);

    return () => {
      instance.setMap(null);
      setPolyline(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options are handled separately to avoid recreating the instance
  }, [map, externalPolyline]);

  useMapsEventListener(polyline, 'click', onClick);
  useMapsEventListener(polyline, 'drag', onDrag);
  useMapsEventListener(polyline, 'dragstart', onDragStart);
  useMapsEventListener(polyline, 'mouseover', onMouseOver);
  useMapsEventListener(polyline, 'mouseout', onMouseOut);

  // Fire onPathChanged on dragend (when whole polyline is dragged)
  useMapsEventListener(polyline, 'dragend', (e: google.maps.MapMouseEvent) => {
    onDragEnd?.(e);
    if (onPathChanged && polyline && !isUpdatingRef.current) {
      onPathChanged(polyline.getPath().getArray());
    }
  });

  // Subscribe to MVCArray events for vertex-level edits
  useEffect(() => {
    if (!polyline || !onPathChanged) return;

    const mvcPath = polyline.getPath();
    if (!mvcPath) return;

    const handlePathChange = () => {
      if (!isUpdatingRef.current) {
        onPathChanged(mvcPath.getArray());
      }
    };

    const listeners = [
      google.maps.event.addListener(mvcPath, 'insert_at', handlePathChange),
      google.maps.event.addListener(mvcPath, 'remove_at', handlePathChange),
      google.maps.event.addListener(mvcPath, 'set_at', handlePathChange)
    ];

    return () => {
      listeners.forEach(listener => listener.remove());
    };
  }, [
    polyline,
    onPathChanged,
    path,
    encodedPath,
    polylineOptions.editable,
    polylineOptions.draggable
  ]);

  useEffect(() => {
    if (!polyline) return;

    polyline.setOptions(polylineOptions);
  }, [polyline, polylineOptions]);

  // Sync controlled path prop with the polyline instance
  useEffect(() => {
    if (!polyline || !path) return;

    const currentPath = polyline.getPath();
    if (!pathEquals(path as google.maps.LatLngLiteral[], currentPath)) {
      isUpdatingRef.current = true;
      polyline.setPath(path);
      isUpdatingRef.current = false;
    }
  }, [polyline, path]);

  // Handle encoded path
  useEffect(() => {
    if (!polyline || !encodedPath || !geometryLibrary) return;

    isUpdatingRef.current = true;
    const decodedPath = geometryLibrary.encoding.decodePath(encodedPath);
    polyline.setPath(decodedPath);
    isUpdatingRef.current = false;
  }, [polyline, encodedPath, geometryLibrary]);

  return polyline;
}

export const Polyline = forwardRef((props: PolylineProps, ref: PolylineRef) => {
  const polyline = usePolyline(props);

  useImperativeHandle(ref, () => polyline as google.maps.Polyline, [polyline]);

  return <></>;
});

Polyline.displayName = 'Polyline';
