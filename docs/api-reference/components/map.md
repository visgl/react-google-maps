# `<Map>` Component

React component to display a [Map][gmp-map] instance.

```tsx
import React, {FunctionComponent} from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const App: FunctionComponent<Record<string, unknown>> = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={10} center={{lat: 53.54992, lng: 10.00678}} />
  </APIProvider>
);
export default App;
```

By default, the `Map` component is uncontrolled. That is, the props 
for controlling the camera (`center`, `zoom`, `heading` and `tilt`) only 
specify the initial value and the map will allow all user-interactions as is 
default for the Maps JavaScript API.

Only when the values for these props are changed, the camera is updated by 
the library to reflect those values.

## Props

The MapProps interface extends the [google.maps.MapOptions interface](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions)
and includes all possible options available for a Google Maps Platform Map.

Additionally, there are other optional properties for the map component.

To add custom style, the `style` property can be set to add inline style to
the default map style. Also, it is possible to add a class to the map via
the `className` property. The style passed with the `className` property
will overwrite the original default inline style of the map.

The `initialBounds` property can receive bounds on the initial map load.
When multiple `Map` components are used, it is necessary to apply an id to
each Map instance. The id can be used to reference the

Map instance when using the [`useMap` hook](../hooks/use-map.md).

```tsx
interface MapProps extends google.maps.MapOptions {
  id?: string;
  style?: CSSProperties;
  className?: string;
  initialBounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
  onLoadMap?: (map: google.maps.Map) => void;
  viewport?: unknown;
  viewState?: Record<string, any>;
  initialViewState?: Record<string, any>;
}
```

To see the Map on the screen, you must set `zoom` and `center` together, or `initialBounds` as options. These
options can also be set later via `map.setOptions(...)` when the Map instance is accessed via
the [useMap hook](../hooks/use-map.md). The props `viewport`, `viewState` and `initialViewState` are used
for an integration with the [DeckGL React Component](https://deck.gl/docs/get-started/using-with-react) and the Map.

[gmp-map]: https://developers.google.com/maps/documentation/javascript/reference/map#Map
