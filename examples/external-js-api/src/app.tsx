import React from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';
import {useExternallyLoadedMapsAPI} from './useExternallyLoadedMapsAPI';

const API_URL =
  globalThis.GOOGLE_MAPS_API_URL ?? (process.env.GOOGLE_MAPS_API_URL as string);

const App = () => {
  const isLoaded = useExternallyLoadedMapsAPI(API_URL);
  return (
    isLoaded && (
      <APIProvider apiKey="">
        <Map
          defaultZoom={5}
          defaultCenter={{lat: 42.54992, lng: 0}}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        />
        <ControlPanel />
      </APIProvider>
    )
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
