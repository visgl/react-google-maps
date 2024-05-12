import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, AdvancedMarker, Map, Pin} from '@vis.gl/react-google-maps';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const camera = {
  center: {
    lat: 53.543579046297054,
    lng: 9.980896868522361
  },
  zoom: 17.154875000000004,
  heading: 331,
  tilt: 67.5
};

const cameraTarget = {
  center: {
    lat: 53.54598152583651,
    lng: 9.973694898813758
  },
  zoom: 17,
  heading: 280,
  tilt: 67.5
};

const markerPositions = {
  marker01: {
    lat: 53.541474920067095,
    lng: 9.983737859638481,
    altitude: 100
  },
  marker02: {
    lat: 53.54578654749748,
    lng: 9.98605118632637
  },
  marker03: {
    lat: 53.54936883967302,
    lng: 9.978252494325707
  },
  marker04: {
    lat: 53.54615528208356,
    lng: 9.971257026513767
  }
};

const AnimatedMap = () => {
  const [center, setCenter] = useState(camera.center);
  useEffect(() => {
    let rafId = requestAnimationFrame(function loop(t) {
      rafId = requestAnimationFrame(loop);

      setCenter({
        lat: camera.center.lat + Math.sin(t / 10000) * 0.001,
        lng: camera.center.lng + Math.sin(t / 9000) * 0.002
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Map
      mapId={'5e13191437f4efb4'}
      zoom={camera.zoom}
      center={center}
      heading={camera.heading}
      tilt={camera.tilt}
      style={{position: 'absolute', top: 0, left: 0, zIndex: -1}}
      disableDefaultUI
      reuseMaps>
      <AdvancedMarker position={markerPositions.marker01}>
        <Pin borderColor={'#b31412'} scale={3} />
      </AdvancedMarker>
      <AdvancedMarker position={markerPositions.marker02}>
        <Pin
          background={'#F4B400'}
          borderColor={'#DBA200'}
          glyphColor={'#DBA200'}
          scale={2}
        />
      </AdvancedMarker>
      <AdvancedMarker position={markerPositions.marker03}>
        <Pin
          background={'#4285F4'}
          borderColor={'#3B78DB'}
          glyphColor={'#3B78DB'}
          scale={2}
        />
      </AdvancedMarker>
      <AdvancedMarker position={markerPositions.marker04}>
        <Pin
          background={'#0F9D58'}
          borderColor={'#0D854A'}
          glyphColor={'#0D854A'}
          scale={2}
        />
      </AdvancedMarker>
    </Map>
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
