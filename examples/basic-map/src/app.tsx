import React, {FunctionComponent} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

const App = () => (
  <APIProvider apiKey={API_KEY}>
    <Map
      zoom={10}
      center={{lat: 53.54992, lng: 10.00678}}
      gestureHandling={'greedy'}
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
