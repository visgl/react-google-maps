import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';

import ControlPanel from './components/control-panel';
import {CustomAdvancedMarker} from './components/custom-advanced-marker/custom-advanced-marker';
import {loadRealEstateListing} from '../libs/load-real-estate-listing';

import {RealEstateListing} from './types/types';

import './style.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  const [realEstateListing, setRealEstateListing] =
    useState<RealEstateListing | null>(null);

  useEffect(() => {
    void loadRealEstateListing().then(data => {
      setRealEstateListing(data);
    });
  }, []);

  return (
    <div className="advanced-marker-example">
      <APIProvider apiKey={API_KEY} libraries={['marker']}>
        <Map
          mapId={'bf51a910020fa25a'}
          defaultZoom={5}
          defaultCenter={{lat: 47.53, lng: -122.34}}
          gestureHandling={'greedy'}
          disableDefaultUI>
          {/* advanced marker with html-content */}
          {realEstateListing && (
            <CustomAdvancedMarker realEstateListing={realEstateListing} />
          )}
        </Map>

        <ControlPanel />
      </APIProvider>
    </div>
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
