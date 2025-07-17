import React, {useCallback, memo} from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

import {DetailsSize} from '../app';

interface PlaceDetailsMarkerProps {
  place: google.maps.places.Place;
  selected: boolean;
  onClick: (placeId: string | null) => void;
  detailsSize: DetailsSize;
}

export const PlaceDetailsMarker = memo(
  ({place, selected, onClick, detailsSize}: PlaceDetailsMarkerProps) => {
    const [markerRef, marker] = useAdvancedMarkerRef();

    // Load required Google Maps library for places
    useMapsLibrary('places');

    // Handle marker click to select this place
    const handleMarkerClick = useCallback(() => {
      onClick(place.id);
    }, [onClick, place.id]);

    // Handle info window close by deselecting this place
    const handleCloseClick = useCallback(() => {
      onClick(null);
    }, [onClick]);

    return (
      <>
        <AdvancedMarker
          ref={markerRef}
          position={place.location}
          onClick={handleMarkerClick}
        />
        {selected && (
          <InfoWindow
            anchor={marker}
            onCloseClick={handleCloseClick}
            minWidth={250}
            maxWidth={400}
            headerDisabled={true}>
            {/* 
             gmp-place-details is a Google Maps Web Component that displays detailed information
             about a place, including photos, reviews, open hours, etc.
             The size parameter controls how much information is displayed.
             
             
             gmp-place-details-compact is a Google Maps Web Component that displays a lot of the same
             information as the full version but in a more compact format.
           */}
            {detailsSize === 'FULL' ? (
              <gmp-place-details>
                <gmp-place-details-place-request
                  place={place?.id ?? ''}></gmp-place-details-place-request>
                <gmp-place-all-content></gmp-place-all-content>
              </gmp-place-details>
            ) : (
              <gmp-place-details-compact>
                <gmp-place-details-place-request
                  place={place?.id ?? ''}></gmp-place-details-place-request>
                <gmp-place-all-content></gmp-place-all-content>
              </gmp-place-details-compact>
            )}
          </InfoWindow>
        )}
      </>
    );
  }
);

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-details': React.DetailedHTMLProps<
        // @ts-expect-error PlaceDetailsElement not in types yet
        React.HTMLAttributes<google.maps.places.PlaceDetailsElement> & {
          size?: any;
        },
        // @ts-expect-error PlaceDetailsElement not in types yet
        google.maps.places.PlaceDetailsElement
      >;
      'gmp-place-details-compact': React.DetailedHTMLProps<
        // @ts-expect-error PlaceDetailsCompactElement not in types yet
        React.HTMLAttributes<google.maps.places.PlaceDetailsCompactElement> & {
          size?: any;
        },
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
    }
  }
}
