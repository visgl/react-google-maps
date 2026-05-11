import React, {memo, useRef} from 'react';
import {PlaceLocationWithId} from '../../app';

type PlaceSearchProps = {
  location: string;
  placeType: string;
  maxResultCount: number;
  useCustomStyling: boolean;
  onPlaceSelect: (place: PlaceLocationWithId | null) => void;
  setPlaces: (places: google.maps.places.Place[]) => void;
};

const PlaceSearchComponent = (props: PlaceSearchProps) => {
  const searchRef = useRef<google.maps.places.PlaceSearchElement | null>(null);

  return (
    <gmp-place-search
      ref={searchRef}
      className={props.useCustomStyling ? 'custom' : undefined}
      selectable
      truncation-preferred
      ongmp-load={() => props.setPlaces(searchRef.current?.places ?? [])}
      ongmp-select={(event: google.maps.places.PlaceSelectEvent) => {
        const place = event.place;

        props.onPlaceSelect({
          id: place.id,
          location: {...place.location!.toJSON(), altitude: 0}
        });
      }}>
      <gmp-place-content-config>
        <gmp-place-rating></gmp-place-rating>
        <gmp-place-type></gmp-place-type>
      </gmp-place-content-config>
      <gmp-place-nearby-search-request
        location-restriction={props.location}
        included-primary-types={props.placeType}
        max-result-count={
          props.maxResultCount
        }></gmp-place-nearby-search-request>
    </gmp-place-search>
  );
};
PlaceSearchComponent.displayName = 'PlaceSearch';

export const PlaceSearch = memo(PlaceSearchComponent);
