import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {BasicPlaceAutocomplete} from './components/basic-place-autocomplete';
import {NearbySearchOptions, PlaceSearch} from './components/place-search';

import ControlPanel from './control-panel';
import PlaceDetailsMarker from './place-details-marker';

import './styles.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

if (!API_KEY) {
  console.error('Missing Google Maps API key');
}

type PlaceType = 'restaurant' | 'cafe' | 'electric_vehicle_charging_station';

type PlaceTypeOption = {
  value: PlaceType;
  label: string;
};

export type DetailsSize = 'FULL' | 'COMPACT';
export type ColorScheme = 'light' | 'dark';

const MAP_CONFIG = {
  defaultZoom: 15,
  defaultCenter: {lat: 53.55, lng: 9.99},
  mapId: '49ae42fed52588c3',
  gestureHandling: 'greedy' as const,
  disableDefaultUI: true,
  clickableIcons: false
};

const App = () => {
  // APIProvider sets up the Google Maps JavaScript API with the specified key
  return (
    <APIProvider apiKey={API_KEY}>
      <Layout />
    </APIProvider>
  );
};

const Layout = () => {
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [detailsSize, setDetailsSize] = useState<DetailsSize>('FULL');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  const geoLib = useMapsLibrary('geometry');

  const map = useMap();

  const [nearbySearch, setNearbySearch] = useState<
    NearbySearchOptions | undefined
  >();

  const placeTypeOptions: PlaceTypeOption[] = useMemo(
    () => [
      {value: 'restaurant', label: 'Restaurants'},
      {value: 'cafe', label: 'Cafes'},
      {value: 'electric_vehicle_charging_station', label: 'EV Charging'}
    ],
    []
  );

  // Calculate a circular region based on the map's current bounds
  // This is used to restrict the places search to the visible map area
  const getContainingCircle = useCallback(
    (bounds?: google.maps.LatLngBounds): google.maps.CircleLiteral => {
      if (!bounds || !geoLib)
        return {center: MAP_CONFIG.defaultCenter, radius: 2800};

      // Calculate diameter between the northeast and southwest corners of the bounds
      const diameter = geoLib.spherical.computeDistanceBetween(
        bounds.getNorthEast(),
        bounds.getSouthWest()
      );
      const calculatedRadius = diameter / 2;

      // Cap the radius at 50km to avoid exceeding Google Maps API limits
      const cappedRadius = Math.min(calculatedRadius, 50000);
      return {center: bounds.getCenter(), radius: cappedRadius};
    },
    [geoLib]
  );

  const handlePlaceSelect = useCallback(
    async (place: google.maps.places.Place) => {
      try {
        // Fetch viewport data for the selected place
        await place.fetchFields({
          fields: ['viewport']
        });

        // If the place has a viewport (area boundaries), adjust the map to show it
        if (place?.viewport) {
          map?.fitBounds(place.viewport);
        }

        setLocationId(place.id);
      } catch (error) {
        console.error('Error fetching place fields:', error);
        setLocationId(null);
      }
    },
    [map, setLocationId]
  );

  // On location change via autocomplete update nearbysearch options for the place search component
  useEffect(() => {
    if (!geoLib || !map) {
      return;
    }
    const bounds = map.getBounds();
    const circle = getContainingCircle(bounds);

    if (!circle) return;

    setNearbySearch({
      locationRestriction: circle,
      includedPrimaryTypes: placeType ? [placeType] : undefined
    });
  }, [geoLib, map, placeType, getContainingCircle, locationId]);

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
    <div className="places-ui-kit" style={{colorScheme: colorScheme}}>
      <div className="place-list-wrapper">
        <div className="place-list-container">
          {/*
            The PlaceSearch component displays a list of places based on:
            - The selected place type (restaurant, cafe, etc.)
            - The current map location and bounds
          */}
          <PlaceSearch
            configPreset="standard"
            selectable
            truncationPreferred
            nearbySearch={nearbySearch}
            onLoad={e => setPlaces(e.target.places)}
            onSelect={e => setSelectedPlaceId(e.place?.id ?? null)}
          />
        </div>
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
        <div
          className="autocomplete-wrapper"
          role="search"
          aria-label="Location search">
          <label htmlFor="place-type-select">Find</label>
          <select
            id="place-type-select"
            value={placeType ?? ''}
            onChange={e => setPlaceType(e.target.value as PlaceType)}>
            {placeTypeOptions.map(option => (
              <option key={option.value} value={option.value || ''}>
                {option.label}
              </option>
            ))}
          </select>
          <span>near</span>
          <div className="autocomplete-container">
            {/*
              The BasicAutocomplete component allows users to search for a place and returns its place id
            */}
            <BasicPlaceAutocomplete
              onSelect={e => handlePlaceSelect(e.place)}
              style={{borderRadius: '1rem'}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3">
                <path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
              </svg>
            </BasicPlaceAutocomplete>
          </div>
        </div>

        {/*
            ControlPanel provides UI controls for adjusting the size of place details
            displayed in the InfoWindow
          */}
        <ControlPanel
          detailsSize={detailsSize}
          onDetailSizeChange={setDetailsSize}
          colorScheme={colorScheme}
          onColorSchemeChange={setColorScheme}
        />
      </div>
    </div>
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
