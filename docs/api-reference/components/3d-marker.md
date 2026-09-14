# `<Marker>` 3D Component

The `Marker` component from `@vis.gl/react-google-maps/3d` wraps
[`google.maps.maps3d.MarkerElement`][gmp-marker] and switches to
[`MarkerInteractiveElement`][gmp-marker-interactive] when `onClick` is provided.

This component is different from the root export path's 2D [`<Marker>`](./marker.md)
component.

```tsx
import {Marker} from '@vis.gl/react-google-maps/3d';

<Marker
  position={{lat: 37.7749, lng: -122.4194, altitude: 50}}
  onClick={event => console.log(event)}>
  <div>HTML marker</div>
</Marker>;
```

## Props

`MarkerProps` extends [`google.maps.maps3d.MarkerElementOptions`][gmp-marker-options].

### Positioning Props

#### `position`: google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral

The marker position. Altitude is optional and interpreted according to
`altitudeMode`.

#### `altitudeMode`: AltitudeMode

Specifies how the altitude component of `position` is interpreted.

#### `anchorLeft`: string

A CSS length-percentage value used to offset the anchor point from the top left
corner of the marker.

#### `anchorTop`: string

A CSS length-percentage value used to offset the anchor point from the top left
corner of the marker.

### Camera Props

#### `autofitsCamera`: boolean

When `true`, the marker opts into camera fitting behavior alongside other
3D elements that also opted in.

::::info[Alpha]

This property is currently only available in the alpha channel of the Maps
JavaScript API. Set the `version` prop of your `APIProvider` to `alpha` to
enable it.

::::

### Collision Props

#### `collisionBehavior`: CollisionBehavior

Defines how the marker behaves when it collides with another marker or with
basemap labels.

#### `collisionPriority`: number

Determines relative priority between optional markers. Higher values indicate
higher priority.

### Content Props

#### `title`: string

Rollover and accessibility text.

#### `gmpPopoverTargetElement`: google.maps.maps3d.PopoverElement

When used with an interactive marker, opens the specified popover on marker
click.

### Event Props

#### `onClick`: (e: google.maps.maps3d.LocationClickEvent) => void

When provided, the component renders `MarkerInteractiveElement` and listens for
`gmp-click`.

[gmp-marker]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#MarkerElement
[gmp-marker-interactive]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#MarkerInteractiveElement
[gmp-marker-options]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#MarkerElementOptions
