import React from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

interface Props {
  apiKey?: string;
}

const App = (props: Props) => (
  <APIProvider apiKey={props.apiKey ?? API_KEY}>
    <Map
      zoom={3}
      center={{lat: 22.54992, lng: 0}}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    />
    <ControlPanel />
  </APIProvider>
);
export default App;

export function renderToDom(container: HTMLElement, props: Props) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App {...props} />
    </React.StrictMode>
  );
}
