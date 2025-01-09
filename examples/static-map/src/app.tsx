import React from 'react';
import {createRoot} from 'react-dom/client';

import StaticMap1 from './static-map-1';
import StaticMap2 from './static-map-2';
import StaticMap3 from './static-map-3';
import StaticMap4 from './static-map-4';

import ControlPanel from './control-panel';

function App() {
  return (
    <div className="static-map-grid">
      <div className="map-container">
        <StaticMap1 />
      </div>
      <div className="map-container">
        <StaticMap2 />
      </div>
      <div className="map-container">
        <StaticMap3 />
      </div>
      <div className="map-container">
        <StaticMap4 />
      </div>

      <ControlPanel />
    </div>
  );
}

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
