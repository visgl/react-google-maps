# `<Polygon>` Component

React component to display a [Polygon](https://developers.google.com/maps/documentation/javascript/reference/polygon#Polygon) on the map.

## Usage

```tsx
import React from 'react';
import {APIProvider, Map, Polygon} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
      <Polygon
        paths={[
          {lat: 53.54, lng: 10.0},
          {lat: 53.55, lng: 10.02},
          {lat: 53.56, lng: 10.01}
        ]}
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

The `PolygonProps` interface extends the [`google.maps.PolygonOptions` interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#PolygonOptions) and includes all possible options available for a Polygon.

### Path Props

#### `paths`: `google.maps.MVCArray<...> | google.maps.LatLng[] | google.maps.LatLngLiteral[] | google.maps.LatLng[][] | google.maps.LatLngLiteral[][]`

The ordered sequence of coordinates that designates a closed loop. Polygons may contain multiple paths to define complex shapes with holes.

```tsx
// Simple polygon
<Polygon paths={[
  {lat: 53.54, lng: 10.0},
  {lat: 53.55, lng: 10.02},
  {lat: 53.56, lng: 10.01}
]} />

// Polygon with hole
<Polygon paths={[
  // Outer path
  [{lat: 53.54, lng: 10.0}, {lat: 53.55, lng: 10.02}, {lat: 53.56, lng: 10.01}],
  // Inner path (hole)
  [{lat: 53.545, lng: 10.005}, {lat: 53.55, lng: 10.015}, {lat: 53.555, lng: 10.008}]
]} />
```

#### `encodedPaths`: string[]

An array of [encoded polyline](https://developers.google.com/maps/documentation/utilities/polylinealgorithm) strings. When provided, will be decoded and used as the paths. Takes precedence over the `paths` prop if both are specified.

```tsx
<Polygon
  encodedPaths={['_p~iF~ps|U_ulLnnqC_mqNvxq`@', 'gg~iF~|s|UaaJhMcBxY']}
  fillColor={'#0088ff'}
  fillOpacity={0.3}
/>
```

:::note

When using `encodedPaths`, the geometry library will be automatically loaded.

:::

### Event Props

#### `onClick`: `(e: google.maps.MapMouseEvent) => void`

Called when the polygon is clicked.

#### `onDrag`: `(e: google.maps.MapMouseEvent) => void`

Called repeatedly while the polygon is being dragged.

#### `onDragStart`: `(e: google.maps.MapMouseEvent) => void`

Called when dragging of the polygon begins.

#### `onDragEnd`: `(e: google.maps.MapMouseEvent) => void`

Called when dragging of the polygon ends.

#### `onMouseOver`: `(e: google.maps.MapMouseEvent) => void`

Called when the mouse enters the polygon.

#### `onMouseOut`: `(e: google.maps.MapMouseEvent) => void`

Called when the mouse leaves the polygon.

### Style Props

All styling options from `google.maps.PolygonOptions` are supported:

- `fillColor`: string
- `fillOpacity`: number
- `strokeColor`: string
- `strokeOpacity`: number
- `strokeWeight`: number
- `geodesic`: boolean - When true, edges of the polygon are interpreted as geodesic arcs

### Behavior Props

- `clickable`: boolean - Whether the polygon handles mouse events
- `draggable`: boolean - Whether the polygon can be dragged
- `editable`: boolean - Whether the polygon can be edited
- `visible`: boolean - Whether the polygon is visible
- `zIndex`: number - The z-index of the polygon

## Extracting the Polygon Instance

You can access the underlying `google.maps.Polygon` instance via a ref:

```tsx
const polygonRef = useRef<google.maps.Polygon>(null);

<Polygon
  ref={polygonRef}
  paths={[
    {lat: 53.54, lng: 10.0},
    {lat: 53.55, lng: 10.02},
    {lat: 53.56, lng: 10.01}
  ]}
/>;
```
