import React from 'react';
import {memo} from 'react';
import {PlaceSearch} from '../place-search/place-search';
import {PlaceDetails} from '../place-details/place-details';
import {Dropdown} from '../dropdown/dropdown';

import './overlay.css';
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import {PlaceLocationWithId, PlaceType} from '../../app';

type OverlayProps = {
  place: string;
  placeType: string;
  useCustomStyling: boolean;
  onPlaceSelect: (place: PlaceLocationWithId | null) => void;
  onPlaceTypeSelect: (placeType: PlaceType) => void;
  setPlaces: (places: google.maps.places.Place[]) => void;
};

const OverlayComponent = (props: OverlayProps) => {
  useMapsLibrary('places');

  return (
    <div className="overlay">
      <div className="overlay-header">
        <PlaceDetails
          place={props.place}
          useStandardContent={false}
          useCustomStyling={props.useCustomStyling}
        />
        <Dropdown
          placeType={props.placeType}
          onPlaceTypeSelect={props.onPlaceTypeSelect}
        />
      </div>
      <PlaceSearch
        placeType={props.placeType}
        maxResultCount={5}
        location="1500@21.276549799999998,-157.8266319"
        onPlaceSelect={props.onPlaceSelect}
        setPlaces={props.setPlaces}
        useCustomStyling={props.useCustomStyling}
      />
    </div>
  );
};
OverlayComponent.displayName = 'Overlay';

export const Overlay = memo(OverlayComponent);
