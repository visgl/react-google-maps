import React, {useState, useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

import {PlaceListWebComponent} from './components/place-list-webcomponent';
import {PlaceDetailsMarker} from './components/place-details-marker';
import {SearchBar} from './components/search-bar';

import ControlPanel from './control-panel';

import './styles.css';

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

  // Memoize the place markers to prevent unnecessary re-renders
  // Only recreate when places, selection, or details size changes
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
    // APIProvider sets up the Google Maps JavaScript API with the specified key
    // Using 'alpha' version to access the latest features including UI Kit components
    <APIProvider apiKey={API_KEY} version="alpha">
      <div className="places-ui-kit">
        <div className="place-list-wrapper">
          {/* 
            PlaceListWebComponent displays a list of places based on:
            - The selected place type (restaurant, cafe, etc.)
            - The current map location and bounds
          */}
          <PlaceListWebComponent
            placeType={placeType}
            locationId={locationId}
            setPlaces={setPlaces}
            onPlaceSelect={place => setSelectedPlaceId(place?.id ?? null)}
          />
        </div>

        <div className="map-container">
          {/* 
            The Map component renders the Google Map
            Clicking on the map background will deselect any selected place
          */}
          <Map {...MAP_CONFIG} onClick={() => setSelectedPlaceId(null)}>
            {placeMarkers}
          </Map>

          {/* 
            SearchBar allows users to:
            - Select the type of place they want to find
            - Search for a specific location to center the map on
          */}
          <SearchBar
            placeType={placeType}
            setPlaceType={setPlaceType}
            setLocationId={setLocationId}
          />

          {/* 
            ControlPanel provides UI controls for adjusting the size of place details
            displayed in the InfoWindow
          */}
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

// Helper function to render the app into a DOM container
export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
