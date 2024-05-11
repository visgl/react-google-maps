// NOTE: This requires the alpha version of the Maps JavaScript API and is not yet
// recommended to be used in production applications. We will add this to the example map
// when it reaches GA (General Availability). Treat this as a preview of what's to come.

import React, {useRef, useEffect, useState} from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

// This is an example of the new "PlaceAutocomplete" widget.
// https://developers.google.com/maps/documentation/javascript/place-autocomplete-new
export const PlaceAutocompleteNew = ({onPlaceSelect}: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<Node | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places) return;
    // @ts-expect-error Using an alpha feature here. The types are not up to date yet
    setPlaceAutocomplete(new places.PlaceAutocompleteElement());
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addEventListener(
      'gmp-placeselect',
      // @ts-expect-error This new event has no types yet
      async ({place}: {place: google.maps.places.Place}) => {
        await place.fetchFields({
          fields: ['displayName', 'formattedAddress', 'location', 'viewport']
        });

        onPlaceSelect(place.toJSON());
      }
    );

    containerRef.current?.appendChild(placeAutocomplete);
  }, [onPlaceSelect, placeAutocomplete]);

  return <div className="autocomplete-container" ref={containerRef} />;
};
