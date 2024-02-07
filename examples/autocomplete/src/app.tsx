import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, ControlPosition, Map} from '@vis.gl/react-google-maps';

import ControlPanel from './control-panel';
import {CustomMapControl} from './map-control';
import MapHandler from './map-handler';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

export type AutocompleteMode = {id: string; label: string};

const autocompleteModes: Array<AutocompleteMode> = [
  {id: 'classic', label: 'Google Autocomplete Widget'},
  {id: 'custom', label: 'Custom Build'},
  {id: 'custom-hybrid', label: 'Custom w/ Select Widget'}
];

const App = () => {
  const [selectedAutocompleteMode, setSelectedAutocompleteMode] =
    useState<AutocompleteMode>(autocompleteModes[0]);

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        zoom={3}
        center={{lat: 22.54992, lng: 0}}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      />

      <CustomMapControl
        controlPosition={ControlPosition.TOP}
        selectedAutocompleteMode={selectedAutocompleteMode}
        onPlaceSelect={setSelectedPlace}
      />

      <ControlPanel
        autocompleteModes={autocompleteModes}
        selectedAutocompleteMode={selectedAutocompleteMode}
        onAutocompleteModeChange={setSelectedAutocompleteMode}
      />

      <MapHandler place={selectedPlace} />
    </APIProvider>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(<App />);
}
