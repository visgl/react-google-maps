import React, {useCallback} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

interface GmpSelectEvent {
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

  // Handle the gmp-select event, which returns a Place object, that contains only a place ID
  const handleGmpSelect = useCallback(
    (event: GmpSelectEvent) => {
      void handlePlaceSelect(event.place);
    },
    [handlePlaceSelect]
  );

  // Note: This is a React 19 thing to be able to treat custom elements this way.
  //   In React before v19, you'd have to use a ref, or use the BasicPlaceAutocompleteElement
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
      <gmp-basic-place-autocomplete
        ongmp-select={handleGmpSelect}
        aria-label="Search for a location"
      />
    </div>
  );
};

/**
 * Augments the React JSX namespace to add type definitions for the
 * Places UI Kit  web components. This provides
 * type-checking and autocompletion for their props, including custom
 * events, within JSX.
 */
interface GmpBasicPlaceAutocomplete
  // @ts-expect-error BasicPlaceAutocompleteElement not in official types yet
  extends React.HTMLAttributes<google.maps.places.BasicPlaceAutocompleteElement> {
  'ongmp-select': (event: GmpSelectEvent) => void;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-basic-place-autocomplete': React.DetailedHTMLProps<
        GmpBasicPlaceAutocomplete,
        // @ts-expect-error BasicPlaceAutocompleteElement not in official types yet
        google.maps.places.BasicPlaceAutocompleteElement
      >;
    }
  }
}
