import React, {memo} from 'react';
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
  return (
    <gmp-place-search
      className={props.useCustomStyling ? 'custom' : undefined}
      selectable
      truncation-preferred
      ongmp-load={({target}: {target: {places: google.maps.places.Place[]}}) =>
        props.setPlaces(target.places)
      }
      ongmp-select={({place}: {place: google.maps.places.Place}) => {
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
