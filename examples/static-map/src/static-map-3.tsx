import React from 'react';
import {StaticMap, createStaticMapsUrl} from '@vis.gl/react-google-maps';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

export default function StaticMap3() {
  const staticMapsUrl = createStaticMapsUrl({
    apiKey: API_KEY,
    scale: 2,
    width: 600,
    height: 600,
    mapType: 'hybrid',
    format: 'jpg',
    paths: [
      {
        color: '0xff1493',
        fillcolor: '0xffff00',
        coordinates: [
          {lat: 52.5, lng: 10},
          'Berlin, Germany',
          'Hamburg, Germany'
        ]
      },
      {
        coordinates: [{lat: 52.5, lng: 10}, 'Leipzig, Germany']
      }
    ]
  });

  return <StaticMap className="map" url={staticMapsUrl} />;
}
