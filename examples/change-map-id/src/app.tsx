import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

const MAP_IDS = {
  light: {label: 'Light', mapId: '49ae42fed52588c3'},
  dark: {label: 'Dark', mapId: '739af084373f96fe'}
};

const App = () => {
  const [mapId, setMapId] = useState(MAP_IDS.light.mapId);
  const [infowindowOpen, setInfowindowOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        mapId={mapId}
        center={{lat: 22, lng: 0}}
        zoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI={true}>
        <AdvancedMarker
          ref={markerRef}
          onClick={() => setInfowindowOpen(true)}
          position={{lat: 28, lng: -82}}
        />

        {infowindowOpen && (
          <InfoWindow
            anchor={marker}
            maxWidth={200}
            onCloseClick={() => setInfowindowOpen(false)}>
            This marker is here to show that marker and infowindow persist when
            changing the mapId.
          </InfoWindow>
        )}
      </Map>

      <ControlPanel
        mapIds={MAP_IDS}
        selectedMapId={mapId}
        setSelectedMapId={setMapId}
      />
    </APIProvider>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
