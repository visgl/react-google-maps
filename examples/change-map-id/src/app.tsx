import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';

import {
  Marker,
  APIProvider,
  InfoWindow,
  Map,
  useMarkerRef
} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

import {getApiKey} from './lib/get-api-key';

const API_KEY = getApiKey();

const MapTypeId = {
  HYBRID: 'hybrid',
  ROADMAP: 'roadmap',
  SATELLITE: 'satellite',
  TERRAIN: 'terrain'
};
export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
};

const MAP_CONFIGS: MapConfig[] = [
  {
    id: 'light',
    label: 'Light',
    mapId: '49ae42fed52588c3',
    mapTypeId: MapTypeId.ROADMAP
  },
  {
    id: 'dark',
    label: 'Dark',
    mapId: '739af084373f96fe',
    mapTypeId: MapTypeId.ROADMAP
  },
  {
    id: 'satellite',
    label: 'Satellite (no mapId)',
    mapTypeId: MapTypeId.SATELLITE
  },
  {
    id: 'hybrid',
    label: 'Hybrid (no mapId)',
    mapTypeId: MapTypeId.HYBRID
  },
  {
    id: 'terrain',
    label: 'Terrain (no mapId)',
    mapTypeId: MapTypeId.TERRAIN
  },
  {
    id: 'satellite2',
    label: 'Satellite ("light" mapId)',
    mapId: '49ae42fed52588c3',
    mapTypeId: MapTypeId.SATELLITE
  },
  {
    id: 'hybrid2',
    label: 'Hybrid ("light" mapId)',
    mapId: '49ae42fed52588c3',
    mapTypeId: MapTypeId.HYBRID
  },
  {
    id: 'terrain2',
    label: 'Terrain ("light" mapId)',
    mapId: '49ae42fed52588c3',
    mapTypeId: MapTypeId.TERRAIN
  }
];

const App = () => {
  const [mapConfig, setMapConfig] = useState<MapConfig>(MAP_CONFIGS[0]);
  const [infowindowOpen, setInfowindowOpen] = useState(true);
  const [markerRef, marker] = useMarkerRef();

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        mapId={mapConfig.mapId}
        mapTypeId={mapConfig.mapTypeId}
        center={{lat: 22, lng: 0}}
        zoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI={true}>
        <Marker
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
        mapConfigs={MAP_CONFIGS}
        mapConfigId={mapConfig.id}
        onMapConfigIdChange={id =>
          setMapConfig(MAP_CONFIGS.find(s => s.id === id)!)
        }
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
