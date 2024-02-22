import React from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider} from '@vis.gl/react-google-maps';

import DrawingExample from './drawing-example';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <DrawingExample />
    </APIProvider>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(<App />);
}
