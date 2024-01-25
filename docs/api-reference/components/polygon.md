# `<Polygon>` Component

React component to display a [Polygon](https://developers.google.com/maps/documentation/javascript/shapes#circles) instance.

## Usage

```tsx
import React, {FunctionComponent} from 'react';
import {APIProvider, Map, Polygon} from '@vis.gl/react-google-maps';

const App: FunctionComponent<Record<string, unknown>> = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
      {/* Draw the Bermuda triangle */}
      <Polygon paths={[
        { lat: 25.774, lng: -80.190},
        { lat: 18.466, lng: -66.118},
        { lat: 32.321, lng: -64.757},
      ]} />

      {/* Draw the Bermuda triangle with an encoded path */}
      <Polygon encodedPaths=["o~h|CnbmhN~irk@_m{tAw`qsAgyhG"] />
    </Map>
  </APIProvider>
);
export default App;
```

## Props

The PolygonProps interface extends the [google.maps.PolygonOptions interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#Polygon) and includes all possible options available for a Google Maps Platform Polygon. Additionally, it is possible to add different event listeners, e.g. the click event with the `onClick` property.

```tsx
interface PolygonProps extends google.maps.PolygonOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
  encodedPaths?: string[];
}
```

To see a Polygon on the Map, the `paths` or `encodedPaths` properties needs to be set.
