import React, {useState, useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

import {PlaceListWebComponent} from './components/place-list-webcomponent';
import {PlaceDetailsMarker} from './components/place-details-marker';

import ControlPanel from './control-panel';

import './styles.css';
import SearchBar from './components/search-bar';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

if (!API_KEY) {
  console.error('Missing Google Maps API key');
}

export type PlaceType =
  | 'restaurant'
  | 'cafe'
  | 'electric_vehicle_charging_station'
  | null;

export type DetailsSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'X_LARGE';

const MAP_CONFIG = {
  defaultZoom: 15,
  defaultCenter: {lat: 53.55, lng: 9.99},
  mapId: '49ae42fed52588c3',
  gestureHandling: 'greedy' as const,
  disableDefaultUI: true
};

const App = () => {
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [detailsSize, setDetailsSize] = useState<DetailsSize>('MEDIUM');

  const placeMarkers = useMemo(() => {
    return places.map((place, index) => (
      <PlaceDetailsMarker
        detailsSize={detailsSize}
        key={place.id || index}
        selected={place.id === selectedPlaceId}
        place={place}
        onClick={() => setSelectedPlaceId(place.id)}
      />
    ));
  }, [places, selectedPlaceId, detailsSize]);

  return (
    <APIProvider apiKey={API_KEY} version="alpha">
      <div className="places-ui-kit">
        <div className="place-list-wrapper">
          <PlaceListWebComponent
            placeType={placeType}
            locationId={locationId}
            setPlaces={setPlaces}
            onPlaceSelect={place => setSelectedPlaceId(place?.id ?? null)}
          />
        </div>

        <div className="map-container">
          <Map {...MAP_CONFIG} onClick={() => setSelectedPlaceId(null)}>
            {placeMarkers}
          </Map>

          <SearchBar
            placeType={placeType}
            setPlaceType={setPlaceType}
            setLocationId={setLocationId}
          />

          <ControlPanel
            detailsSize={detailsSize}
            onDetailSizeChange={setDetailsSize}
          />
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
