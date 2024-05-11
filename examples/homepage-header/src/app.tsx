import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const AnimatedMap = () => {
  const [center, setCenter] = useState({lat: 54.143, lng: 8.327});
  useEffect(() => {
    let rafId = requestAnimationFrame(function loop(t) {
      rafId = requestAnimationFrame(loop);

      setCenter({
        lat: 54.143 + Math.cos(t / 10000) * 0.1,
        lng: 8.327 + Math.sin(t / 9000) * 0.2
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Map
      mapId={'5e13191437f4efb4'}
      center={center}
      zoom={9}
      style={{position: 'absolute', top: 0, left: 0, zIndex: -1}}
      disableDefaultUI
      controlled
      reuseMaps
    />
  );
};

const App = () => (
  <APIProvider apiKey={API_KEY}>
    <AnimatedMap />
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
