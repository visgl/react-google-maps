import React, {useCallback, memo} from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

import {DetailsSize} from '../app';

// Define proper types for props
interface PlaceDetailsMarkerProps {
  place: google.maps.places.Place;
  selected: boolean;
  onClick: (placeId: string | null) => void;
  detailsSize: DetailsSize;
}

export const PlaceDetailsMarker = memo(
  ({place, selected, onClick, detailsSize}: PlaceDetailsMarkerProps) => {
    const [markerRef, marker] = useAdvancedMarkerRef();

    useMapsLibrary('places');
    useMapsLibrary('elevation');

    const handleMarkerClick = useCallback(() => {
      onClick(place.id);
    }, [onClick, place.id]);

    const handleCloseClick = useCallback(() => {
      onClick(null);
    }, [onClick]);

    const handlePlaceDetailsRef = useCallback(
      (placeDetailsElement: any) => {
        if (!placeDetailsElement) return;

        try {
          placeDetailsElement.configureFromPlace(place);
        } catch (error) {
          console.error('Error configuring place details:', error);
        }
      },
      [place]
    );

    const handleElevationRef = useCallback(
      (elevationElement: any) => {
        if (!elevationElement) return;

        try {
          const {lat, lng} = place.location?.toJSON() ?? {};
          elevationElement.path = [{lat, lng}];
        } catch (error) {
          console.error('Error setting elevation path:', error);
        }
      },
      [place.location]
    );

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
            {/* https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-details#place-details-element-experimental */}
            <gmp-place-details size={detailsSize} ref={handlePlaceDetailsRef} />

            <br />
            {/* https://developers.google.com/maps/documentation/javascript/places-ui-kit/elevation */}
            <gmp-elevation ref={handleElevationRef} unit-system="metric" />
          </InfoWindow>
        )}
      </>
    );
  }
);

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-elevation': React.DetailedHTMLProps<
        // @ts-expect-error ElevationElement not in types yet
        React.HTMLAttributes<google.maps.places.ElevationElement>,
        // @ts-expect-error ElevationElement not in types yet
        google.maps.places.ElevationElement
      >;
      'gmp-place-details': React.DetailedHTMLProps<
        // @ts-expect-error PlaceDetailsElement not in types yet
        React.HTMLAttributes<google.maps.places.PlaceDetailsElement> & {
          size?: any;
        },
        // @ts-expect-error PlaceDetailsElement not in types yet
        google.maps.places.PlaceDetailsElement
      >;
    }
  }
}
