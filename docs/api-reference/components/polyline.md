# `<Polyline>` Component

React component to display
a [Polyline](https://developers.google.com/maps/documentation/javascript/reference/polygon#Polyline)
on the map.

## Usage

```tsx
import React from 'react';
import {APIProvider, Map, Polyline} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
      <Polyline
        path={[
          {lat: 53.54, lng: 10.0},
          {lat: 53.55, lng: 10.02},
          {lat: 53.56, lng: 10.01}
        ]}
        strokeColor={'#ff0000'}
        strokeWeight={3}
      />
    </Map>
  </APIProvider>
);

export default App;
```

## Props

The `PolylineProps` interface extends the [
`google.maps.PolylineOptions` interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#PolylineOptions)
and includes all possible options available for a Polyline.

### Editable Polylines and Controlled / Uncontrolled State

The distinction between controlled and uncontrolled usage patterns is only
relevant when the polyline is `editable` or `draggable`. When a polyline is
editable, the Google Maps API automatically adds handles to the vertices on the
map and handles all mouse events for those handles internally, allowing users to
modify the shape directly.

```tsx
// Uncontrolled - initial value only, users can edit freely
<Polyline
    defaultPath={[{lat: 53.5, lng: 10}, {lat: 53.6, lng: 10.1}]}
    editable
/>

// Controlled - value always reflects props
<Polyline path={path} editable/>
```

When using controlled props with `editable` or `draggable`, you must use the
`onPathChanged` callback to sync state, otherwise the polyline will snap back to
its original position:

```tsx
const [path, setPath] = useState([
  {lat: 53.5, lng: 10},
  {lat: 53.6, lng: 10.1}
]);

<Polyline
  path={path}
  editable
  draggable
  onPathChanged={newPath => setPath(newPath.map(p => p.toJSON()))}
/>;
```

### Path Props

#### `polyline`: `google.maps.Polyline`

An existing `google.maps.Polyline` instance to use instead of creating a new
one. When provided, all other props (path, options, event handlers) will still
be applied to this instance.

```tsx
const polylineInstance = new google.maps.Polyline();

// Minimal usage - just add existing instance to the map
<Polyline polyline={polylineInstance}/>

// Apply additional props to the existing instance
<Polyline
    polyline={polylineInstance}
    strokeColor={'#ff0000'}
    strokeWeight={3}
    onClick={(e) => console.log('clicked')}
/>
```

#### `path`: `Array<google.maps.LatLng | google.maps.LatLngLiteral>`

The controlled path of the polyline.

#### `defaultPath`: `Array<google.maps.LatLng | google.maps.LatLngLiteral>`

The initial path of the polyline (uncontrolled).

#### `encodedPath`: string

An [encoded polyline](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
string. When provided, will be decoded and used as the path. Takes precedence
over the `path` prop if both are specified.

```tsx
<Polyline
  encodedPath="_p~iF~ps|U_ulLnnqC_mqNvxq`@"
  strokeColor={'#0088ff'}
  strokeWeight={4}
/>
```

:::note

When using `encodedPath`, the geometry library will be automatically loaded.

:::

### Event Props

#### `onClick`: `(e: google.maps.MapMouseEvent) => void`

Called when the polyline is clicked.

#### `onDrag`: `(e: google.maps.MapMouseEvent) => void`

Called repeatedly while the polyline is being dragged.

#### `onDragStart`: `(e: google.maps.MapMouseEvent) => void`

Called when dragging of the polyline begins.

#### `onDragEnd`: `(e: google.maps.MapMouseEvent) => void`

Called when dragging of the polyline ends.

#### `onMouseOver`: `(e: google.maps.MapMouseEvent) => void`

Called when the mouse enters the polyline.

#### `onMouseOut`: `(e: google.maps.MapMouseEvent) => void`

Called when the mouse leaves the polyline.

#### `onPathChanged`: `(path: google.maps.LatLng[]) => void`

Called when the path is changed (via dragging or editing vertices).

### Style Props

All styling options from `google.maps.PolylineOptions` are supported:

- `strokeColor`: string
- `strokeOpacity`: number
- `strokeWeight`: number
- `geodesic`: boolean - When true, edges of the polyline are interpreted as
  geodesic arcs
- `icons`: `google.maps.IconSequence[]` - Icons to render along the polyline

### Behavior Props

- `clickable`: boolean - Whether the polyline handles mouse events
- `draggable`: boolean - Whether the polyline can be dragged
- `editable`: boolean - Whether the polyline can be edited
- `visible`: boolean - Whether the polyline is visible
- `zIndex`: number - The z-index of the polyline

#### Automatic Property Inference

The `clickable`, `draggable`, and `editable` properties are automatically
inferred based on the presence of event handlers:

- `clickable` is automatically set to `true` when `onClick` is provided
- `draggable` is automatically set to `true` when `onDrag`, `onDragStart`,
  `onDragEnd`, or `onPathChanged` is provided
- `editable` is automatically set to `true` when `onPathChanged` is provided

You can still explicitly set these properties to override the automatic
inference, including setting them to `false` to disable the behavior even when
handlers are present.

## Extracting the Polyline Instance

You can access the underlying `google.maps.Polyline` instance via a ref:

```tsx
const polylineRef = useRef<google.maps.Polyline>(null);

<Polyline
  ref={polylineRef}
  path={[
    {lat: 53.54, lng: 10.0},
    {lat: 53.55, lng: 10.02}
  ]}
/>;
```
