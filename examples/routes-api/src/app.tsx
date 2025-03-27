import React from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';

import {RoutesApi} from './routes-api';
import ControlPanel from './control-panel';
import Route from './components/route';

import './app.css';

// @ts-ignore
const API_KEY: string = (globalThis.GOOGLE_MAPS_API_KEY ??
  process.env.GOOGLE_MAPS_API_KEY) as string;

// We use an "apiClient", in this case a glorified wrapper around a fetch-request
const apiClient = new RoutesApi(API_KEY);

const routeOrigin = {lng: 9.9004303, lat: 53.588241};
const routeDestination = {lng: 13.43765, lat: 52.52967};

const appearance = {
  walkingPolylineColor: '#000',
  defaultPolylineColor: '#7c7c7c',
  stepMarkerFillColor: '#333333',
  stepMarkerBorderColor: '#000000'
};

// for all options, see https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes#request-body
const routeOptions = {
  travelMode: 'TRANSIT',
  departureTime: '2025-03-27T15:00:00Z',
  computeAlternativeRoutes: false,
  units: 'METRIC'
};

const mapOptions = {
  mapId: '49ae42fed52588c3',
  defaultCenter: {lat: 22, lng: 0},
  defaultZoom: 3,
  gestureHandling: 'greedy',
  disableDefaultUI: true
};

const App = () => (
  <APIProvider apiKey={API_KEY}>
    <Map className={'route-api-example'} {...mapOptions}>
      <Route
        apiClient={apiClient}
        origin={routeOrigin}
        destination={routeDestination}
        routeOptions={routeOptions}
        appearance={appearance}
      />
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
