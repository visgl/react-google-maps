import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';
import Heatmap from './heatmap';

import {FeatureCollection, Point, GeoJsonProperties} from 'geojson';
import earthquakes from '../data/earthquakes.json';

const earthquakeDataPoints: FeatureCollection<Point, GeoJsonProperties> =
  earthquakes as FeatureCollection<Point, GeoJsonProperties>;

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  const [radius, setRadius] = useState(25);
  const [opacity, setOpacity] = useState(0.8);

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        defaultCenter={{lat: 40.7749, lng: -130.4194}}
        defaultZoom={3}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      />
      <Heatmap
        geojson={earthquakeDataPoints}
        radius={radius}
        opacity={opacity}
      />
      <ControlPanel
        radius={radius}
        opacity={opacity}
        onRadiusChanged={setRadius}
        onOpacityChanged={setOpacity}
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
