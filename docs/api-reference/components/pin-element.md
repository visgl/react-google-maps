# `<Pin>` Component

React component to display
a [Pin Element](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement)
instance.
The Pin Element Component can only be used together with the Advanced Marker Element. To see how to implement an Advanced
Marker Element, please check: [Advanced Marker Element](advanced-marker-element.md).

## Usage

The Pin Element component needs to be wrapped inside an Advanced Marker Element component.

```tsx
import React, {FunctionComponent} from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker
} from '@vis.gl/react-google-maps-components';

const App: FunctionComponent<Record<string, unknown>> = () => (
  <APIProvider
    apiKey={'Your API key here'}
    libraries={['marker']}
    version={'beta'}>
    <Map
      zoom={12}
      center={{lat: 53.54992, lng: 10.00678}}
      mapId={'<Your custom MapId here>'}>
      <AdvancedMarker position={{lat: 53.54992, lng: 10.00678}}>
        <Pin
          background={'#FBBC04'}
          glyphColor={'#000'}
          borderColor={'#000'}
        />
      </AdvancedMarker>
    </Map>
  </APIProvider>
);
export default App;
```

## Props

The Pin Element Props type mirrors
the [google.maps.PinElementOptions interface](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions)
and includes all possible options available for a Pin Element instance.

```tsx
type PinElementProps = google.maps.marker.PinElementOptions;
```

To see a Pin Element on the Map, it has to be wrapped inside an Advanced Marker Element and the `position` property needs to
be set.
