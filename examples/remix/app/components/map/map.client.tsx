import {APIProvider, Map} from '@vis.gl/react-google-maps';

import styles from './map.module.css';

export default function MyMap() {
  const API_KEY =
    (process.env.GOOGLE_MAPS_API_KEY as string) ??
    globalThis.GOOGLE_MAPS_API_KEY;

  return (
    <div className={styles.container}>
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId={'bf51a910020fa25a'}
          defaultZoom={5}
          defaultCenter={{lat: 53, lng: 10}}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        />
      </APIProvider>
    </div>
  );
}
