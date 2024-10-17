import React, {Ref, useCallback, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, InfoWindow, Map} from '@vis.gl/react-google-maps';
import {ClusteredMarkers} from './components/clustered-markers';

import ControlPanel from './control-panel';
import {loadCastlesGeojson, CastlesGeojson} from './castles';

import './style.css';
import {Feature, Point} from 'geojson';
import {InfoWindowContent} from './components/info-window-content';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  const [geojson, setGeojson] = useState<CastlesGeojson | null>(null);
  const [numClusters, setNumClusters] = useState(0);

  useEffect(() => {
    void loadCastlesGeojson().then(data => setGeojson(data));
  }, []);

  const [infowindowData, setInfowindowData] = useState<{
    anchor: google.maps.marker.AdvancedMarkerElement;
    features: Feature<Point>[];
  } | null>(null);

  const handleInfoWindowClose = useCallback(
    () => setInfowindowData(null),
    [setInfowindowData]
  );

  return (
    <APIProvider apiKey={API_KEY} version={'beta'}>
      <Map
        mapId={'b5387d230c6cf22f'}
        defaultCenter={{lat: 20, lng: 20}}
        defaultZoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI
        onClick={() => setInfowindowData(null)}
        className={'custom-marker-clustering-map'}>
        {geojson && (
          <ClusteredMarkers
            geojson={geojson}
            setNumClusters={setNumClusters}
            setInfowindowData={setInfowindowData}
          />
        )}

        {infowindowData && (
          <InfoWindow
            onCloseClick={handleInfoWindowClose}
            anchor={infowindowData.anchor}>
            <InfoWindowContent features={infowindowData.features} />
          </InfoWindow>
        )}
      </Map>

      <ControlPanel
        numClusters={numClusters}
        numFeatures={geojson?.features.length || 0}
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
