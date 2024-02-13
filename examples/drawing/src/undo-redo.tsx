import React, {useEffect, useReducer, useRef} from 'react';
import {ControlPosition, MapControl, useMap} from '@vis.gl/react-google-maps';

import reducer from './reducer';

import {
  DrawResult,
  DrawingActionKind,
  Overlay,
  isCircle,
  isMarker,
  isPolygon,
  isPolyline,
  isRectangle
} from './types';

interface Props {
  drawingManager: google.maps.drawing.DrawingManager | null;
}

export const UndoRedo = ({drawingManager}: Props) => {
  const map = useMap();

  const [state, dispatch] = useReducer(reducer, {
    past: [],
    now: [],
    future: []
  });

  const overlaysShouldUpdate = useRef<boolean>(false);

  const pinnedStatesSnapshot = JSON.stringify(
    state.now.map((overlay: Overlay) => overlay.pinnedState)
  );

  useEffect(() => {
    if (!drawingManager) return;

    const addUpdateListener = (eventName: string, drawResult: DrawResult) => {
      google.maps.event.addListener(drawResult.overlay, eventName, () => {
        if (eventName === 'dragstart') {
          overlaysShouldUpdate.current = false;
        }

        if (eventName === 'dragend') {
          overlaysShouldUpdate.current = true;
        }

        if (overlaysShouldUpdate.current) {
          dispatch({type: DrawingActionKind.UPDATE_OVERLAYS});
        }
      });
    };

    drawingManager.addListener('overlaycomplete', (drawResult: DrawResult) => {
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
    });
  }, [drawingManager]);

  useEffect(() => {
    if (!map || !state.now) return;

    state.now.forEach((overlay: Overlay) => {
      overlaysShouldUpdate.current = false;

      overlay.geometry.setMap(map);

      const {radius, center, position, path, bounds} = overlay.pinnedState;

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

      overlaysShouldUpdate.current = true;
    });

    return () => {
      state.now.forEach((overlay: Overlay) => {
        overlay.geometry.setMap(null);
      });
    };
  }, [map, pinnedStatesSnapshot]);

  return (
    <MapControl position={ControlPosition.TOP_CENTER}>
      <div className="drawing-history">
        <button
          onClick={() => dispatch({type: DrawingActionKind.UNDO})}
          disabled={!state.past.length}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24">
            <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
          </svg>
        </button>
        <button
          onClick={() => dispatch({type: DrawingActionKind.REDO})}
          disabled={!state.future.length}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24">
            <path d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z" />
          </svg>
        </button>
      </div>
    </MapControl>
  );
};
