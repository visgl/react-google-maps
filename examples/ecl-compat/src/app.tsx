import React from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import {RouteOverview} from '@googlemaps/extended-component-library/react';
import ControlPanel from './control-panel';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => (
  <APIProvider apiKey={API_KEY} version={'beta'}>
    <Map
      mapId={'49ae42fed52588c3'}
      defaultCenter={{lat: 53.55, lng: 10.05}}
      defaultZoom={10}
      gestureHandling={'greedy'}
      disableDefaultUI={true}>
      <RouteOverview
        originAddress={'Little Island, New York'}
        destinationAddress={'Times Square Plaza, New York'}
        travelMode={'walking'}
        noPin></RouteOverview>
    </Map>
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
