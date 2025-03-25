import React, {useState, useCallback, useMemo} from 'react';
import {useAutocompleteSuggestions} from '../hooks/use-autocomplete-suggestions';
import Combobox from 'react-widgets/Combobox';

import 'react-widgets/styles.css';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

// This uses the Combobox from "react-widgets" (https://jquense.github.io/react-widgets/docs/Combobox)
export const AutocompleteCustomHybrid = ({onPlaceSelect}: Props) => {
  const [inputValue, setInputValue] = useState<string>('');

  const {suggestions, resetSession, isLoading} =
    useAutocompleteSuggestions(inputValue);

  const handleInputChange = useCallback(
    (value: google.maps.places.PlacePrediction | string) => {
      if (typeof value === 'string') {
        setInputValue(value);
      }
    },
    []
  );

  const handleSelect = useCallback(
    (prediction: google.maps.places.PlacePrediction | string) => {
      if (typeof prediction === 'string') return;

      const place = prediction.toPlace();
      place
        .fetchFields({
          fields: [
            'viewport',
            'location',
            'svgIconMaskURI',
            'iconBackgroundColor'
          ]
        })
        .then(() => {
          resetSession();
          onPlaceSelect(place);
          setInputValue('');
        });
    },
    [onPlaceSelect]
  );

  const predictions = useMemo(
    () =>
      suggestions
        .filter(suggestion => suggestion.placePrediction)
        .map(({placePrediction}) => placePrediction!),
    [suggestions]
  );

  return (
    <div className="autocomplete-container">
      <Combobox
        placeholder="Search for a place"
        data={predictions}
        dataKey="placeId"
        textField="text"
        value={inputValue}
        onChange={handleInputChange}
        onSelect={handleSelect}
        busy={isLoading}
        // Since the Autocomplete Service API already returns filtered results
        // always want to display them all.
        filter={() => true}
        focusFirstItem={true}
        hideEmptyPopup
        hideCaret
      />
    </div>
  );
};
