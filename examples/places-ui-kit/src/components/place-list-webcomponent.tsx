import React, {useEffect, useRef} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
  setPlaces: (markers: google.maps.places.Place[]) => void;
  locationId: string | null;
  placeType: string | null;
}

export const PlaceListWebComponent = ({
  onPlaceSelect,
  setPlaces,
  locationId,
  placeType
}: Props) => {
  // make sure the `<gmp-place-list>` component gets loaded
  const placesLib = useMapsLibrary('places');
  const geoLib = useMapsLibrary('geometry');

  const map = useMap();

  const placeListRef = useRef<any>(null);

  useEffect(() => {
    if (!placesLib || !geoLib || !placeListRef.current || !map) {
      return;
    }

    const getContainingCircle = (bounds?: google.maps.LatLngBounds) => {
      if (!bounds || !geoLib) return;

      const diameter = geoLib.spherical.computeDistanceBetween(
        bounds.getNorthEast(),
        bounds.getSouthWest()
      );
      const calculatedRadius = diameter / 2;
      const cappedRadius = Math.min(calculatedRadius, 50000); // Cap the radius to avoid an error.
      return {center: bounds.getCenter(), radius: cappedRadius};
    };

    placeListRef.current
      .configureFromSearchNearbyRequest({
        locationRestriction: getContainingCircle(map.getBounds()),
        includedPrimaryTypes: [placeType]
      })
      .then(() => {
        setPlaces(placeListRef.current.places);
      });
  }, [placesLib, geoLib, map, locationId, placeType]);

  // Note: This is a React 19 thing to be able to treat custom elements this way.
  //   In React before v19, you'd have to use a ref, or use the PlaceAutocompleteElement
  //   constructor instead.
  return (
    <div className="place-list-container">
      <gmp-place-list
        selectable
        ref={placeListRef}
        ongmp-placeselect={(ev: {place: google.maps.places.Place | null}) => {
          onPlaceSelect(ev.place);
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
