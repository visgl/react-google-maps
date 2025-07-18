import React, {useEffect, useRef, useCallback} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
  setPlaces: (markers: google.maps.places.Place[]) => void;
  locationId: string | null;
  placeType: string | null;
}

// Custom type definition for the Google Maps Web Components that aren't fully typed in the SDK
type PlaceSearchElement = HTMLElement & {
  readonly places: google.maps.places.Place[];
};

type PlaceNearbySearchRequestElement = HTMLElement & {
  locationRestriction: {center: google.maps.LatLng; radius: number};
  includedPrimaryTypes?: Array<string>;
  maxResultCount: number;
};

export const PlaceSearchWebComponent = ({
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
  const placeSearchRef = useRef<PlaceSearchElement | null>(null);
  const placeNearbySearchRequestRef =
    useRef<PlaceNearbySearchRequestElement | null>(null);

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
    if (
      !placesLib ||
      !geoLib ||
      !placeSearchRef.current ||
      !placeNearbySearchRequestRef.current ||
      !map
    ) {
      return;
    }

    const placeNearbySearchRequest = placeNearbySearchRequestRef.current;

    const bounds = map.getBounds();
    const circle = getContainingCircle(bounds);

    if (!circle) return;

    placeNearbySearchRequest.locationRestriction = circle;
    placeNearbySearchRequest.includedPrimaryTypes = placeType
      ? [placeType]
      : undefined;
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
      <gmp-place-search
        selectable
        truncation-preferred
        ref={placeSearchRef}
        ongmp-select={(event: {place: google.maps.places.Place | null}) => {
          onPlaceSelect(event.place);
        }}
        ongmp-load={(event: {target: PlaceSearchElement}) => {
          setPlaces(event.target.places);
        }}>
        <gmp-place-nearby-search-request
          ref={placeNearbySearchRequestRef}></gmp-place-nearby-search-request>
        <gmp-place-all-content></gmp-place-all-content>
      </gmp-place-search>
    </div>
  );
};

/**
 * Augments the React JSX namespace to add type definitions for the
 * Places UI Kit  web components. This provides
 * type-checking and autocompletion for their props, including custom
 * events, within JSX.
 */
interface GmpPlaceSearchAttributes
  // @ts-expect-error PlaceSearchElement not in official types yet
  extends React.HTMLAttributes<google.maps.places.PlaceSearchElement> {
  selectable?: boolean;
  'truncation-preferred'?: boolean;
  orientation?: 'HORIZONTAL' | 'VERTICAL';
}
interface GmpPlaceNearbySearchRequestAttributes
  // @ts-expect-error PlaceSearchElement not in official types yet
  extends React.HTMLAttributes<google.maps.places.PlaceNearbySearchRequestElement> {
  'location-restriction'?: string;
  'included-primary-types'?: string;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-search': React.DetailedHTMLProps<
        GmpPlaceSearchAttributes,
        // @ts-expect-error PlaceSearchElement not in official types yet
        google.maps.places.PlaceSearchElement
      >;
      'gmp-place-nearby-search-request': React.DetailedHTMLProps<
        GmpPlaceNearbySearchRequestAttributes,
        // @ts-expect-error TODO not in official types yet
        google.maps.places.PlaceNearbySearchRequestElement
      >;
    }
  }
}
