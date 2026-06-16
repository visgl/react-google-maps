# `<Model3D>` Component

The `Model3D` component from `@vis.gl/react-google-maps/3d` wraps
[`google.maps.maps3d.Model3DElement`][gmp-model-3d] and switches to
[`Model3DInteractiveElement`][gmp-model-3d-interactive] when `onClick` is
provided.

```tsx
import {Model3D} from '@vis.gl/react-google-maps/3d';

<Model3D
  position={{lat: 37.7749, lng: -122.4194, altitude: 120}}
  src="/model.glb"
  scale={10}
/>;
```

## Props

`Model3DProps` extends [`google.maps.maps3d.Model3DElementOptions`][gmp-model-3d-options].

### Positioning Props

#### `position`: google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral

The model position. Both `position` and `src` must be set for the model to
display.

#### `src`: string | URL

The URL of the 3D model. The Maps JavaScript API currently supports `.glb`
models.

#### `altitudeMode`: AltitudeMode

Specifies how altitude in `position` is interpreted.

### Model Props

#### `orientation`: google.maps.Orientation3D | google.maps.Orientation3DLiteral

Rotation of the model coordinate system.

#### `scale`: number | google.maps.Vector3D | google.maps.Vector3DLiteral

Scales the model uniformly or along each model axis.

### Event Props

#### `onClick`: (e: google.maps.maps3d.LocationClickEvent) => void

When provided, the component renders `Model3DInteractiveElement` and listens for
`gmp-click`.

[gmp-model-3d]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#Model3DElement
[gmp-model-3d-interactive]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#Model3DInteractiveElement
[gmp-model-3d-options]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#Model3DElementOptions
