import React, { useEffect, useState } from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  Map3D,
  useMapsLibrary,
  useMap3D
} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

import './app.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const Programmatic3DRoute = () => {
  const map = useMap3D();
  const routesLibrary = useMapsLibrary('routes') as any;
  const maps3dLibrary = useMapsLibrary('maps3d') as any;

  useEffect(() => {
    console.log("=== 3D Routes Diagnostics ===");
    console.log("Map3D instance resolved:", map);
    console.log("routesLibrary state:", routesLibrary);
    console.log("maps3dLibrary state:", maps3dLibrary);
    if (window.google && window.google.maps) {
      console.log("Global window.google.maps keys:", Object.keys(window.google.maps));
    }
  }, [map, routesLibrary, maps3dLibrary]);

  useEffect(() => {
    if (!map || !routesLibrary || !maps3dLibrary) return;

    let polyline: any = null;

    // Fetch the route programmatically using SDK computeRoutes
    routesLibrary.Route.computeRoutes({
      origin: { lat: 43.65, lng: -79.38 },
      destination: { lat: 43.69, lng: -79.42 },
      travelMode: 'DRIVING',
      fields: ['*']
    }).then((response: any) => {
      const route = response.routes?.[0];
      if (!route) return;

      // Instantiate gmp-polyline-3d using the browser's custom element registry
      polyline = document.createElement('gmp-polyline-3d') as any;
      polyline.path = route.path;
      polyline.strokeColor = '#b903adff';
      polyline.strokeWidth = 5; // 5 meters wide (thinned, real-world width!)
      polyline.altitudeMode = 'RELATIVE_TO_GROUND';

      map.appendChild(polyline);
    });

    // Clean up polyline from the 3D Map on unmount
    return () => {
      if (polyline && polyline.parentNode) {
        polyline.parentNode.removeChild(polyline);
      }
    };
  }, [map, routesLibrary, maps3dLibrary]);

  return null;
};

const Map3DRoutesExample = () => {
  return (
    <>
      <Map3D
        defaultCenter={{ lat: 43.67, lng: -79.40, altitude: 100 }}
        defaultRange={12000}
        defaultHeading={0}
        defaultTilt={60}
        defaultRoll={0}
        defaultLabelsDisabled
        mapId="49ae42fed52588c3"
        style={{ width: '100%', height: '100%' }}>
        <Programmatic3DRoute />
      </Map3D>
    </>
  );
};

const App = () => {
  return (
    <APIProvider apiKey={API_KEY} version="alpha">
      <Map3DRoutesExample />
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
