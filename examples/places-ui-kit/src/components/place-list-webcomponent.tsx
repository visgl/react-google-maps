import React, {useEffect, useRef, useCallback} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
  setPlaces: (markers: google.maps.places.Place[]) => void;
  locationId: string | null;
  placeType: string | null;
}

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
  // make sure the `<gmp-place-list>` component gets loaded
  const placesLib = useMapsLibrary('places');
  const geoLib = useMapsLibrary('geometry');

  const map = useMap();

  const placeListRef = useRef<PlaceListElement | null>(null);

  const getContainingCircle = useCallback(
    (bounds?: google.maps.LatLngBounds) => {
      if (!bounds || !geoLib) return undefined;

      const diameter = geoLib.spherical.computeDistanceBetween(
        bounds.getNorthEast(),
        bounds.getSouthWest()
      );
      const calculatedRadius = diameter / 2;
      const cappedRadius = Math.min(calculatedRadius, 50000); // Cap the radius to avoid an error.
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

    placeList
      .configureFromSearchNearbyRequest({
        locationRestriction: circle,
        includedPrimaryTypes: placeType ? [placeType] : undefined
      })
      .then(() => {
        setPlaces(placeList.places);
      })
      .catch(error => {
        console.error('Error configuring place list:', error);
      });
  }, [placesLib, geoLib, map, placeType, getContainingCircle, locationId]);

  // Note: This is a React 19 thing to be able to treat custom elements this way.
  //   In React before v19, you'd have to use a ref, or use the PlaceListElement
  //   constructor instead.
  return (
    <div className="place-list-container">
      {/* https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-list */}
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
