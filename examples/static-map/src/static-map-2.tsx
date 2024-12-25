import React from 'react';
import {StaticMap, createStaticMapsUrl} from '@vis.gl/react-google-maps';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

export default function StaticMap2() {
  const staticMapsUrl = createStaticMapsUrl({
    apiKey: API_KEY,
    scale: 2,
    width: 600,
    height: 600,
    mapId: '8e0a97af9386fef',
    format: 'png',
    markers: [
      {
        location: 'Hamburg, Germany',
        color: '0xff1493',
        label: 'H',
        size: 'small'
      },
      {
        location: {lat: 52.5, lng: 10},
        color: 'blue',
        label: 'H'
      },
      {
        location: 'Berlin, Germany',
        color: 'orange',
        icon: 'http://tinyurl.com/jrhlvu6',
        anchor: 'center',
        label: 'B',
        scale: 2
      },
      {
        location: 'Essen, Germany',
        color: 'purple'
      }
    ],
    visible: ['Germany']
  });

  return <StaticMap className="map" url={staticMapsUrl} />;
}
