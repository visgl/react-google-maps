import React, {useEffect, useRef, useCallback} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
  setPlaces: (markers: google.maps.places.Place[]) => void;
  locationId: string | null;
  placeType: string | null;
}

// Custom type definition for the Google Maps Web Component that isn't fully typed in the SDK
type PlaceListElement = HTMLElement & {
  configureFromSearchNearbyRequest: (request: {
    locationRestriction?: {center: google.maps.LatLng; radius: number};
    includedPrimaryTypes?: string[];
  }) => Promise<void>;
  readonly places: google.maps.places.Place[];
};

export const PlaceListWebComponent = ({
  onPlaceSelect,
  setPlaces,
  locationId,
  placeType
}: Props) => {
  // Load required Google Maps libraries
  const placesLib = useMapsLibrary('places');
  const geoLib = useMapsLibrary('geometry');

  const map = useMap();

  // Use ref to interact with the DOM Web Component
  const placeListRef = useRef<PlaceListElement | null>(null);

  // Calculate a circular region based on the map's current bounds
  // This is used to restrict the places search to the visible map area
  const getContainingCircle = useCallback(
    (bounds?: google.maps.LatLngBounds) => {
      if (!bounds || !geoLib) return undefined;

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

  useEffect(() => {
    if (!placesLib || !geoLib || !placeListRef.current || !map) {
      return;
    }

    const placeList = placeListRef.current;
    const bounds = map.getBounds();
    const circle = getContainingCircle(bounds);

    if (!circle) return;

    // Configure the place list web component with the search parameters
    // This triggers a nearby search using the Google Maps Places API
    placeList
      .configureFromSearchNearbyRequest({
        locationRestriction: circle,
        includedPrimaryTypes: placeType ? [placeType] : undefined
      })
      .then(() => {
        // Update the parent component with the places received from the web component
        setPlaces(placeList.places);
      })
      .catch(error => {
        console.error('Error configuring place list:', error);
      });
  }, [placesLib, geoLib, map, placeType, getContainingCircle, locationId]);

  // Return the Google Maps Place List Web Component
  // This component is rendered as a custom HTML element (Web Component) provided by Google
  return (
    <div className="place-list-container">
      {/* 
        gmp-place-list is a Google Maps Platform Web Component that displays a list of places
        - 'selectable' enables click-to-select functionality
        - When a place is selected, the ongmp-placeselect event is fired
      */}
      <gmp-place-list
        selectable
        ref={placeListRef}
        ongmp-placeselect={(event: {
          place: google.maps.places.Place | null;
        }) => {
          onPlaceSelect(event.place);
        }}
      />
    </div>
  );
};

declare module 'react' {
  namespace JSX {
    interface GmpPlaceListAttributes
      // @ts-expect-error PlaceListElement not in official types yet
      extends React.HTMLAttributes<google.maps.places.PlaceListElement> {
      selectable?: boolean;
    }
    interface IntrinsicElements {
      'gmp-place-list': React.DetailedHTMLProps<
        GmpPlaceListAttributes,
        // @ts-expect-error PlaceListElement not in official types yet
        google.maps.places.PlaceListElement
      >;
    }
  }
}
