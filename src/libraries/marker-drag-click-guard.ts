export const MARKER_DRAG_CLICK_SUPPRESSION_MS = 100;

const dragEndTimes = new WeakMap<google.maps.Map, number>();

export function noteAdvancedMarkerDragEnded(map: google.maps.Map) {
  dragEndTimes.set(map, Date.now());
}

export function consumeMapClickSuppressedByMarkerDrag(map: google.maps.Map) {
  const dragEndTime = dragEndTimes.get(map);
  dragEndTimes.delete(map);

  return (
    dragEndTime !== undefined &&
    Date.now() - dragEndTime <= MARKER_DRAG_CLICK_SUPPRESSION_MS
  );
}
