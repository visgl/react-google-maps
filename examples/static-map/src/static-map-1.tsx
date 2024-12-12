import React from 'react';
import {StaticMap, createStaticMapsUrl} from '@vis.gl/react-google-maps';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

export default function StaticMap1() {
  const staticMapsUrl = createStaticMapsUrl({
    apiKey: API_KEY,
    scale: 2,
    width: 600,
    height: 600,
    center: {lat: 53.555570296010295, lng: 10.008892744638956},
    zoom: 8,
    language: 'en'
  });

  return <StaticMap className="map" url={staticMapsUrl} />;
}
