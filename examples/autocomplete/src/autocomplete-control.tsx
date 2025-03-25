import React from 'react';
import {ControlPosition, MapControl} from '@vis.gl/react-google-maps';

import {AutocompleteCustom} from './components/autocomplete-custom';
import {AutocompleteCustomHybrid} from './components/autocomplete-custom-hybrid';
import {AutocompleteWebComponent} from './components/autocomplete-webcomponent';

import type {AutocompleteMode} from './app';

type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  selectedImplementation: AutocompleteMode;
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
};

const AutocompleteControl = ({
  controlPosition,
  selectedImplementation,
  onPlaceSelect
}: CustomAutocompleteControlProps) => {
  const {id} = selectedImplementation;

  return (
    <MapControl position={controlPosition}>
      <div className="autocomplete-control">
        {id === 'custom' && (
          <AutocompleteCustom onPlaceSelect={onPlaceSelect} />
        )}

        {id === 'custom-hybrid' && (
          <AutocompleteCustomHybrid onPlaceSelect={onPlaceSelect} />
        )}

        {id === 'webcomponent' && (
          <AutocompleteWebComponent onPlaceSelect={onPlaceSelect} />
        )}
      </div>
    </MapControl>
  );
};

export default React.memo(AutocompleteControl);
