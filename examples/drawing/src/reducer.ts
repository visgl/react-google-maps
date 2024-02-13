import {
  Action,
  DrawingActionKind,
  Overlay,
  PinnedState,
  State,
  isCircle,
  isMarker,
  isPolygon,
  isPolyline,
  isRectangle
} from './types';

export default function reducer(state: State, action: Action) {
  switch (action.type) {
    case DrawingActionKind.UPDATE_OVERLAYS: {
      const overlays = state.now.map((overlay: Overlay) => {
        const pinnedState: PinnedState = {};
        const {geometry} = overlay;

        if (isCircle(geometry)) {
          pinnedState.center = geometry.getCenter()?.toJSON();
          pinnedState.radius = geometry.getRadius();
        } else if (isMarker(geometry)) {
          pinnedState.position = geometry.getPosition()?.toJSON();
        } else if (isPolygon(geometry) || isPolyline(geometry)) {
          pinnedState.path = geometry.getPath()?.getArray();
        } else if (isRectangle(geometry)) {
          pinnedState.bounds = geometry.getBounds()?.toJSON();
        }

        return {
          ...overlay,
          pinnedState
        };
      });

      return {
        now: [...overlays],
        past: [...state.past, state.now],
        future: []
      };
    }

    case DrawingActionKind.SET_OVERLAY: {
      const {overlay} = action.payload;

      const pinnedState: PinnedState = {};

      if (isCircle(overlay)) {
        pinnedState.center = overlay.getCenter()?.toJSON();
        pinnedState.radius = overlay.getRadius();
      } else if (isMarker(overlay)) {
        pinnedState.position = overlay.getPosition()?.toJSON();
      } else if (isPolygon(overlay) || isPolyline(overlay)) {
        pinnedState.path = overlay.getPath()?.getArray();
      } else if (isRectangle(overlay)) {
        pinnedState.bounds = overlay.getBounds()?.toJSON();
      }

      return {
        past: [...state.past, state.now],
        now: [
          ...state.now,
          {
            type: action.payload.type,
            geometry: action.payload.overlay,
            pinnedState
          }
        ],
        future: []
      };
    }

    case DrawingActionKind.UNDO: {
      const last = state.past.slice(-1)[0];

      if (!last) return state;

      return {
        past: [...state.past].slice(0, -1),
        now: last,
        future: state.now ? [...state.future, state.now] : state.future
      };
    }

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
