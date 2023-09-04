# `<Map>` Component

React component to display
a [Map](https://developers.google.com/maps/documentation/javascript/reference/map#Map) instance.

## Usage

## Single Map component

```tsx
import React, {FunctionComponent} from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps-components';

const App: FunctionComponent<Record<string, unknown>> = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={10} center={{lat: 53.54992, lng: 10.00678}} />
  </APIProvider>
);
export default App;
```

## Multiple Map components

Apply an id to each `Map` component when using multiple `Map` components.

```tsx
import React, {FunctionComponent} from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps-components';

const App: FunctionComponent<Record<string, unknown>> = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map id={'map-1'} zoom={10} center={{lat: 53.54992, lng: 10.00678}} />
    <Map id={'map-2'} zoom={10} center={{lat: 53.54992, lng: 10.00678}} />
    <Map id={'map-3'} zoom={10} center={{lat: 53.54992, lng: 10.00678}} />
    <Map id={'map-4'} zoom={10} center={{lat: 53.54992, lng: 10.00678}} />
  </APIProvider>
);
export default App;
```

## DeckGL Integration

To use deck.gl with the `Map` component wrap the `Map` component with
the [DeckGL React component](https://deck.gl/docs/get-started/using-with-react). The following props need to be defined
and passed to the DeckGL component:

- `intialViewState`
- `layers`
- `controller`
- `onViewStateChange`

Make sure that the controller is always set to true and an initial view state is defined. To ensure that deck.gl works
well with the Google Maps Platform map, set the `limitTiltRange` function, which can be imported from the Google Maps React
library, to `onViewStateChange`.

To add a layer to the map, add the layer to the layers array.

```tsx
<APIProvider apiKey={'Your API key here'}>
  <DeckGL
    initialViewState={INITIAL_VIEW_STATE}
    layers={layers}
    controller={true}
    onViewStateChange={limitTiltRange}>
    <Map {...GOOGLE_MAPS_MAP_OPTIONS} />
  </DeckGL>
</APIProvider>
```

## Props

The MapProps interface extends
the [google.maps.MapOptions interface](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions)
and includes all possible options available for a Google Maps Platform Map.

Additionally, there are other optional properties for the map component.

To add custom style, the `style` property can be set to add inline style to the default map style. Also, it is possible
to add a class to the map via the `className` property. The style passed with the `className` property will overwrite
the original default inline style of the map.

The `initialBounds` property can receive bounds on the initial map load.

When multiple `Map` components are used, it is necessary to apply an id to each Map instance. The id can be used to reference the
Map instance when using the [`useMap` hook](../hooks/useMap.md).

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
the [useMap hook](../hooks/useMap.md). The props `viewport`, `viewState` and `initialViewState` are used
for an integration with the [DeckGL React Component](https://deck.gl/docs/get-started/using-with-react) and the Map.
