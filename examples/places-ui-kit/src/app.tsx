import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

import {PlaceListWebComponent} from './components/place-list-webcomponent';
import {PlaceDetailsMarker} from './components/place-details-marker';
import {AutocompleteWebComponent} from './components/autocomplete-webcomponent';

import ControlPanel from './control-panel';

import './styles.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => {
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [placeType, setPlaceType] = useState<string | null>('restaurant');

  return (
    <APIProvider apiKey={API_KEY} version="alpha">
      <div className="places-ui-kit">
        <div className="place-list-wrapper">
          <PlaceListWebComponent
            placeType={placeType}
            locationId={locationId}
            setPlaces={setPlaces}
            onPlaceSelect={place => {
              setSelectedPlaceId(place?.id ?? null);
            }}
          />
        </div>

        <div className="map-wrapper">
          <Map
            defaultZoom={15}
            defaultCenter={{lat: 53.55, lng: 9.99}}
            mapId={'49ae42fed52588c3'}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            onClick={() => setSelectedPlaceId(null)}>
            {places.map((place, index) => (
              <PlaceDetailsMarker
                key={index}
                selected={place.id === selectedPlaceId}
                place={place}
                onClick={() => {
                  setSelectedPlaceId(place.id);
                }}
              />
            ))}
          </Map>
          <div className="autocomplete-wrapper">
            <span>Find</span>
            <select
              value={placeType ?? ''}
              onChange={event => {
                setPlaceType(event.target.value);
              }}>
              <option value="restaurant">Restaurants</option>
              <option value="cafe">Cafes</option>
              <option value="bar">Bars</option>
            </select>
            <span>near</span>
            <AutocompleteWebComponent
              onPlaceSelect={place => {
                setLocationId(place?.id ?? null);
              }}
            />
          </div>
          <ControlPanel />
        </div>
      </div>
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
