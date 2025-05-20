import React from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider} from '@vis.gl/react-google-maps';

import {Map3D} from './map-3d';
import ControlPanel from './control-panel';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const INITIAL_VIEW_PROPS = {
  center: {lat: 40.7006119, lng: -74.0032485, altitude: 600},
  range: 600,
  heading: 45,
  tilt: 60,
  roll: 0
};

const App = () => {
  return (
    <APIProvider
      apiKey={API_KEY}
      version={'alpha'}
      libraries={['maps3d', 'marker']}>
      <Map3D {...INITIAL_VIEW_PROPS} defaultLabelsDisabled />
      <ControlPanel />
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
