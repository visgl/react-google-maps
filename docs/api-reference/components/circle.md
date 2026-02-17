# `<Circle>` Component

React component to display a [Circle](https://developers.google.com/maps/documentation/javascript/reference/polygon#Circle) on the map.

## Usage

```tsx
import React from 'react';
import {APIProvider, Map, Circle} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
      <Circle
        center={{lat: 53.54992, lng: 10.00678}}
        radius={1000}
        fillColor={'#0088ff'}
        fillOpacity={0.3}
        strokeColor={'#0088ff'}
        strokeWeight={2}
      />
    </Map>
  </APIProvider>
);

export default App;
```

## Props

The `CircleProps` interface extends the [`google.maps.CircleOptions` interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#CircleOptions) and includes all possible options available for a Circle.

### Controlled / Uncontrolled

The Circle component supports both controlled and uncontrolled usage patterns for `center` and `radius`:

```tsx
// Uncontrolled - initial values only
<Circle defaultCenter={{lat: 53.5, lng: 10}} defaultRadius={1000} />

// Controlled - value always reflects props
<Circle center={center} radius={radius} />
```

When using controlled props with `editable` or `draggable`, use the `onCenterChanged` and `onRadiusChanged` callbacks to sync state:

```tsx
const [center, setCenter] = useState({lat: 53.5, lng: 10});
const [radius, setRadius] = useState(1000);

<Circle
  center={center}
  radius={radius}
  editable
  draggable
  onCenterChanged={c => c && setCenter({lat: c.lat(), lng: c.lng()})}
  onRadiusChanged={setRadius}
/>;
```

### Position Props

#### `center`: `google.maps.LatLngLiteral | google.maps.LatLng`

The controlled center of the circle.

#### `defaultCenter`: `google.maps.LatLngLiteral | google.maps.LatLng`

The initial center of the circle (uncontrolled).

#### `radius`: number

The controlled radius in meters.

#### `defaultRadius`: number

The initial radius in meters (uncontrolled).

### Event Props

#### `onClick`: `(e: google.maps.MapMouseEvent) => void`

Called when the circle is clicked.

#### `onDrag`: `(e: google.maps.MapMouseEvent) => void`

Called repeatedly while the circle is being dragged.

#### `onDragStart`: `(e: google.maps.MapMouseEvent) => void`

Called when dragging of the circle begins.

#### `onDragEnd`: `(e: google.maps.MapMouseEvent) => void`

Called when dragging of the circle ends.

#### `onMouseOver`: `(e: google.maps.MapMouseEvent) => void`

Called when the mouse enters the circle.

#### `onMouseOut`: `(e: google.maps.MapMouseEvent) => void`

Called when the mouse leaves the circle.

#### `onCenterChanged`: `(center: google.maps.LatLng | null | undefined) => void`

Called when the center of the circle is changed (via dragging or editing).

#### `onRadiusChanged`: (radius: number) => void

Called when the radius of the circle is changed (via editing).

### Style Props

All styling options from `google.maps.CircleOptions` are supported:

- `fillColor`: string
- `fillOpacity`: number
- `strokeColor`: string
- `strokeOpacity`: number
- `strokeWeight`: number

### Behavior Props

- `clickable`: boolean - Whether the circle handles mouse events
- `draggable`: boolean - Whether the circle can be dragged
- `editable`: boolean - Whether the circle can be edited (resize)
- `visible`: boolean - Whether the circle is visible
- `zIndex`: number - The z-index of the circle

## Extracting the Circle Instance

You can access the underlying `google.maps.Circle` instance via a ref:

```tsx
const circleRef = useRef<google.maps.Circle>(null);

<Circle ref={circleRef} center={{lat: 53.5, lng: 10}} radius={1000} />;
```
