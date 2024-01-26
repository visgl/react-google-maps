import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  MapCameraProps,
  Map,
  MapCameraChangedEvent
} from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

const INITIAL_CAMERA_STATE = {
  center: {lat: 53.5, lng: 10.05},
  zoom: 10,
  heading: 0,
  tilt: 0
};

const App = () => {
  const [cameraState, setCameraState] =
    useState<MapCameraProps>(INITIAL_CAMERA_STATE);
  const [activeMap, setActiveMap] = useState(1);
  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    const {center, zoom, heading, tilt} = ev.detail;
    console.log('handleCameraChange', center, zoom, heading, tilt);
    setCameraState(ev.detail);
  }, []);

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{display: 'flex', flexFlow: 'row nowrap', height: '100%'}}>
        {[0, 1].map(i => {
          const isActive = activeMap === i;

          return (
            <Map
              key={i}
              id={`map-${i}`}
              mapId={'49ae42fed52588c3'}
              disableDefaultUI
              onCameraChanged={isActive ? handleCameraChange : undefined}
              controlled={!isActive}
              onMouseover={() => setActiveMap(i)}
              {...cameraState}></Map>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 0, left: 0}}>
        Active: {activeMap}
      </div>
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
