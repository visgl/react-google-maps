export type OverlayGeometry =
  | google.maps.Marker
  | google.maps.Polygon
  | google.maps.Polyline
  | google.maps.Rectangle
  | google.maps.Circle;

export type DrawingMode =
  | 'marker'
  | 'circle'
  | 'polygon'
  | 'polyline'
  | 'rectangle'
  | null;

export type OverlayType = Exclude<DrawingMode, null>;

export interface DrawResult {
  type: OverlayType;
  overlay: OverlayGeometry;
}

export interface Snapshot {
  radius?: number;
  center?: google.maps.LatLngLiteral;
  position?: google.maps.LatLngLiteral;
  path?: Array<google.maps.LatLng>;
  bounds?: google.maps.LatLngBoundsLiteral;
}

export interface Overlay {
  type: OverlayType;
  geometry: OverlayGeometry;
  snapshot: Snapshot;
}

export interface State {
  past: Array<Array<Overlay>>;
  now: Array<Overlay>;
  future: Array<Array<Overlay>>;
}

export enum DrawingActionKind {
  SET_OVERLAY = 'SET_OVERLAY',
  UPDATE_OVERLAYS = 'UPDATE_OVERLAYS',
  DELETE_OVERLAY = 'DELETE_OVERLAY',
  UNDO = 'UNDO',
  REDO = 'REDO'
}

export interface ActionWithTypeOnly {
  type: Exclude<
    DrawingActionKind,
    DrawingActionKind.SET_OVERLAY | DrawingActionKind.DELETE_OVERLAY
  >;
}

export interface SetOverlayAction {
  type: DrawingActionKind.SET_OVERLAY;
  payload: DrawResult;
}

export interface DeleteOverlayAction {
  type: DrawingActionKind.DELETE_OVERLAY;
  payload: OverlayGeometry;
}

export type Action =
  | ActionWithTypeOnly
  | SetOverlayAction
  | DeleteOverlayAction;

export function isCircle(
  overlay: OverlayGeometry
): overlay is google.maps.Circle {
  return (overlay as google.maps.Circle).getCenter !== undefined;
}

export function isMarker(
  overlay: OverlayGeometry
): overlay is google.maps.Marker {
  return (overlay as google.maps.Marker).getPosition !== undefined;
}

export function isPolygon(
  overlay: OverlayGeometry
): overlay is google.maps.Polygon {
  return (overlay as google.maps.Polygon).getPath !== undefined;
}

export function isPolyline(
  overlay: OverlayGeometry
): overlay is google.maps.Polyline {
  return (overlay as google.maps.Polyline).getPath !== undefined;
}

export function isRectangle(
  overlay: OverlayGeometry
): overlay is google.maps.Rectangle {
  return (overlay as google.maps.Rectangle).getBounds !== undefined;
}
