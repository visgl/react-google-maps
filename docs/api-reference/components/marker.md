# `<Marker>` Component

React component to display a [Marker](https://developers.google.com/maps/documentation/javascript/reference/marker#Marker) instance.

## Usage

```tsx
import React, {FunctionComponent} from 'react';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

const App: FunctionComponent<Record<string, unknown>> = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
      <Marker position={{lat: 53.54992, lng: 10.00678}} />
    </Map>
  </APIProvider>
);
export default App;
```

## Props

The MarkerProps interface extends the [google.maps.MarkerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions) and includes all possible options available for a Google Maps Platform Marker. Additionally, it is possible to add different event listeners, e.g. the click event with the `onClick` property.

```tsx
interface MarkerProps extends google.maps.MarkerOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
}
```

To see a Marker on the Map, the `position` property needs to be set.
