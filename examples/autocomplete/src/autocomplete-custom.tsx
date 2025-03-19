import React, {useEffect, useState, useCallback, FormEvent} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

// This is a custom built autocomplete component using the "Autocomplete Service" for predictions
// and the "Places Service" for place details
export const AutocompleteCustom = ({onPlaceSelect}: Props) => {
  const map = useMap();
  const places = useMapsLibrary('places');

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSessionToken
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  // https://developers.google.com/maps/documentation/javascript/reference/places-service
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    Array<google.maps.places.AutocompleteSuggestion>
  >([]);

  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (!places || !map) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [map, places]);

  const fetchPredictions = useCallback(
    async (inputValue: string) => {
      if (!places || !inputValue) {
        setAutocompleteSuggestions([]);
        return;
      }

      const request = {input: inputValue, sessionToken};
      const { suggestions } =
        await places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
          request,
        );

      setAutocompleteSuggestions(suggestions);
    },
    [places, sessionToken]
  );

  const onInputChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const value = (event.target as HTMLInputElement)?.value;

      setInputValue(value);
      fetchPredictions(value);
    },
    [fetchPredictions]
  );

  const handleSuggestionClick = useCallback(
    async (index: number) => {
      if(!places) return;
      const selectedSuggestion = autocompleteSuggestions[index];
      if (!selectedSuggestion?.placePrediction) return;
      const { place } = await selectedSuggestion.placePrediction
        .toPlace()
        .fetchFields({
          fields: ["viewport"],
        });
      if (!place.viewport) return;
      onPlaceSelect(place);
      setAutocompleteSuggestions([]);
      setInputValue(selectedSuggestion.placePrediction.text.text ?? '');
      setSessionToken(new places.AutocompleteSessionToken());
    },
    [autocompleteSuggestions, onPlaceSelect, places]
  );

  return (
    <div className="autocomplete-container">
      <input
        value={inputValue}
        onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
        placeholder="Search for a place"
      />

      {autocompleteSuggestions.length > 0 && (
        <ul className="custom-list">
          {autocompleteSuggestions.map(({placePrediction},index) => {
            return (
              <li
                key={index}
                className="custom-list-item"
                onClick={() => handleSuggestionClick(index)}>
                {placePrediction?.text.text}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
