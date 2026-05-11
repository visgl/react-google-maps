import React from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

export const AutocompleteWebComponent = ({onPlaceSelect}: Props) => {
  // make sure the `<gmp-place-autocomplete>` component gets loaded
  useMapsLibrary('places');

  async function handlePlaceSelect(place: google.maps.places.Place) {
    await place.fetchFields({
      fields: ['displayName', 'formattedAddress', 'location', 'viewport']
    });

    onPlaceSelect(place);
  }

  // Note: This is a React 19 thing to be able to treat custom elements this way.
  //   In React before v19, you'd have to use a ref, or use the PlaceAutocompleteElement
  //   constructor instead.
  return (
    <div className="autocomplete-container">
      <gmp-place-autocomplete
        ongmp-select={(event: google.maps.places.PlacePredictionSelectEvent) =>
          void handlePlaceSelect(event.placePrediction.toPlace())
        }
      />
    </div>
  );
};
