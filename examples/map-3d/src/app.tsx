import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  Map3D,
  Map3DCameraChangedEvent,
  MapMouseEvent
} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';
import {MiniMap} from './minimap';

import './style.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

export type Map3DCameraProps = {
  center: google.maps.LatLngAltitudeLiteral;
  range: number;
  heading: number;
  tilt: number;
  roll: number;
};

const INITIAL_VIEW_PROPS: Map3DCameraProps = {
  center: {lat: 37.72809, lng: -119.64473, altitude: 1300},
  range: 5000,
  heading: 61,
  tilt: 69,
  roll: 0
};

const Map3DExample = () => {
  const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);

  const handleCameraChange = useCallback((ev: Map3DCameraChangedEvent) => {
    setViewProps(oldProps => ({...oldProps, ...ev.detail}));
  }, []);

  const handleMapClick = useCallback((ev: MapMouseEvent) => {
    if (!ev.detail.latLng) return;

    const {lat, lng} = ev.detail.latLng;
    setViewProps(p => ({...p, center: {lat, lng, altitude: 0}}));
  }, []);

  return (
    <>
      <Map3D
        {...viewProps}
        onCameraChanged={handleCameraChange}
        defaultLabelsDisabled
        mode="SATELLITE"
        style={{width: '100vw', height: '100vh'}}
      />

      <MiniMap camera3dProps={viewProps} onMapClick={handleMapClick} />
    </>
  );
};

const App = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <Map3DExample />
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
