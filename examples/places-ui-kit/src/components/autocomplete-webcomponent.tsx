import React, {useCallback} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

// Type definitions for the events
interface GmpSelectEvent {
  placePrediction: {
    toPlace: () => google.maps.places.Place;
  };
}

interface GmpPlaceSelectEvent {
  place: google.maps.places.Place;
}

export const AutocompleteWebComponent = ({onPlaceSelect}: Props) => {
  // make sure the `<gmp-place-autocomplete>` component gets loaded
  useMapsLibrary('places');
  const map = useMap();

  const handlePlaceSelect = useCallback(
    async (place: google.maps.places.Place) => {
      try {
        await place.fetchFields({
          fields: ['location', 'viewport']
        });

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

  const handleGmpSelect = useCallback(
    (event: GmpSelectEvent) => {
      try {
        void handlePlaceSelect(event.placePrediction.toPlace());
      } catch (error) {
        console.error('Error handling gmp-select event:', error);
        onPlaceSelect(null);
      }
    },
    [handlePlaceSelect, onPlaceSelect]
  );

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
      {/* the `gmp-select` event is used in the alpha and future stable version,
            `gmp-placeselect` is deprecated but still used in the beta channel */}
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
