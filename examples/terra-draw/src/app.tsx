import React from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  ControlPosition,
  Map,
  MapControl
} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';
import DrawingControls from './drawing-controls';
import GeoJsonControls from './geojson-controls';
import TerraDrawLayer from './terra-draw-layer';

// Provide the Maps JavaScript API key via GOOGLE_MAPS_API_KEY (see README).
const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => (
  <APIProvider apiKey={API_KEY}>
    {/* TerraDrawLayer initializes the draw instance once the map is ready. */}
    <TerraDrawLayer>
      {draw => (
        <>
          <Map
            defaultZoom={3}
            defaultCenter={{lat: 22.54992, lng: 0}}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          />
          {/* MapControl renders a simple toolbar inside the map UI. */}
          <MapControl position={ControlPosition.TOP_LEFT}>
            <div className="terra-draw-toolbar">
              <DrawingControls draw={draw} />
              <GeoJsonControls draw={draw} />
            </div>
          </MapControl>
          <ControlPanel />
        </>
      )}
    </TerraDrawLayer>
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
