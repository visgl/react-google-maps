import React, {useCallback} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

// Type definitions for the events emitted by the gmp-place-autocomplete component
interface GmpSelectEvent {
  placePrediction: {
    toPlace: () => google.maps.places.Place;
  };
}

interface GmpPlaceSelectEvent {
  place: google.maps.places.Place;
}

export const AutocompleteWebComponent = ({onPlaceSelect}: Props) => {
  // Load the places library to ensure the web component is available
  useMapsLibrary('places');

  const map = useMap();

  // Handle the selection of a place from the autocomplete component
  // This fetches additional place details and adjusts the map view
  const handlePlaceSelect = useCallback(
    async (place: google.maps.places.Place) => {
      try {
        // Fetch location and viewport data for the selected place
        await place.fetchFields({
          fields: ['location', 'viewport']
        });

        // If the place has a viewport (area boundaries), adjust the map to show it
        if (place?.viewport) {
          map?.fitBounds(place.viewport);
        }

        onPlaceSelect(place);
      } catch (error) {
        console.error('Error fetching place fields:', error);
        onPlaceSelect(null);
      }
    },
    [map, onPlaceSelect]
  );

  // Handle the gmp-select event (used in alpha and future stable versions)
  const handleGmpSelect = useCallback(
    (event: GmpSelectEvent) => {
      try {
        // Convert the place prediction to a full Place object
        void handlePlaceSelect(event.placePrediction.toPlace());
      } catch (error) {
        console.error('Error handling gmp-select event:', error);
        onPlaceSelect(null);
      }
    },
    [handlePlaceSelect, onPlaceSelect]
  );

  // Handle the gmp-placeselect event (deprecated but used in beta channel)
  const handleGmpPlaceSelect = useCallback(
    (event: GmpPlaceSelectEvent) => {
      void handlePlaceSelect(event.place);
    },
    [handlePlaceSelect]
  );

  // Note: This is a React 19 thing to be able to treat custom elements this way.
  //   In React before v19, you'd have to use a ref, or use the PlaceAutocompleteElement
  //   constructor instead.
  return (
    <div className="autocomplete-container">
      {/* 
        gmp-place-autocomplete is a Google Maps Web Component that provides a search box
        with automatic place suggestions as the user types.
        
        It supports two event types for backward compatibility:
        - ongmp-select: Used in alpha and future stable versions
        - ongmp-placeselect: Deprecated but still used in beta channel
      */}
      <gmp-place-autocomplete
        ongmp-select={handleGmpSelect as any}
        ongmp-placeselect={handleGmpPlaceSelect as any}
        aria-label="Search for a location"
      />
    </div>
  );
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-autocomplete': React.DetailedHTMLProps<
        React.HTMLAttributes<google.maps.places.PlaceAutocompleteElement>,
        google.maps.places.PlaceAutocompleteElement
      >;
    }
  }
}
