# DeckGL Integration

## Using the `Map` as a child of `DeckGL`

To use deck.gl with the `Map` component wrap the `Map` component with
the [DeckGL React component](https://deck.gl/docs/get-started/using-with-react).

The following props need to be defined and passed to the DeckGL component:

- `intialViewState`
- `layers`
- `controller`
- `onViewStateChange`

Make sure that the controller is always set to true and an initial view state is defined. To ensure that deck.gl works
well with the Google Maps Platform map, set the `limitTiltRange` function, which can be imported from the Google Maps React
library, to `onViewStateChange`.

```tsx
import {limitTiltRange} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      layers={layers}
      controller={true}
      onViewStateChange={limitTiltRange}>
      <Map {...GOOGLE_MAPS_MAP_OPTIONS} />
    </DeckGL>
  </APIProvider>
);
```

## Using GoogleMapsOverlay

Alternatively, you can also use the `GoogleMapsOverlay` provided by the `@deck.gl/google-maps` package to render deck.gl
content via Maps API `WebGlOverlayView`. An example for this can be found in [`./examples/deckgl-overlay`](https://github.com/visgl/react-google-maps/tree/1a0ac6e13d15ceda5212d310ffc2370ffdd90e65/examples/deckgl-overlay).

For this you have to implement your own component and add it to the `Map` component.
A simplified version of this would be:

```javascript
import {useEffect, useMemo} from 'react';
import {useMap} from '@vis.gl/react-google-maps';
import {GoogleMapsOverlay} from '@deck.gl/google-maps';

export const DeckGlOverlay = ({layers}) => {
  const deck = useMemo(() => new GoogleMapsOverlay({interleaved: true}), []);

  const map = useMap();
  useEffect(() => deck.setMap(map), [map]);
  useEffect(() => deck.setProps({layers}), [layers]);

  // no dom rendered by this component
  return null;
};

const App = () => (
  <APIProvider apiKey={API_KEY}>
    <Map {...mapProps}>
      <DeckGlOverlay layers={deckGlLayers} />
    </Map>
  </APIProvider>
);
```
