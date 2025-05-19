import React from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

export const AutocompleteWebComponent = ({onPlaceSelect}: Props) => {
  // make sure the `<gmp-place-autocomplete>` component gets loaded
  useMapsLibrary('places');
  const map = useMap();

  async function handlePlaceSelect(place: google.maps.places.Place) {
    await place.fetchFields({
      fields: ['displayName', 'formattedAddress', 'location', 'viewport']
    });

    if (place?.viewport) {
      map?.fitBounds(place.viewport);
    }

    onPlaceSelect(place);
  }

  // Note: This is a React 19 thing to be able to treat custom elements this way.
  //   In React before v19, you'd have to use a ref, or use the PlaceAutocompleteElement
  //   constructor instead.
  return (
    <div className="autocomplete-container">
      {/* the `gmp-select` event is used in the alpha and future stable version,
            `gmp-placeselect` is deprecated but still used in the beta channel */}
      <gmp-place-autocomplete
        ongmp-select={(ev: any) =>
          void handlePlaceSelect(ev.placePrediction.toPlace())
        }
        ongmp-placeselect={(ev: any) => void handlePlaceSelect(ev.place)}
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
