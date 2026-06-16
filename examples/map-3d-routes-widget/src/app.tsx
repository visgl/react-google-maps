import React from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map3D, useMapsLibrary} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

import './app.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

// Tell TypeScript to allow the custom <gmp-route-3d> element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-route-3d': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'autofits-camera'?: boolean;
        'departure-time'?: string;
        destination?: any;
        origin?: any;
        'routing-preference'?: string;
        'travel-mode'?: string;
      };
    }
  }
}

const Map3DRouteExample = () => {
  // Make sure routes and maps3d libraries are loaded to register the custom elements
  useMapsLibrary('routes');
  useMapsLibrary('maps3d');

  return (
    <>
      <Map3D
        defaultCenter={{lat: 43.67, lng: -79.4, altitude: 100}}
        defaultRange={12000}
        defaultHeading={0}
        defaultTilt={60}
        defaultRoll={0}
        defaultLabelsDisabled
        style={{width: '100vw', height: '100vh'}}>
        <gmp-route-3d
          origin={{lat: 43.65, lng: -79.38}}
          destination={{lat: 43.69, lng: -79.42}}
          travel-mode="DRIVING"
        />
      </Map3D>
    </>
  );
};

const App = () => {
  return (
    <APIProvider apiKey={API_KEY} version="alpha">
      <Map3DRouteExample />
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
