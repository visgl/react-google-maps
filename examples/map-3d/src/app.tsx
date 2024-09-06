import React, {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, MapMouseEvent} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';
import {MiniMap} from './minimap';

import {Map3D, Map3DCameraProps} from './map-3d';

import './style.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const INITIAL_VIEW_PROPS = {
  center: {lat: 37.72809, lng: -119.64473, altitude: 1300},
  range: 5000,
  heading: 61,
  tilt: 69,
  roll: 0
};

const Map3DExample = () => {
  const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);

  const handleCameraChange = useCallback((props: Map3DCameraProps) => {
    setViewProps(oldProps => ({...oldProps, ...props}));
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
        onCameraChange={handleCameraChange}
        defaultLabelsDisabled
      />

      <MiniMap camera3dProps={viewProps} onMapClick={handleMapClick}></MiniMap>
    </>
  );
};

const App = () => {
  const nonAlphaVersionLoaded = Boolean(
    globalThis &&
      globalThis.google?.maps?.version &&
      !globalThis.google?.maps?.version.endsWith('-alpha')
  );

  if (nonAlphaVersionLoaded) {
    location.reload();
    return;
  }

  return (
    <APIProvider apiKey={API_KEY} version={'alpha'}>
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
