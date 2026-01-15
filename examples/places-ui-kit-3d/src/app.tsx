import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

import {Map3D} from './components/map-3d/map-3d';
import {Overlay} from './components/overlay/overlay';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

if (!API_KEY) {
  console.error('Missing Google Maps API key');
}

export type PlaceType =
  | 'restaurant'
  | 'coffee_shop'
  | 'tourist_attraction'
  | 'park';

export type PlaceLocationWithId = {
  location: google.maps.LatLngAltitudeLiteral | google.maps.LatLngLiteral;
  id: string;
};

const REFERENCE_PLACE_ID = 'ChIJzyVahnZyAHwRSexvrM_P95g';

export const REFERENCE_PLACE = {
  location: {lat: 21.276549799999998, lng: -157.8266319, altitude: 0},
  id: 'ChIJzyVahnZyAHwRSexvrM_P95g'
};

const INITIAL_VIEW_PROPS = {
  center: {lat: 21.276549799999998, lng: -157.8266319, altitude: 0},
  range: 2500,
  heading: 38,
  tilt: 70
};

const App = () => {
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceLocationWithId | null>(REFERENCE_PLACE);
  const [useCustomStyling, setUseCustomStyling] = useState<boolean>(true);

  return (
    <APIProvider apiKey={API_KEY} version={'beta'}>
      <Map3D
        {...INITIAL_VIEW_PROPS}
        defaultLabelsDisabled
        handleClick={setSelectedPlace}
        selectedPlace={selectedPlace}
        useCustomStyling={useCustomStyling}
        places={places}
        setPlaces={setPlaces}
      />
      <Overlay
        place={REFERENCE_PLACE_ID}
        placeType={placeType}
        onPlaceSelect={place => setSelectedPlace(place ?? null)}
        onPlaceTypeSelect={placeType => {
          setSelectedPlace(null);
          setPlaceType(placeType);
        }}
        useCustomStyling={useCustomStyling}
        setPlaces={setPlaces}
      />
      <ControlPanel
        useCustomStyling={useCustomStyling}
        setUseCustomStyling={setUseCustomStyling}
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
