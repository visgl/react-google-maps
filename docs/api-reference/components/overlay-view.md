# `<OverlayView>` Component

React component to display a [OverlayView]([https://developers.google.com/maps/documentation/javascript/reference/marker#Marker](https://developers.google.com/maps/documentation/javascript/customoverlays)) instance.

## Usage

```tsx
import React, {FunctionComponent} from 'react';
import {APIProvider, Map, OverlayView} from '@vis.gl/react-google-maps';

const App: FunctionComponent<Record<string, unknown>> = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
      <OverlayView position={{lat: 53.54992, lng: 10.00678}}>
        <div>
            <lable>Hello overlay view</label>
        </div>
      </OverlayView>
    </Map>
  </APIProvider>
);
export default App;
```


To see a OverlayView on the Map, the `position` property needs to be set.
