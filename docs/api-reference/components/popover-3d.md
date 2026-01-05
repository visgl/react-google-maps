# `<Popover3D>` Component

A component to add a [`PopoverElement`][gmp-popover] to a 3D map.
Popovers are overlay elements similar to InfoWindows for 2D maps,
used to display contextual information at a specific location or
anchored to a marker on a Map3D.

Any JSX element added to the Popover3D component as children will get
rendered into the content area of the popover.

## Usage

The `Popover3D` component must be used within an [`<APIProvider>`](./api-provider.md)
that also contains a [`<Map3D>`](./map-3d.md) component.

### Basic Example

Display a popover at a specific position on the 3D map:

```tsx
import {APIProvider, Map3D, Popover3D} from '@vis.gl/react-google-maps';

const App = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <APIProvider apiKey={'Your API key here'}>
      <Map3D
        defaultCenter={{lat: 37.7749, lng: -122.4194, altitude: 500}}
        defaultRange={2000}
        defaultTilt={60}>
        <Popover3D
          position={{lat: 37.7749, lng: -122.4194}}
          open={isOpen}
          onClose={() => setIsOpen(false)}>
          <div style={{padding: '8px'}}>
            <h3>San Francisco</h3>
            <p>Welcome to the city by the bay!</p>
          </div>
        </Popover3D>
      </Map3D>
    </APIProvider>
  );
};
```

### Popover Anchored to a Marker

A more typical use-case is to have a popover shown when clicking on a marker.
You can anchor the popover to a `Marker3DInteractiveElement` using the `anchor` prop:

```tsx
import {
  APIProvider,
  Map3D,
  Marker3D,
  Popover3D
} from '@vis.gl/react-google-maps';

const MarkerWithPopover = ({position}) => {
  const [markerElement, setMarkerElement] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <>
      <Marker3D
        ref={setMarkerElement}
        position={position}
        onClick={() => setPopoverOpen(true)}
        title="Click for more info"
      />

      {markerElement && (
        <Popover3D
          anchor={markerElement}
          open={popoverOpen}
          onClose={() => setPopoverOpen(false)}>
          <div style={{padding: '12px'}}>
            <h3>Location Info</h3>
            <p>This popover is anchored to the marker.</p>
          </div>
        </Popover3D>
      )}
    </>
  );
};
```

### Light Dismiss Behavior

By default, popovers can be closed by clicking outside of them ("light dismiss").
You can disable this behavior with the `lightDismissDisabled` prop:

```tsx
<Popover3D
  position={{lat: 37.7749, lng: -122.4194}}
  open={isOpen}
  lightDismissDisabled>
  <div>This popover won't close when clicking outside</div>
</Popover3D>
```

:::note

When `lightDismissDisabled` is true, you must provide another way for users
to close the popover, such as a close button inside the content.

:::

### Popover with Altitude

Position a popover at a specific altitude above the ground:

```tsx
import {Popover3D, AltitudeMode} from '@vis.gl/react-google-maps';

<Popover3D
  position={{lat: 37.7749, lng: -122.4194, altitude: 100}}
  altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
  open={isOpen}>
  <div>Floating 100m above ground!</div>
</Popover3D>;
```

## Props

The `Popover3DProps` type extends [`google.maps.maps3d.PopoverElementOptions`][gmp-popover-options]
with additional React-specific props.

### Required

There are no strictly required props, but either `position` or `anchor` must be
set for the popover to appear on the map.

### Positioning Props

#### `position`: google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral

The position at which to display this popover. Can include an optional `altitude` property.

```tsx
// 2D position
<Popover3D position={{lat: 37.7749, lng: -122.4194}} open={true}>
  Content here
</Popover3D>

// 3D position with altitude
<Popover3D position={{lat: 37.7749, lng: -122.4194, altitude: 50}} open={true}>
  Content here
</Popover3D>
```

:::note

When an `anchor` is specified, the `position` prop will be ignored.

:::

#### `anchor`: google.maps.maps3d.Marker3DInteractiveElement

A `Marker3DInteractiveElement` instance to anchor the popover to. When specified,
the popover will be positioned relative to the marker.

```tsx
<Marker3D
  ref={setMarkerElement}
  position={position}
  onClick={() => setOpen(true)}
/>

<Popover3D anchor={markerElement} open={isOpen}>
  Anchored content
</Popover3D>
```

#### `anchorId`: string

A string ID referencing a `Marker3DInteractiveElement` to anchor the popover to.
This is an alternative to using the `anchor` prop when you have the marker's ID.

#### `altitudeMode`: AltitudeMode

Specifies how the altitude component of the position is interpreted.

```tsx
import {Popover3D, AltitudeMode} from '@vis.gl/react-google-maps';

<Popover3D
  position={{lat: 37.7749, lng: -122.4194, altitude: 100}}
  altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
  open={true}>
  Content here
</Popover3D>;
```

Available values:

- **`ABSOLUTE`**: Altitude relative to mean sea level.
- **`CLAMP_TO_GROUND`**: Popover is placed on the ground (default).
- **`RELATIVE_TO_GROUND`**: Altitude relative to the ground surface.
- **`RELATIVE_TO_MESH`**: Altitude relative to the highest surface (ground, buildings, or water).

### Visibility Props

#### `open`: boolean

Whether the popover is currently visible. Defaults to `false`.

```tsx
const [isOpen, setIsOpen] = useState(false);

<Popover3D position={position} open={isOpen}>
  Content here
</Popover3D>;
```

#### `lightDismissDisabled`: boolean

When `true`, prevents the popover from being closed when clicking outside of it.
Defaults to `false`.

```tsx
<Popover3D position={position} open={true} lightDismissDisabled>
  This popover won't close on outside click
</Popover3D>
```

### Events

#### `onClose`: (event: Event) => void

Called when the popover is closed via light dismiss (clicking outside the popover).
Use this to keep your state in sync with the popover's visibility.

```tsx
const [isOpen, setIsOpen] = useState(true);

<Popover3D position={position} open={isOpen} onClose={() => setIsOpen(false)}>
  Content here
</Popover3D>;
```

:::note

The `onClose` event only fires when the popover is closed via light dismiss.
It will not fire when you programmatically set `open={false}`.

:::

[gmp-popover]: https://developers.google.com/maps/documentation/javascript/reference/3d-map-draw#PopoverElement
[gmp-popover-options]: https://developers.google.com//maps/documentation/javascript/reference/3d-map-draw#PopoverElementOptions
