import React from 'react';

interface GmpPlaceDetailsAttributes
  // @ts-expect-error PlaceDetailsCompactElement not in types yet
  extends React.HTMLAttributes<google.maps.places.PlaceDetailsCompactElement> {
  'truncation-preferred'?: boolean;
  orientation?: 'HORIZONTAL' | 'VERTICAL';
}

interface GmpPlaceSearchAttributes
  // @ts-expect-error PlaceSearchElement not in official types yet
  extends React.HTMLAttributes<google.maps.places.PlaceSearchElement> {
  selectable?: boolean;
  'truncation-preferred'?: boolean;
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
      'gmp-place-details-compact': React.DetailedHTMLProps<
        GmpPlaceDetailsAttributes,
        // @ts-expect-error PlaceDetailsCompactElement not in types yet
        google.maps.places.PlaceDetailsCompactElement
      >;

      'gmp-place-details-place-request': React.DetailedHTMLProps<
        // @ts-expect-error PlaceDetailsPlaceRequestElement not in types yet
        React.HTMLAttributes<google.maps.places.PlaceDetailsPlaceRequestElement> & {
          place: string;
        },
        // @ts-expect-error PlaceDetailsPlaceRequestElement not in types yet
        google.maps.places.PlaceDetailsPlaceRequestElement
      >;
      'gmp-place-all-content': React.DetailedHTMLProps<
        // @ts-expect-error PlaceAllContentElement not in types yet
        React.HTMLAttributes<google.maps.places.PlaceAllContentElement>,
        // @ts-expect-error PlaceAllContentElement not in types yet
        google.maps.places.PlaceAllContentElement
      >;
      'gmp-place-standard-content': React.DetailedHTMLProps<
        // @ts-expect-error PlaceAllContentElement not in types yet
        React.HTMLAttributes<google.maps.places.PlaceStandardContentElement>,
        // @ts-expect-error PlaceAllContentElement not in types yet
        google.maps.places.PlaceStandardContentElement
      >;
      'gmp-place-content-config': React.DetailedHTMLProps<
        // @ts-expect-error PlaceAllContentElement not in types yet
        React.HTMLAttributes<google.maps.places.PlaceContentConfigElement>,
        // @ts-expect-error PlaceAllContentElement not in types yet
        google.maps.places.PlaceContentConfigElement
      >;
      'gmp-place-rating': React.DetailedHTMLProps<
        // @ts-expect-error PlaceAllContentElement not in types yet
        React.HTMLAttributes<google.maps.places.PlaceRatingElement>,
        // @ts-expect-error PlaceAllContentElement not in types yet
        google.maps.places.PlaceRatingElement
      >;
      'gmp-place-type': React.DetailedHTMLProps<
        // @ts-expect-error PlaceAllContentElement not in types yet
        React.HTMLAttributes<google.maps.places.PlaceTypeElement>,
        // @ts-expect-error PlaceAllContentElement not in types yet
        google.maps.places.PlaceTypeElement
      >;
    }
  }
}
