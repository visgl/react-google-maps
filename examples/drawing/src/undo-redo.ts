import {Dispatch, MutableRefObject, useEffect} from 'react';

import {
  Action,
  DrawResult,
  DrawingActionKind,
  Overlay,
  Snapshot,
  State,
  isCircle,
  isMarker,
  isPolygon,
  isPolyline,
  isRectangle
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
          snapshot.position = geometry.getPosition()?.toJSON();
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
        snapshot.position = overlay.getPosition()?.toJSON();
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
  drawingManager: google.maps.drawing.DrawingManager | null,
  overlaysShouldUpdateRef: MutableRefObject<boolean>,
  dispatch: Dispatch<Action>
) {
  useEffect(() => {
    if (!drawingManager) return;

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
      drawingManager,
      'overlaycomplete',
      (drawResult: DrawResult) => {
        switch (drawResult.type) {
          case google.maps.drawing.OverlayType.CIRCLE:
            ['center_changed', 'radius_changed'].forEach(eventName =>
              addUpdateListener(eventName, drawResult)
            );
            break;

          case google.maps.drawing.OverlayType.MARKER:
            ['dragend'].forEach(eventName =>
              addUpdateListener(eventName, drawResult)
            );

            break;

          case google.maps.drawing.OverlayType.POLYGON:
          case google.maps.drawing.OverlayType.POLYLINE:
            ['mouseup'].forEach(eventName =>
              addUpdateListener(eventName, drawResult)
            );

          case google.maps.drawing.OverlayType.RECTANGLE:
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
  }, [dispatch, drawingManager, overlaysShouldUpdateRef]);
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

      overlay.geometry.setMap(map);

      const {radius, center, position, path, bounds} = overlay.snapshot;

      if (isCircle(overlay.geometry)) {
        overlay.geometry.setRadius(radius ?? 0);
        overlay.geometry.setCenter(center ?? null);
      } else if (isMarker(overlay.geometry)) {
        overlay.geometry.setPosition(position);
      } else if (isPolygon(overlay.geometry) || isPolyline(overlay.geometry)) {
        overlay.geometry.setPath(path ?? []);
      } else if (isRectangle(overlay.geometry)) {
        overlay.geometry.setBounds(bounds ?? null);
      }

      overlaysShouldUpdateRef.current = true;
    }

    return () => {
      for (const overlay of state.now) {
        overlay.geometry.setMap(null);
      }
    };
  }, [map, overlaysShouldUpdateRef, state.now]);
}
