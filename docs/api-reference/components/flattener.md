# `<Flattener>` Component

The `Flattener` component from `@vis.gl/react-google-maps/3d` wraps
[`google.maps.maps3d.FlattenerElement`][gmp-flattener] and flattens the 3D map
surface within the provided path.

The flattener itself is not a styled visible overlay. Add a `Polygon3D` with the
same path when you need a visible debug outline.

```tsx
import {Flattener} from '@vis.gl/react-google-maps/3d';

<Flattener
  path={[
    {lat: 37.7749, lng: -122.4194},
    {lat: 37.779, lng: -122.42},
    {lat: 37.777, lng: -122.414}
  ]}
/>;
```

## Props

`FlattenerProps` extends [`google.maps.maps3d.FlattenerElementOptions`][gmp-flattener-options].

### Path Props

#### `path`

The ordered sequence of coordinates that designates the flattening zone. Accepts
an iterable of `LatLngAltitude`, `LatLngAltitudeLiteral`, or `LatLngLiteral`
values.

#### `innerPaths`

Paths defining exclusion holes within the flattening zone. Areas inside an
inner path are exempt from flattening.

[gmp-flattener]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#FlattenerElement
[gmp-flattener-options]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#FlattenerElementOptions
