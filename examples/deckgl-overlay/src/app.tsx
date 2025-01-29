import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';

import {GeoJsonLayer} from '@deck.gl/layers';
import {DeckGlOverlay} from './deckgl-overlay';

const DATA_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json';

import type {Feature, GeoJSON} from 'geojson';
import ControlPanel from './control-panel';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  const [data, setData] = useState<GeoJSON | null>(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then(res => res.json())
      .then(data => setData(data as GeoJSON));
  }, []);

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        defaultCenter={{lat: 37.74, lng: -122.4}}
        defaultZoom={11}
        mapId={'4f6dde3310be51d7'}
        gestureHandling={'greedy'}
        disableDefaultUI={true}>
        <DeckGlOverlay layers={getDeckGlLayers(data)} />
      </Map>
      <ControlPanel />
    </APIProvider>
  );
};

function getDeckGlLayers(data: GeoJSON | null) {
  if (!data) return [];

  return [
    new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      stroked: false,
      filled: true,
      extruded: true,
      pointType: 'circle',
      lineWidthScale: 20,
      lineWidthMinPixels: 4,
      getFillColor: [160, 160, 180, 200],
      getLineColor: (f: Feature) => {
        const hex = f?.properties?.color;

        if (!hex) return [0, 0, 0];

        return hex.match(/[0-9a-f]{2}/g)!.map((x: string) => parseInt(x, 16));
      },
      getPointRadius: 200,
      getLineWidth: 1,
      getElevation: 30
    })
  ];
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
