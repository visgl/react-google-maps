# `<Circle>` Component

React component to display a [Circle](https://developers.google.com/maps/documentation/javascript/shapes#circles) instance.

## Usage

```tsx
import React, {FunctionComponent} from 'react';
import {APIProvider, Map, Circle} from '@vis.gl/react-google-maps';

const App: FunctionComponent<Record<string, unknown>> = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
      <Circle center={{lat: 53.54992, lng: 10.00678}} radius={15000} />
    </Map>
  </APIProvider>
);
export default App;
```

## Props

The CircleProps interface extends the [google.maps.CircleOptions interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#Circle) and includes all possible options available for a Google Maps Platform Circle. Additionally, it is possible to add different event listeners, e.g. the click event with the `onClick` property.

```tsx
interface CircleProps extends google.maps.CircleOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
  onRadiusChanged?: (r: ReturnType<google.maps.Circle['getRadius']>) => void;
  onCenterChanged?: (p: ReturnType<google.maps.Circle['getCenter']>) => void;
}
```

To see a Circle on the Map, the `center` and `radius` properties needs to be set.
