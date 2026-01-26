import {Dispatch, MutableRefObject, useEffect} from 'react';

import {
  Action,
  DrawResult,
  DrawingActionKind,
  Overlay,
  Snapshot,
  State,
  getMarkerPosition,
  isCircle,
  isMarker,
  isPolygon,
  isPolyline,
  isRectangle,
  setMarkerPosition,
  setOverlayMap
} from './types';

export default function reducer(state: State, action: Action) {
  switch (action.type) {
    // This action is called whenever anything changes on any overlay.
    // We then take a snapshot of the relevant values of each overlay and
    // save them as the new "now". The old "now" is added to the "past" stack
    case DrawingActionKind.UPDATE_OVERLAYS: {
      const overlays = state.now.map((overlay: Overlay) => {
        const snapshot: Snapshot = {};
        const {geometry} = overlay;

        if (isCircle(geometry)) {
          snapshot.center = geometry.getCenter()?.toJSON();
          snapshot.radius = geometry.getRadius();
        } else if (isMarker(geometry)) {
          snapshot.position = getMarkerPosition(geometry);
        } else if (isPolygon(geometry) || isPolyline(geometry)) {
          snapshot.path = geometry.getPath()?.getArray();
        } else if (isRectangle(geometry)) {
          snapshot.bounds = geometry.getBounds()?.toJSON();
        }

        return {
          ...overlay,
          snapshot
        };
      });

      return {
        now: [...overlays],
        past: [...state.past, state.now],
        future: []
      };
    }

    // This action is called when a new overlay is added to the map.
    // We then take a snapshot of the relevant values of the new overlay and
    // add it to the "now" state. The old "now" is added to the "past" stack
    case DrawingActionKind.SET_OVERLAY: {
      const {overlay} = action.payload;

      const snapshot: Snapshot = {};

      if (isCircle(overlay)) {
        snapshot.center = overlay.getCenter()?.toJSON();
        snapshot.radius = overlay.getRadius();
      } else if (isMarker(overlay)) {
        snapshot.position = getMarkerPosition(overlay);
      } else if (isPolygon(overlay) || isPolyline(overlay)) {
        snapshot.path = overlay.getPath()?.getArray();
      } else if (isRectangle(overlay)) {
        snapshot.bounds = overlay.getBounds()?.toJSON();
      }

      return {
        past: [...state.past, state.now],
        now: [
          ...state.now,
          {
            type: action.payload.type,
            geometry: action.payload.overlay,
            snapshot
          }
        ],
        future: []
      };
    }

    case DrawingActionKind.DELETE_OVERLAY: {
      const overlayToDelete = action.payload;
      const nextNow = state.now.filter(
        overlay => overlay.geometry !== overlayToDelete
      );

      if (nextNow.length === state.now.length) return state;

      return {
        past: [...state.past, state.now],
        now: nextNow,
        future: []
      };
    }

    // This action is called when the undo button is clicked.
    // Get the top item from the "past" stack and set it as the new "now".
    // Add the old "now" to the "future" stack to enable redo functionality
    case DrawingActionKind.UNDO: {
      const last = state.past.slice(-1)[0];

      if (!last) return state;

      return {
        past: [...state.past].slice(0, -1),
        now: last,
        future: state.now ? [...state.future, state.now] : state.future
      };
    }

    // This action is called when the redo button is clicked.
    // Get the top item from the "future" stack and set it as the new "now".
    // Add the old "now" to the "past" stack to enable undo functionality
    case DrawingActionKind.REDO: {
      const next = state.future.slice(-1)[0];

      if (!next) return state;

      return {
        past: state.now ? [...state.past, state.now] : state.past,
        now: next,
        future: [...state.future].slice(0, -1)
      };
    }
  }
}

// Handle drawing manager events
export function useDrawingManagerEvents(
  drawingController: google.maps.MVCObject | null,
  overlaysShouldUpdateRef: MutableRefObject<boolean>,
  dispatch: Dispatch<Action>
) {
  useEffect(() => {
    if (!drawingController) return;

    const eventListeners: Array<google.maps.MapsEventListener> = [];

    const addUpdateListener = (eventName: string, drawResult: DrawResult) => {
      const updateListener = google.maps.event.addListener(
        drawResult.overlay,
        eventName,
        () => {
          if (eventName === 'dragstart') {
            overlaysShouldUpdateRef.current = false;
          }

          if (eventName === 'dragend') {
            overlaysShouldUpdateRef.current = true;
          }

          if (overlaysShouldUpdateRef.current) {
            dispatch({type: DrawingActionKind.UPDATE_OVERLAYS});
          }
        }
      );

      eventListeners.push(updateListener);
    };

    const overlayCompleteListener = google.maps.event.addListener(
      drawingController,
      'overlaycomplete',
      (drawResult: DrawResult) => {
        switch (drawResult.type) {
          case 'circle':
            ['center_changed', 'radius_changed'].forEach(eventName =>
              addUpdateListener(eventName, drawResult)
            );
            break;

          case 'marker':
            ['dragend'].forEach(eventName =>
              addUpdateListener(eventName, drawResult)
            );

            break;

          case 'polygon':
          case 'polyline':
            ['mouseup'].forEach(eventName =>
              addUpdateListener(eventName, drawResult)
            );

          case 'rectangle':
            ['bounds_changed', 'dragstart', 'dragend'].forEach(eventName =>
              addUpdateListener(eventName, drawResult)
            );

            break;
        }

        dispatch({type: DrawingActionKind.SET_OVERLAY, payload: drawResult});
      }
    );

    eventListeners.push(overlayCompleteListener);

    return () => {
      eventListeners.forEach(listener =>
        google.maps.event.removeListener(listener)
      );
    };
  }, [dispatch, drawingController, overlaysShouldUpdateRef]);
}

export function useOverlaySelection(
  map: google.maps.Map | null,
  overlays: Array<Overlay>,
  selectedOverlayRef: MutableRefObject<OverlayGeometry | null>,
  deleteModeRef: MutableRefObject<boolean>,
  setDeleteMode: Dispatch<boolean>,
  ignoreNextMapClickRef: MutableRefObject<boolean>,
  dispatch: Dispatch<Action>,
  onOverlaySelect?: (() => void) | null
) {
  useEffect(() => {
    if (!map) return;

    const eventListeners: Array<google.maps.MapsEventListener> = [];

    const setOverlayEditable = (overlay: OverlayGeometry, enabled: boolean) => {
      if (isCircle(overlay)) {
        overlay.setEditable(enabled);
      } else if (isRectangle(overlay)) {
        overlay.setEditable(enabled);
        overlay.setDraggable(enabled);
      } else if (isPolygon(overlay) || isPolyline(overlay)) {
        overlay.setEditable(enabled);
        overlay.setDraggable(enabled);
      }
    };

    const clearSelection = () => {
      if (!selectedOverlayRef.current) return;

      setOverlayEditable(selectedOverlayRef.current, false);
      selectedOverlayRef.current = null;
    };

    const selectOverlay = (overlay: OverlayGeometry) => {
      if (selectedOverlayRef.current === overlay) return;

      clearSelection();

      if (isMarker(overlay)) {
        selectedOverlayRef.current = overlay;
        return;
      }

      setOverlayEditable(overlay, true);
      selectedOverlayRef.current = overlay;
    };

    const handleOverlayClick = (overlay: OverlayGeometry) => {
      ignoreNextMapClickRef.current = true;
      onOverlaySelect?.();

      if (deleteModeRef.current) {
        setOverlayMap(overlay, null);
        clearSelection();
        setDeleteMode(false);
        dispatch({
          type: DrawingActionKind.DELETE_OVERLAY,
          payload: overlay
        });
        return;
      }

      selectOverlay(overlay);
    };

    const mapClickListener = map.addListener('click', () => {
      if (ignoreNextMapClickRef.current) {
        ignoreNextMapClickRef.current = false;
        return;
      }

      clearSelection();
    });

    eventListeners.push(mapClickListener);

    for (const overlay of overlays) {
      const listener = google.maps.event.addListener(
        overlay.geometry,
        'click',
        () => handleOverlayClick(overlay.geometry)
      );

      eventListeners.push(listener);
    }

    return () => {
      eventListeners.forEach(listener =>
        google.maps.event.removeListener(listener)
      );
    };
  }, [
    map,
    overlays,
    selectedOverlayRef,
    deleteModeRef,
    setDeleteMode,
    ignoreNextMapClickRef,
    dispatch,
    onOverlaySelect
  ]);
}

// Update overlays with the current "snapshot" when the "now" state changes
export function useOverlaySnapshots(
  map: google.maps.Map | null,
  state: State,
  overlaysShouldUpdateRef: MutableRefObject<boolean>
) {
  useEffect(() => {
    if (!map || !state.now) return;

    for (const overlay of state.now) {
      overlaysShouldUpdateRef.current = false;

      setOverlayMap(overlay.geometry, map);

      const {radius, center, position, path, bounds} = overlay.snapshot;

      if (isCircle(overlay.geometry)) {
        overlay.geometry.setRadius(radius ?? 0);
        overlay.geometry.setCenter(center ?? null);
      } else if (isMarker(overlay.geometry)) {
        setMarkerPosition(overlay.geometry, position);
      } else if (isPolygon(overlay.geometry) || isPolyline(overlay.geometry)) {
        overlay.geometry.setPath(path ?? []);
      } else if (isRectangle(overlay.geometry)) {
        overlay.geometry.setBounds(bounds ?? null);
      }

      overlaysShouldUpdateRef.current = true;
    }

    return () => {
      for (const overlay of state.now) {
        setOverlayMap(overlay.geometry, null);
      }
    };
  }, [map, overlaysShouldUpdateRef, state.now]);
}
