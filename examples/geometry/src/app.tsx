import React from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map, Circle} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';
import CircleControlPanel from './circle-control-panel';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  const [center, setCenter] = React.useState({lat: 40, lng: -74});
  const [radius, setRadius] = React.useState(15000);

  const changeCenter = (newCenter: google.maps.LatLng | null) => {
    if (!newCenter) return;
    setCenter({lng: newCenter.lng(), lat: newCenter.lat()});
  };

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        zoom={10}
        center={{lat: 40, lng: -74}}
        gestureHandling={'greedy'}
        disableDefaultUI={true}>
        <Circle
          radius={radius}
          center={center}
          onRadiusChanged={setRadius}
          onCenterChanged={changeCenter}
          strokeColor={'#0c4cb3'}
          strokeOpacity={1}
          strokeWeight={3}
          fillColor={'#3b82f6'}
          fillOpacity={0.3}
          editable={true}
          draggable={true}
        />
      </Map>
      <ControlPanel />
      <CircleControlPanel
        center={center}
        radius={radius}
        onCenterChanged={setCenter}
        onRadiusChanged={setRadius}
      />
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
