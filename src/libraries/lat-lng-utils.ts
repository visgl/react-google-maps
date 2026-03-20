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

export function toLatLngBoundsLiteral(
  obj: google.maps.LatLngBoundsLiteral | google.maps.LatLngBounds
): google.maps.LatLngBoundsLiteral {
  if ('north' in obj && 'south' in obj && 'east' in obj && 'west' in obj) {
    return obj;
  }

  const ne = obj.getNorthEast().toJSON();
  const sw = obj.getSouthWest().toJSON();

  return {
    north: ne.lat,
    east: ne.lng,
    south: sw.lat,
    west: sw.lng
  };
}

export function boundsEquals(
  a:
    | google.maps.LatLngBoundsLiteral
    | google.maps.LatLngBounds
    | undefined
    | null,
  b:
    | google.maps.LatLngBoundsLiteral
    | google.maps.LatLngBounds
    | undefined
    | null
): boolean {
  if (!a || !b) return false;

  const A = toLatLngBoundsLiteral(a);
  const B = toLatLngBoundsLiteral(b);

  return (
    A.north === B.north &&
    A.south === B.south &&
    A.east === B.east &&
    A.west === B.west
  );
}

type LatLngInput = google.maps.LatLngLiteral | google.maps.LatLng;

/**
 * Compares two paths (arrays of LatLng points) for equality.
 */
export function pathEquals(
  a: LatLngInput[] | null | undefined,
  b: google.maps.MVCArray<google.maps.LatLng> | LatLngInput[] | null | undefined
): boolean {
  if (!a || !b) return a === b;

  const arrayB = 'getArray' in b ? b.getArray() : b;

  if (a.length !== arrayB.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (!latLngEquals(a[i], arrayB[i])) return false;
  }

  return true;
}

/**
 * Compares two arrays of paths (for Polygon) for equality.
 */
export function pathsEquals(
  a: LatLngInput[][] | null | undefined,
  b:
    | google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>
    | LatLngInput[][]
    | null
    | undefined
): boolean {
  if (!a || !b) return a === b;

  const arrayB =
    'getArray' in b ? b.getArray().map(inner => inner.getArray()) : b;

  if (a.length !== arrayB.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (!pathEquals(a[i], arrayB[i])) return false;
  }

  return true;
}
