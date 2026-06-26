# `<Polygon3D>` Component

The `Polygon3D` component from `@vis.gl/react-google-maps/3d` wraps
[`google.maps.maps3d.Polygon3DElement`][gmp-polygon-3d] and switches to
[`Polygon3DInteractiveElement`][gmp-polygon-3d-interactive] when `onClick` is
provided.

```tsx
import {Polygon3D} from '@vis.gl/react-google-maps/3d';

<Polygon3D
  path={[
    {lat: 37.7749, lng: -122.4194, altitude: 20},
    {lat: 37.779, lng: -122.42, altitude: 20},
    {lat: 37.777, lng: -122.414, altitude: 20}
  ]}
  fillColor="rgba(26, 115, 232, 0.3)"
  strokeColor="#1a73e8"
/>;
```

## Props

`Polygon3DProps` extends [`google.maps.maps3d.Polygon3DElementOptions`][gmp-polygon-3d-options].

### Path Props

#### `path`

The ordered sequence of coordinates that designates the polygon's outer loop.
Accepts an iterable of `LatLngAltitude`, `LatLngAltitudeLiteral`, or
`LatLngLiteral` values.

#### `innerPaths`

Paths defining holes inside the polygon. Accepts an iterable of coordinate
iterables.

#### `altitudeMode`: AltitudeMode

Specifies how altitude components in the paths are interpreted.

### Camera Props

#### `autofitsCamera`: boolean

When `true`, the polygon opts into camera fitting behavior alongside other
3D elements that also opted in.

::::info[Alpha]

This property is currently only available in the alpha channel of the Maps
JavaScript API. Set the `version` prop of your `APIProvider` to `alpha` to
enable it.

::::

### Appearance Props

#### `drawsOccludedSegments`: boolean

When `true`, parts of the polygon that could be occluded by map geometry are
drawn.

#### `extruded`: boolean

When `true`, connects the polygon to the ground.

#### `fillColor`: string

The fill color.

#### `geodesic`: boolean

When `true`, edges follow the curvature of the Earth.

#### `strokeColor`: string

The stroke color.

#### `strokeWidth`: number

The stroke width in pixels.

#### `zIndex`: number

The z-index compared to other polys.

### Event Props

#### `onClick`: (e: google.maps.maps3d.LocationClickEvent) => void

When provided, the component renders `Polygon3DInteractiveElement` and listens
for `gmp-click`.

[gmp-polygon-3d]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#Polygon3DElement
[gmp-polygon-3d-interactive]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#Polygon3DInteractiveElement
[gmp-polygon-3d-options]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#Polygon3DElementOptions
