import React, {useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  ControlPosition,
  Map,
  MapControl
} from '@vis.gl/react-google-maps';

import ControlPanel from './control-panel';
import {CustomZoomControl} from './custom-zoom-control';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  const [controlPosition, setControlControlPosition] =
    useState<ControlPosition>(ControlPosition.LEFT_BOTTOM);

  const [zoom, setZoom] = useState(4);
  const center = useMemo(() => ({lat: 0, lng: 20}), []);

  return (
    <APIProvider apiKey={API_KEY}>
      {/* note that we can also use a mix of controlled (zoom) an
          uncontrolled (center) properties here */}
      <Map
        disableDefaultUI={true}
        gestureHandling={'greedy'}
        mapId={'49ae42fed52588c3'}
        defaultCenter={center}
        zoom={zoom}
        onZoomChanged={ev => setZoom(ev.detail.zoom)}>
        <MapControl position={ControlPosition.TOP_LEFT}>
          <div
            style={{
              background: 'white',
              padding: '1em'
            }}>
            Zoom: {zoom.toFixed(2)}
          </div>
        </MapControl>

        <CustomZoomControl
          controlPosition={controlPosition}
          zoom={zoom}
          onZoomChange={zoom => setZoom(zoom)}
        />
      </Map>

      <ControlPanel
        position={controlPosition}
        onControlPositionChange={p => setControlControlPosition(p)}
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
