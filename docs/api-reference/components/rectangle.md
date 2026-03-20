# `<Rectangle>` Component

React component to display a [Rectangle](https://developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle) on the map.

## Usage

```tsx
import React from 'react';
import {APIProvider, Map, Rectangle} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
      <Rectangle
        bounds={{
          north: 53.56,
          south: 53.54,
          east: 10.03,
          west: 9.99
        }}
        fillColor={'#0088ff'}
        fillOpacity={0.2}
        strokeColor={'#0088ff'}
        strokeWeight={2}
      />
    </Map>
  </APIProvider>
);

export default App;
```

## Props

The `RectangleProps` interface extends the [`google.maps.RectangleOptions` interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#RectangleOptions) and includes all possible options available for a Rectangle.

### Controlled / Uncontrolled (for Editable Rectangles)

The distinction between controlled and uncontrolled usage patterns is only relevant when the rectangle is `editable` or `draggable`. When a rectangle is editable, the Google Maps API automatically adds handles to resize the rectangle on the map and handles all mouse events for those handles internally, allowing users to modify the shape directly.

```tsx
// Uncontrolled - initial value only, users can edit freely
<Rectangle
  defaultBounds={{north: 53.56, south: 53.54, east: 10.03, west: 9.99}}
  editable
  draggable
/>

// Controlled - value always reflects props
<Rectangle bounds={bounds} editable draggable />
```

When using controlled props with `editable` or `draggable`, you must use the `onBoundsChanged` callback to sync state, otherwise the rectangle will snap back to its original position:

```tsx
const [bounds, setBounds] = useState({
  north: 53.56,
  south: 53.54,
  east: 10.03,
  west: 9.99
});

<Rectangle
  bounds={bounds}
  editable
  draggable
  onBoundsChanged={b => {
    if (!b) return;

    const ne = b.getNorthEast();
    const sw = b.getSouthWest();
    setBounds({
      north: ne.lat(),
      east: ne.lng(),
      south: sw.lat(),
      west: sw.lng()
    });
  }}
/>;
```

### Bounds Props

#### `bounds`: `google.maps.LatLngBoundsLiteral | google.maps.LatLngBounds`

The controlled bounds of the rectangle.

#### `defaultBounds`: `google.maps.LatLngBoundsLiteral | google.maps.LatLngBounds`

The initial bounds of the rectangle (uncontrolled).

### Event Props

#### `onClick`: `(e: google.maps.MapMouseEvent) => void`

Called when the rectangle is clicked.

#### `onDrag`: `(e: google.maps.MapMouseEvent) => void`

Called repeatedly while the rectangle is being dragged.

#### `onDragStart`: `(e: google.maps.MapMouseEvent) => void`

Called when dragging of the rectangle begins.

#### `onDragEnd`: `(e: google.maps.MapMouseEvent) => void`

Called when dragging of the rectangle ends.

#### `onMouseOver`: `(e: google.maps.MapMouseEvent) => void`

Called when the mouse enters the rectangle.

#### `onMouseOut`: `(e: google.maps.MapMouseEvent) => void`

Called when the mouse leaves the rectangle.

#### `onBoundsChanged`: `(bounds: google.maps.LatLngBounds | null | undefined) => void`

Called when the bounds are changed (via dragging or editing).

### Style Props

All styling options from `google.maps.RectangleOptions` are supported:

- `fillColor`: string
- `fillOpacity`: number
- `strokeColor`: string
- `strokeOpacity`: number
- `strokeWeight`: number

### Behavior Props

- `clickable`: boolean - Whether the rectangle handles mouse events
- `draggable`: boolean - Whether the rectangle can be dragged
- `editable`: boolean - Whether the rectangle can be edited
- `visible`: boolean - Whether the rectangle is visible
- `zIndex`: number - The z-index of the rectangle

#### Automatic Property Inference

The `clickable`, `draggable`, and `editable` properties are automatically inferred based on the presence of event handlers:

- `clickable` is automatically set to `true` when `onClick` is provided
- `draggable` is automatically set to `true` when `onDrag`, `onDragStart`, `onDragEnd`, or `onBoundsChanged` is provided
- `editable` is automatically set to `true` when `onBoundsChanged` is provided

You can still explicitly set these properties to override the automatic inference, including setting them to `false` to disable the behavior even when handlers are present.

## Extracting the Rectangle Instance

You can access the underlying `google.maps.Rectangle` instance via a ref:

```tsx
const rectangleRef = useRef<google.maps.Rectangle>(null);

<Rectangle
  ref={rectangleRef}
  bounds={{north: 53.56, south: 53.54, east: 10.03, west: 9.99}}
/>;
```
