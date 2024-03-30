import React from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => (
  <APIProvider apiKey={API_KEY} version={'beta'}>
    <Map
      defaultZoom={3}
      defaultCenter={{lat: 22.54992, lng: 0}}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    />
    <ControlPanel />
  </APIProvider>
);
export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
