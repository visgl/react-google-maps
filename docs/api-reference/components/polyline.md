# `<Polyline>` Component

React component to display a [Polyline](https://developers.google.com/maps/documentation/javascript/reference/polygon#Polyline) on the map.

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

The `PolylineProps` interface extends the [`google.maps.PolylineOptions` interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#PolylineOptions) and includes all possible options available for a Polyline.

### Path Props

#### `path`: `google.maps.MVCArray<google.maps.LatLng> | google.maps.LatLng[] | google.maps.LatLngLiteral[]`

The ordered sequence of coordinates of the polyline.

#### `encodedPath`: string

An [encoded polyline](https://developers.google.com/maps/documentation/utilities/polylinealgorithm) string. When provided, will be decoded and used as the path. Takes precedence over the `path` prop if both are specified.

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

### Style Props

All styling options from `google.maps.PolylineOptions` are supported:

- `strokeColor`: string
- `strokeOpacity`: number
- `strokeWeight`: number
- `geodesic`: boolean - When true, edges of the polyline are interpreted as geodesic arcs
- `icons`: `google.maps.IconSequence[]` - Icons to render along the polyline

### Behavior Props

- `clickable`: boolean - Whether the polyline handles mouse events
- `draggable`: boolean - Whether the polyline can be dragged
- `editable`: boolean - Whether the polyline can be edited
- `visible`: boolean - Whether the polyline is visible
- `zIndex`: number - The z-index of the polyline

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
