# `<InfoWindow>` Component

React component to display an [Info Window](https://developers.google.com/maps/documentation/javascript/reference/info-window) instance.

## Usage

Info Windows can either be displayed alone, or in connection with a Marker
that will be used as an anchor. The content of the InfoWindow can either be
text or any JSX and is specified as the children of the InfoWindow
component.

Under the hood this is using the `google.maps.InfoWindow` class. The default
InfoWindow does come with a close-button that can't easily be removed or
controlled via the API. This means that the visibility of the infowindow
cannot be fully controlled by your application. To keep your state in sync
with the map, you can listen for the `onCloseClick` event.

### Single Info Window implementation

```tsx
import React from 'react';
import {APIProvider, Map, InfoWindow} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
      <InfoWindow position={{lat: 53.54992, lng: 10.00678}}>
        Hello World!
      </InfoWindow>
    </Map>
  </APIProvider>
);

export default App;
```

### Marker with JSX implementation

```tsx
import React from 'react';
import {
  APIProvider,
  Map,
  Marker,
  useMarkerRef
} from '@vis.gl/react-google-maps';

const App = () => {
  const [markerRef, marker] = useMarkerRef();

  return (
    <APIProvider apiKey={'Your API key here'}>
      <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
        <Marker ref={markerRef} position={{lat: 53.54992, lng: 10.00678}} />

        <InfoWindow anchor={marker}>
          <h2>Hello everyone!</h2>
          <p>This is an Info Window</p>
          <img src="..." />
        </InfoWindow>
      </Map>
    </APIProvider>
  );
};

export default App;
```

**Note**: The position prop of the InfoWindow will be ignored when an anchor is specified.

### Advanced Marker View implementation

```tsx
import React, {FunctionComponent} from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

const App = () => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infowindowShown, setInfowindowShown] = useState(false);

  const toggleInfoWindow = () =>
    setInfowindowShown(previousState => !previousState);

  const closeInfoWindow = () => setInfowindowShown(false);

  return (
    <APIProvider apiKey={'Your API key here'}>
      <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}} mapId={'<Your custom MapId here>'}>
        <AdvancedMarker
          ref={markerRef}
          position={{lat: 53.54992, lng: 10.00678}}
          onClick={toggleInfoWindow}
        />

        {infowindowShown && (
          <InfoWindow anchor={marker} onCloseClick={closeInfoWindow}>
            You can drag and drop me.
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export default App;
```

## Props

The InfoWindowProps interface extends the [google.maps.InfoWindowOptions interface](https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions) and includes all possible options available for a Google Maps Info Window.

- `onCloseClick` adds the event listener 'closeclick' to the info infowindow
- `anchor` a Marker or AdvancedMarker instance to be used as an anchor

```tsx
export type InfoWindowProps = google.maps.InfoWindowOptions & {
  onCloseClick?: () => void;
  anchor?: google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null;
};
```

To see an InfoWindow on the map, either the `position` property or the anchor needs to be set.
