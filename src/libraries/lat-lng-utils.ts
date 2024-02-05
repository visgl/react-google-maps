export function isLatLngLiteral(
  obj: unknown
): obj is google.maps.LatLngLiteral {
  if (!obj || typeof obj !== 'object') return false;
  if (!('lat' in obj && 'lng' in obj)) return false;

  return Number.isFinite(obj.lat) && Number.isFinite(obj.lng);
}

export function latLngEquals(
  a: google.maps.LatLngLiteral | google.maps.LatLng | undefined | null,
  b: google.maps.LatLngLiteral | google.maps.LatLng | undefined | null
): boolean {
  if (!a || !b) return false;
  const A = toLatLngLiteral(a);
  const B = toLatLngLiteral(b);
  if (A.lat !== B.lat || A.lng !== B.lng) return false;
  return true;
}

export function toLatLngLiteral(
  obj: google.maps.LatLngLiteral | google.maps.LatLng
): google.maps.LatLngLiteral {
  if (isLatLngLiteral(obj)) return obj;

  return obj.toJSON();
}
