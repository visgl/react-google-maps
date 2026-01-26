import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import React, {memo, useCallback} from 'react';

import {DetailsSize} from './app';
import {PlaceDetails} from './components/place-details';

interface PlaceDetailsMarkerProps {
  place: google.maps.places.Place;
  selected: boolean;
  onClick: (placeId: string | null) => void;
  detailsSize: DetailsSize;
}

const PlaceDetailsMarkerComponent = ({
  place,
  selected,
  onClick,
  detailsSize
}: PlaceDetailsMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  // Handle marker click to select this place
  const handleMarkerClick = useCallback(() => {
    onClick(place.id);
  }, [onClick, place.id]);

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
          minWidth={250}
          maxWidth={400}
          headerDisabled={true}>
          {/*
            Using the place details component here to specifically have access to the map
           */}
          <PlaceDetails
            compact={detailsSize === 'COMPACT'}
            truncationPreferred
            contentConfig="custom"
            orientation={google.maps.places.PlaceDetailsOrientation.HORIZONTAL}
            customContent={[
              {
                attribute: 'media',
                options: {preferredSize: 'MEDIUM', lightboxPreferred: true}
              },
              {attribute: 'address'},
              {attribute: 'open-now-status'},
              {attribute: 'rating'},
              {attribute: 'price'},
              {attribute: 'reviews'},
              {attribute: 'summary'},
              {attribute: 'website'},
              {
                attribute: 'attribution',
                options: {
                  lightSchemeColor: google.maps.places.AttributionColor.BLACK,
                  darkSchemeColor: google.maps.places.AttributionColor.GRAY
                }
              }
            ]}
            placeId={place.id}
          />
        </InfoWindow>
      )}
    </>
  );
};

PlaceDetailsMarkerComponent.displayName = 'PlaceDetailsMarker';

export default memo(PlaceDetailsMarkerComponent);
