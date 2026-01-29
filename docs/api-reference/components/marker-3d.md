# `<Marker3D>` Component

A component to add a [`Marker3DElement`][gmp-marker-3d] or
[`Marker3DInteractiveElement`][gmp-marker-3d-interactive] to a 3D map.
By default, a Marker3D will appear as a red balloon-shaped pin at the
specified position. The appearance can be customized using the [`<Pin>`](./pin.md)
component or by providing custom HTML content like images or SVGs.

## Usage

The `Marker3D` component must be used as a child of a [`<Map3D>`](./map-3d.md) component.

```tsx
import {APIProvider, Map3D, Marker3D} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map3D
      defaultCenter={{lat: 37.7749, lng: -122.4194, altitude: 500}}
      defaultRange={2000}
      defaultTilt={60}>
      <Marker3D position={{lat: 37.7749, lng: -122.4194}} />
    </Map3D>
  </APIProvider>
);
```

### Interactive Markers

When an `onClick` handler is provided, the component automatically uses
`Marker3DInteractiveElement` instead of `Marker3DElement`, enabling click interactions.

```tsx
<Marker3D
  position={{lat: 37.7749, lng: -122.4194}}
  onClick={() => console.log('Marker clicked!')}
  title="Click me"
/>
```

### Custom Marker Content

The marker appearance can be customized in several ways:

#### Using the Pin Component

```tsx
import {Marker3D, Pin} from '@vis.gl/react-google-maps';

<Marker3D position={{lat: 37.7749, lng: -122.4194}}>
  <Pin background="#22ccff" borderColor="#1e89a1" glyphColor="white" />
</Marker3D>;
```

#### Using Custom Images

```tsx
<Marker3D position={{lat: 37.7749, lng: -122.4194}}>
  <img src="/marker-icon.png" width={32} height={32} alt="marker" />
</Marker3D>
```

#### Using Custom SVG

```tsx
<Marker3D position={{lat: 37.7749, lng: -122.4194}}>
  <svg width="40" height="40" viewBox="0 0 40 40">
    <circle
      cx="20"
      cy="20"
      r="18"
      fill="#FF6B35"
      stroke="#fff"
      strokeWidth="3"
    />
    <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16">
      A
    </text>
  </svg>
</Marker3D>
```

:::note

When using `<img>` or `<svg>` elements as children, they are automatically
wrapped in a `<template>` element as required by the Google Maps 3D API.

:::

### Markers with Altitude

Markers can be positioned at specific altitudes above the ground:

```tsx
import {Marker3D, AltitudeMode} from '@vis.gl/react-google-maps';

{
  /* Marker floating 100 meters above the ground */
}
<Marker3D
  position={{lat: 37.7749, lng: -122.4194, altitude: 100}}
  altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
  extruded
  label="Elevated Marker"
/>;
```

## Props

The `Marker3DProps` type extends [`google.maps.maps3d.Marker3DElementOptions`][gmp-marker-3d-options]
and includes additional React-specific props.

### Required

There are no strictly required props, but the `position` must be set for the
marker to appear on the map.

### Positioning Props

#### `position`: google.maps.LatLngLiteral | google.maps.LatLngAltitudeLiteral

The position of the marker. Can include an optional `altitude` property.

```tsx
// 2D position (altitude defaults based on altitudeMode)
<Marker3D position={{lat: 37.7749, lng: -122.4194}} />

// 3D position with explicit altitude
<Marker3D position={{lat: 37.7749, lng: -122.4194, altitude: 100}} />
```

#### `altitudeMode`: AltitudeMode

Specifies how the altitude component of the position is interpreted.

```tsx
import {Marker3D, AltitudeMode} from '@vis.gl/react-google-maps';

<Marker3D
  position={{lat: 37.7749, lng: -122.4194, altitude: 100}}
  altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
/>;
```

Available values:

- **`ABSOLUTE`**: Altitude relative to mean sea level.
- **`CLAMP_TO_GROUND`**: Marker is placed on the ground (default).
- **`RELATIVE_TO_GROUND`**: Altitude relative to the ground surface.
- **`RELATIVE_TO_MESH`**: Altitude relative to the highest surface (ground, buildings, or water).

:::note

Always import `AltitudeMode` from `@vis.gl/react-google-maps` instead of using
`google.maps.maps3d.AltitudeMode` to avoid issues with the API not being loaded yet.

:::

#### `zIndex`: number

The z-index of the marker. Higher values are rendered in front of lower values.

### Appearance Props

#### `label`: string

A text label to display on the marker.

```tsx
<Marker3D position={{lat: 37.7749, lng: -122.4194}} label="San Francisco" />
```

#### `extruded`: boolean

When `true`, draws a line from the marker down to the ground. Useful for
markers positioned at altitude.

```tsx
<Marker3D
  position={{lat: 37.7749, lng: -122.4194, altitude: 200}}
  altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
  extruded
/>
```

#### `drawsWhenOccluded`: boolean

When `true`, the marker remains visible even when occluded by 3D geometry
like buildings.

#### `sizePreserved`: boolean

When `true`, the marker maintains a consistent size regardless of distance
from the camera.

#### `collisionBehavior`: CollisionBehavior

Defines how the marker behaves when it collides with another marker or with
basemap labels.

```tsx
import {Marker3D, CollisionBehavior} from '@vis.gl/react-google-maps';

<Marker3D
  position={{lat: 37.7749, lng: -122.4194}}
  collisionBehavior={CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY}
/>;
```

:::note

Import `CollisionBehavior` from `@vis.gl/react-google-maps` instead of using
`google.maps.CollisionBehavior` to avoid issues with the API not being loaded yet.

:::

### Interactive Props

#### `onClick`: (e: Event) => void

Click handler for the marker. When provided, the component automatically uses
`Marker3DInteractiveElement` which supports click events.

```tsx
<Marker3D
  position={{lat: 37.7749, lng: -122.4194}}
  onClick={e => console.log('Clicked!', e)}
/>
```

#### `title`: string

Rollover text displayed when hovering over an interactive marker.
Only applicable when `onClick` is provided.

```tsx
<Marker3D
  position={{lat: 37.7749, lng: -122.4194}}
  onClick={() => alert('Hello!')}
  title="Click for greeting"
/>
```

## Context

The Marker3D component creates a `Marker3DContext` that can be used by child
components like [`<Pin>`](./pin.md) to access the marker element.

## Source

[`./src/components/marker-3d.tsx`][marker-3d-source]

[gmp-marker-3d]: https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DElement
[gmp-marker-3d-interactive]: https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DInteractiveElement
[gmp-marker-3d-options]: https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DElementOptions
[marker-3d-source]: https://github.com/visgl/react-google-maps/tree/main/src/components/marker-3d.tsx
