import React from 'react';
import {createRoot} from 'react-dom/client';

// import {Wrapper} from '@googlemaps/react-wrapper';
import {Wrapper} from './wrapper';

const API_KEY =
  // @ts-ignore
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const MapsTest = () => {
  return <h1>Google Maps JavaScript API v{google.maps.version} Loaded.</h1>;
};

const App = () => (
  <Wrapper apiKey={API_KEY} render={status => <h1>Status: {status}</h1>}>
    <MapsTest />
  </Wrapper>
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
