import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
  DrawResult,
  DrawingMode,
  OverlayGeometry,
  OverlayType,
  setOverlayMap
} from './types';

export interface DrawingController {
  eventTarget: google.maps.MVCObject | null;
  activeMode: DrawingMode;
  setActiveMode: (mode: DrawingMode) => void;
}

const DEFAULT_ACTIVE_MODE: DrawingMode = 'circle';

export function useDrawingManager(
  initialMode: DrawingMode = DEFAULT_ACTIVE_MODE
): DrawingController {
  const map = useMap();
  const geometry = useMapsLibrary('geometry');
  const markerLibrary = useMapsLibrary('marker');

  const [activeMode, setActiveModeState] = useState<DrawingMode>(initialMode);
  const activeModeRef = useRef(activeMode);
  const [eventTarget, setEventTarget] = useState<google.maps.MVCObject | null>(
    null
  );
  const eventTargetRef = useRef<google.maps.MVCObject | null>(null);
  const isDrawingRef = useRef(false);
  const startPointRef = useRef<google.maps.LatLng | null>(null);
  const pathRef = useRef<Array<google.maps.LatLng>>([]);
  const inProgressOverlayRef = useRef<OverlayGeometry | null>(null);
  const firstVertexMarkerRef = useRef<
    google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null
  >(null);
  const inProgressListenersRef = useRef<Array<google.maps.MapsEventListener>>(
    []
  );

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    if (!eventTargetRef.current && map) {
      const target = new google.maps.MVCObject();
      eventTargetRef.current = target;
      setEventTarget(target);
    }
  }, [map]);

  const clearFirstVertexMarker = useCallback(() => {
    const marker = firstVertexMarkerRef.current;

    if (!marker) return;

    google.maps.event.clearInstanceListeners(marker);
    setOverlayMap(marker, null);
    firstVertexMarkerRef.current = null;
  }, []);

  const clearInProgressListeners = useCallback(() => {
    if (!inProgressListenersRef.current.length) return;

    inProgressListenersRef.current.forEach(listener => {
      google.maps.event.removeListener(listener);
    });

    inProgressListenersRef.current = [];
  }, []);

  const setDrawingCursor = useCallback(
    (cursor: string | null) => {
      if (!map) return;

      map.setOptions({
        draggableCursor: cursor
      });
    },
    [map]
  );

  const resetDrawingState = useCallback(
    (removeOverlay: boolean) => {
      const overlay = inProgressOverlayRef.current;

      if (overlay && removeOverlay) {
        setOverlayMap(overlay, null);
      }

      clearInProgressListeners();
      clearFirstVertexMarker();
      inProgressOverlayRef.current = null;
      isDrawingRef.current = false;
      startPointRef.current = null;
      pathRef.current = [];
      setDrawingCursor(null);
    },
    [clearFirstVertexMarker, clearInProgressListeners, setDrawingCursor]
  );

  const finalizeOverlay = useCallback(
    (type: OverlayType, overlay: OverlayGeometry) => {
      if ('getPath' in overlay && pathRef.current.length) {
        overlay.setPath(pathRef.current);
      }

      if (type === 'circle') {
        (overlay as google.maps.Circle).setOptions({
          editable: false,
          clickable: true
        });
      }

      if (type === 'rectangle') {
        (overlay as google.maps.Rectangle).setOptions({
          editable: false,
          draggable: false,
          clickable: true
        });
      }

      if (type === 'polygon' || type === 'polyline') {
        const editableOverlay = overlay as
          | google.maps.Polygon
          | google.maps.Polyline;

        editableOverlay.setOptions({
          editable: false,
          draggable: false,
          clickable: true
        });
      }

      clearInProgressListeners();
      clearFirstVertexMarker();
      inProgressOverlayRef.current = null;
      isDrawingRef.current = false;
      startPointRef.current = null;
      pathRef.current = [];
      setDrawingCursor(null);

      if (eventTargetRef.current) {
        const payload: DrawResult = {type, overlay};
        google.maps.event.trigger(
          eventTargetRef.current,
          'overlaycomplete',
          payload
        );
      }
    },
    [clearFirstVertexMarker, setDrawingCursor]
  );

  const cancelDrawing = useCallback(
    (resetMode: boolean) => {
      resetDrawingState(true);

      if (resetMode) {
        setActiveModeState(null);
      }
    },
    [resetDrawingState]
  );

  const setActiveMode = useCallback(
    (mode: DrawingMode) => {
      setActiveModeState(previous => {
        if (previous === mode) {
          cancelDrawing(true);
          return null;
        }

        resetDrawingState(true);
        return mode;
      });
    },
    [cancelDrawing, resetDrawingState]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!activeModeRef.current && !isDrawingRef.current) return;

        cancelDrawing(true);
        return;
      }

      // Enter finishes the active in-progress shape.
      if (event.key !== 'Enter') return;

      if (!isDrawingRef.current) return;

      const overlay = inProgressOverlayRef.current;
      const mode = activeModeRef.current;

      if (!overlay || !mode) return;

      if (mode === 'polygon' || mode === 'polyline') {
        finalizeOverlay(
          mode,
          overlay as google.maps.Polygon | google.maps.Polyline
        );
        return;
      }

      if (mode === 'circle') {
        finalizeOverlay('circle', overlay as google.maps.Circle);
        return;
      }

      if (mode === 'rectangle') {
        finalizeOverlay('rectangle', overlay as google.maps.Rectangle);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cancelDrawing]);

  useEffect(() => {
    if (!map) return;

    const computeRadius = (
      start: google.maps.LatLng,
      end: google.maps.LatLng
    ) => {
      if (geometry?.spherical?.computeDistanceBetween) {
        return geometry.spherical.computeDistanceBetween(start, end);
      }

      if (google.maps.geometry?.spherical?.computeDistanceBetween) {
        return google.maps.geometry.spherical.computeDistanceBetween(
          start,
          end
        );
      }

      return 0;
    };

    // Visible first-vertex marker enables polygon close by clicking the start.
    const createFirstVertexMarker = (position: google.maps.LatLng) => {
      const AdvancedMarker =
        markerLibrary?.AdvancedMarkerElement ??
        google.maps.marker?.AdvancedMarkerElement;

      if (!AdvancedMarker) return;

      const markerElement = document.createElement('div');
      markerElement.style.width = '14px';
      markerElement.style.height = '14px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.background = 'rgba(25, 82, 171, 0.9)';
      markerElement.style.border = '2px solid white';
      markerElement.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.35)';

      const marker = new AdvancedMarker({
        map,
        position,
        gmpClickable: true,
        zIndex: 1000,
        content: markerElement,
        anchorTop: '-50%',
        anchorLeft: '-50%'
      });

      const listener = marker.addListener('click', () => {
        if (!isDrawingRef.current) return;
        if (activeModeRef.current !== 'polygon') return;

        const overlay = inProgressOverlayRef.current;

        if (overlay && 'getPath' in overlay) {
          finalizeOverlay('polygon', overlay as google.maps.Polygon);
        }
      });

      firstVertexMarkerRef.current = marker;

      return () => {
        google.maps.event.removeListener(listener);
        setOverlayMap(marker, null);
      };
    };

    const handleClick = (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const mode = activeModeRef.current;

      if (!mode) return;

      if (mode === 'marker') {
        const AdvancedMarker =
          markerLibrary?.AdvancedMarkerElement ??
          google.maps.marker?.AdvancedMarkerElement;

        if (!AdvancedMarker) return;

        const marker = new AdvancedMarker({
          map,
          position: event.latLng,
          gmpDraggable: true
        });

        finalizeOverlay('marker', marker);
        return;
      }

      if (mode === 'circle') {
        if (!isDrawingRef.current) {
          const circle = new google.maps.Circle({
            map,
            center: event.latLng,
            radius: 0,
            editable: false,
            clickable: true
          });

          inProgressOverlayRef.current = circle;
          startPointRef.current = event.latLng;
          isDrawingRef.current = true;
          setDrawingCursor('crosshair');

          inProgressListenersRef.current = [
            google.maps.event.addListener(circle, 'mousemove', handleMouseMove),
            google.maps.event.addListener(circle, 'click', handleClick)
          ];
          return;
        }

        const circle =
          inProgressOverlayRef.current as google.maps.Circle | null;

        if (!circle || !startPointRef.current) return;

        const radius = computeRadius(startPointRef.current, event.latLng);
        circle.setRadius(radius);
        circle.setCenter(startPointRef.current);
        finalizeOverlay('circle', circle);
        return;
      }

      if (mode === 'rectangle') {
        if (!isDrawingRef.current) {
          const bounds = new google.maps.LatLngBounds(
            event.latLng,
            event.latLng
          );
          const rectangle = new google.maps.Rectangle({
            map,
            bounds,
            editable: false,
            draggable: false,
            clickable: true
          });

          inProgressOverlayRef.current = rectangle;
          startPointRef.current = event.latLng;
          isDrawingRef.current = true;
          setDrawingCursor('crosshair');

          inProgressListenersRef.current = [
            google.maps.event.addListener(
              rectangle,
              'mousemove',
              handleMouseMove
            ),
            google.maps.event.addListener(rectangle, 'click', handleClick)
          ];
          return;
        }

        const rectangle =
          inProgressOverlayRef.current as google.maps.Rectangle | null;

        if (!rectangle || !startPointRef.current) return;

        const bounds = new google.maps.LatLngBounds(
          startPointRef.current,
          event.latLng
        );
        rectangle.setBounds(bounds);
        finalizeOverlay('rectangle', rectangle);
        return;
      }

      if (mode === 'polygon' || mode === 'polyline') {
        if (!isDrawingRef.current) {
          pathRef.current = [event.latLng];

          const overlay =
            mode === 'polygon'
              ? new google.maps.Polygon({
                  map,
                  paths: pathRef.current,
                  editable: false,
                  draggable: false,
                  clickable: false
                })
              : new google.maps.Polyline({
                  map,
                  path: pathRef.current,
                  editable: false,
                  draggable: false,
                  clickable: false
                });

          inProgressOverlayRef.current = overlay;
          isDrawingRef.current = true;
          setDrawingCursor('crosshair');

          if (mode === 'polygon') {
            createFirstVertexMarker(event.latLng);
          }

          return;
        }

        pathRef.current = [...pathRef.current, event.latLng];

        const overlay = inProgressOverlayRef.current as
          | google.maps.Polygon
          | google.maps.Polyline
          | null;

        if (!overlay) return;

        overlay.setPath(pathRef.current);
      }
    };

    const handleMouseMove = (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const mode = activeModeRef.current;

      if (!mode || !isDrawingRef.current) return;

      if (mode === 'circle') {
        const circle =
          inProgressOverlayRef.current as google.maps.Circle | null;

        if (!circle || !startPointRef.current) return;

        const radius = computeRadius(startPointRef.current, event.latLng);
        circle.setRadius(radius);
        circle.setCenter(startPointRef.current);
      }

      if (mode === 'rectangle') {
        const rectangle =
          inProgressOverlayRef.current as google.maps.Rectangle | null;

        if (!rectangle || !startPointRef.current) return;

        const bounds = new google.maps.LatLngBounds(
          startPointRef.current,
          event.latLng
        );
        rectangle.setBounds(bounds);
      }

      if (mode === 'polygon' || mode === 'polyline') {
        const overlay = inProgressOverlayRef.current as
          | google.maps.Polygon
          | google.maps.Polyline
          | null;

        if (!overlay) return;

        const previewPath = [...pathRef.current, event.latLng];
        overlay.setPath(previewPath);
      }
    };

    const handleDoubleClick = (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      event.domEvent?.preventDefault?.();
      event.domEvent?.stopPropagation?.();

      const mode = activeModeRef.current;

      if (!mode || !isDrawingRef.current) return;

      if (mode !== 'polygon' && mode !== 'polyline') return;

      const overlay = inProgressOverlayRef.current as
        | google.maps.Polygon
        | google.maps.Polyline
        | null;

      if (!overlay) return;

      const path = pathRef.current;
      const lastPoint = path[path.length - 1];

      if (lastPoint && event.latLng.equals(lastPoint)) {
        pathRef.current = path.slice(0, -1);
        overlay.setPath(pathRef.current);
      }

      finalizeOverlay(mode, overlay);
    };

    const clickListener = map.addListener('click', handleClick);
    const moveListener = map.addListener('mousemove', handleMouseMove);
    const dblClickListener = map.addListener('dblclick', handleDoubleClick);

    return () => {
      google.maps.event.removeListener(clickListener);
      google.maps.event.removeListener(moveListener);
      google.maps.event.removeListener(dblClickListener);
    };
  }, [finalizeOverlay, geometry, map, setDrawingCursor]);

  return useMemo(
    () => ({
      eventTarget,
      activeMode,
      setActiveMode
    }),
    [activeMode, eventTarget, setActiveMode]
  );
}
