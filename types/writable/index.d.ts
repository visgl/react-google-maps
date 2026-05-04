/**
 * Maps base Google Maps types to their broader "write" equivalents.
 *
 * This is used to handle the fact that many Google Maps API properties
 * accept a wider range of types in their setters than what their getters return.
 */
export type GmpBaseWritableElementType<V> =
  // Handle unions by distributing the mapping over each member
  V extends unknown
    ? // 1. Path/Array patterns (support Iterable for performance where possible)
      V extends Array<Array<infer U>>
      ? Iterable<Iterable<GmpBaseWritableElementType<U>>>
      : V extends Array<infer U>
        ? Iterable<GmpBaseWritableElementType<U>>
        : // 2. Geometry & Coordinate patterns (3D)
          // Some 3D elements specifically want Altitude variants
          V extends google.maps.LatLngAltitude
          ?
              | google.maps.LatLng
              | google.maps.LatLngLiteral
              | google.maps.LatLngAltitude
              | google.maps.LatLngAltitudeLiteral
              | string
          : // 3. Geometry & Coordinate patterns (2D)
            V extends google.maps.LatLng
            ? google.maps.LatLng | google.maps.LatLngLiteral | string
            : V extends google.maps.LatLngBounds
              ? google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral
              : V extends google.maps.Circle
                ? google.maps.Circle | google.maps.CircleLiteral
                : // 4. Specialized Classes/Interfaces
                  V extends google.maps.Orientation3D
                  ? google.maps.Orientation3D | google.maps.Orientation3DLiteral
                  : V extends google.maps.Vector3D
                    ?
                        | google.maps.Vector3D
                        | google.maps.Vector3DLiteral
                        | number
                    : V extends google.maps.places.Place
                      ? google.maps.places.Place | string
                      : V extends URL
                        ? URL | string
                        : // 5. Default Fallback
                          V
    : never;

/**
 * The final writable type for a GMP property, ensuring support
 * for the expanded types plus null and undefined.
 */
export type GmpWritableElementProp<V> =
  | GmpBaseWritableElementType<NonNullable<V>>
  | null
  | undefined;

/**
 * Transforms a type T into its writable counterpart for use with custom elements.
 */
export type GmpWritableElement<T> = {
  [K in keyof T]?: GmpWritableElementProp<T[K]>;
};
