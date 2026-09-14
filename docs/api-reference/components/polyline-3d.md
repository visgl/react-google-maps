# `<Polyline3D>` Component

The `Polyline3D` component from `@vis.gl/react-google-maps/3d` wraps
[`google.maps.maps3d.Polyline3DElement`][gmp-polyline-3d] and switches to
[`Polyline3DInteractiveElement`][gmp-polyline-3d-interactive] when `onClick` is
provided.

```tsx
import {Polyline3D} from '@vis.gl/react-google-maps/3d';

<Polyline3D
  path={[
    {lat: 37.7749, lng: -122.4194, altitude: 50},
    {lat: 37.779, lng: -122.42, altitude: 80}
  ]}
  strokeColor="#1a73e8"
  strokeWidth={6}
/>;
```

## Props

`Polyline3DProps` extends [`google.maps.maps3d.Polyline3DElementOptions`][gmp-polyline-3d-options].

### Path Props

#### `path`

The ordered sequence of coordinates in the polyline. Accepts an iterable of
`LatLngAltitude`, `LatLngAltitudeLiteral`, or `LatLngLiteral` values.

#### `altitudeMode`: AltitudeMode

Specifies how altitude components in `path` are interpreted.

### Camera Props

#### `autofitsCamera`: boolean

When `true`, the polyline opts into camera fitting behavior alongside other
3D elements that also opted in.

::::info[Alpha]

This property is currently only available in the alpha channel of the Maps
JavaScript API. Set the `version` prop of your `APIProvider` to `alpha` to
enable it.

::::

### Appearance Props

#### `drawsOccludedSegments`: boolean

When `true`, parts of the polyline that could be occluded by map geometry are
drawn.

#### `extruded`: boolean

When `true`, connects the polyline to the ground.

#### `geodesic`: boolean

When `true`, edges follow the curvature of the Earth.

#### `strokeColor`: string

The stroke color.

#### `strokeWidth`: number

The stroke width in pixels.

#### `outerColor`: string

The outer stroke color.

#### `outerWidth`: number

The outer width as a percentage of `strokeWidth`.

#### `zIndex`: number

The z-index compared to other polys.

### Event Props

#### `onClick`: (e: google.maps.maps3d.LocationClickEvent) => void

When provided, the component renders `Polyline3DInteractiveElement` and listens
for `gmp-click`.

[gmp-polyline-3d]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#Polyline3DElement
[gmp-polyline-3d-interactive]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#Polyline3DInteractiveElement
[gmp-polyline-3d-options]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#Polyline3DElementOptions
