export function isLatLngLiteral(
  obj: unknown
): obj is google.maps.LatLngLiteral {
  if (!obj || typeof obj !== 'object') return false;
  if (!('lat' in obj && 'lng' in obj)) return false;

  return Number.isFinite(obj.lat) && Number.isFinite(obj.lng);
}
