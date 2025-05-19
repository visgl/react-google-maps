import React, {useCallback} from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

export const PlaceDetailsMarker = ({place, selected, onClick}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const placesLib = useMapsLibrary('places');
  const elevationLib = useMapsLibrary('elevation');

  const handleClose = useCallback(() => onClick(null), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={place.location}
        onClick={() => {
          onClick(place.id);
        }}
      />
      {selected && (
        <InfoWindow
          anchor={marker}
          onCloseClick={handleClose}
          minWidth={250}
          maxWidth={400}
          headerDisabled={true}>
          <gmp-place-details
            // @ts-expect-error PlaceDetailsSize not in types yet
            size={placesLib?.PlaceDetailsSize.MEDIUM}
            ref={placeDetailsElement => {
              if (!placesLib || !placeDetailsElement) return;

              placeDetailsElement.configureFromPlace(place);
            }}></gmp-place-details>

          <br />
          <gmp-elevation
            ref={elevationElement => {
              if (!elevationLib || !elevationElement) return;

              elevationElement.path = [
                {lat: place.location.lat(), lng: place.location.lng()}
              ];
            }}
            unit-system="metric"></gmp-elevation>
        </InfoWindow>
      )}
    </>
  );
};

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
