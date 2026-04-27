# Special Type Definitions

## `writable.d.ts`: Google Maps Writable Type Mapping

The Maps API has very precise typings for the accepted and returned values
for the custom-element properties. This is done by providing separate types
for the getter and setter methods. For example, `marker.position` always
returns a `google.maps.LatLngAltitude` object, but can be set as either
`google.maps.LatLngLiteral`, `google.maps.LatLngAltitudeLiteral` or an
object. Additionally, all setters typically accept `null` and `undefined` as
values.

This table describes how the `GmpWritableElementProp<V>` utility maps
those "Read" types (from element getters) to their broader "Write" types
(for element setters) within the `@vis.gl/react-google-maps` library.

| Read Type (from Getter)      | Inferred Write Type (from Setter)                                                                                                                               |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `google.maps.LatLngAltitude` | `google.maps.LatLng` \| `google.maps.LatLngLiteral` \| `google.maps.LatLngAltitude` \| `google.maps.LatLngAltitudeLiteral` \| `string` \| `null` \| `undefined` |
| `google.maps.LatLng`         | `google.maps.LatLng` \| `google.maps.LatLngLiteral` \| `string` \| `null` \| `undefined`                                                                        |
| `google.maps.LatLngBounds`   | `google.maps.LatLngBounds` \| `google.maps.LatLngBoundsLiteral` \| `null` \| `undefined`                                                                        |
| `google.maps.Circle`         | `google.maps.Circle` \| `google.maps.CircleLiteral` \| `null` \| `undefined`                                                                                    |
| `google.maps.Orientation3D`  | `google.maps.Orientation3D` \| `google.maps.Orientation3DLiteral` \| `null` \| `undefined`                                                                      |
| `google.maps.Vector3D`       | `google.maps.Vector3D` \| `google.maps.Vector3DLiteral` \| `number` \| `null` \| `undefined`                                                                    |
| `google.maps.places.Place`   | `google.maps.places.Place` \| `string` \| `null` \| `undefined`                                                                                                 |
| `URL`                        | `URL` \| `string` \| `null` \| `undefined`                                                                                                                      |
| `Array<T>` (e.g. `string[]`) | `Iterable<GmpBaseWritableType<T>>` \| `null` \| `undefined`                                                                                                     |
| `Array<Array<T>>`            | `Iterable<Iterable<GmpBaseWritableType<T>>>` \| `null` \| `undefined`                                                                                           |
| `any` (Fallback)             | `T` \| `null` \| `undefined`                                                                                                                                    |

### Critical Logic Notes:

1. **Distributive Unions:** The mapping uses `V extends unknown` to ensure that
   union types (e.g., `LatLng | string`) are split and each member is mapped individually.
2. **Order of Precedence:** `LatLngAltitude` is checked before `LatLng` to
   ensure the more specific 3D coordinate type is correctly expanded before the 2D check matches.
3. **Recursive Iterables:** Array types are converted to `Iterable`, and
   the inner types are recursively mapped via `GmpBaseWritableType<T>`.
4. **Consistency:** All properties, regardless of mapping, are expanded to
   include `| null | undefined`.
