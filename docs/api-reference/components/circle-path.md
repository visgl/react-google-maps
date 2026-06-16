# `<CirclePath>` Component

The `CirclePath` component from `@vis.gl/react-google-maps/3d` wraps
[`google.maps.maps3d.CirclePathElement`][gmp-circle-path]. It renders a circle
path from a center and radius.

::::info[Alpha]

`CirclePathElement` is currently only available in the alpha channel of the
Maps JavaScript API. Set the `version` prop of your `APIProvider` to `alpha`
to enable it.

::::

```tsx
import {CirclePath} from '@vis.gl/react-google-maps/3d';

<CirclePath center={{lat: 37.7749, lng: -122.4194}} radius={100} />;
```

## Props

`CirclePathProps` extends [`google.maps.maps3d.CirclePathElementOptions`][gmp-circle-path-options].

### Circle Props

#### `center`: google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral

The center of the circle.

#### `radius`: number

The radius of the circle in meters.

[gmp-circle-path]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#CirclePathElement
[gmp-circle-path-options]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#CirclePathElementOptions
