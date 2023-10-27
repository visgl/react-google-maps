import {useState, useRef, useEffect} from 'react';

import {useApiIsLoaded} from './use-api-is-loaded';

export interface AutocompleteProps {
  inputField: HTMLInputElement | null;
  options?: google.maps.places.AutocompleteOptions;
  onPlaceChanged: (place: google.maps.places.PlaceResult) => void;
}

/**
 * Hook to get a Google Maps Places Autocomplete instance
 * monitoring an input field
 */
export const useAutocomplete = (
  props: AutocompleteProps
): google.maps.places.Autocomplete | null => {
  const {inputField, options, onPlaceChanged} = props;

  const googleMapsAPIIsLoaded = useApiIsLoaded();

  const placeChangedHandler = useRef(onPlaceChanged);

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Initializes the Google Maps Places Autocomplete
  useEffect(() => {
    // Wait for the Google Maps API and input element to be initialized
    if (!googleMapsAPIIsLoaded || !inputField) return;

    // FIXME: add dynamic loading for required libraries
    if (!google.maps.places) {
      console.error(
        'Google Maps Places library is missing. ' +
          'Please add the places library to the props of the <ApiProvider> ' +
          'component.'
      );

      return;
    }

    // Create Autocomplete instance
    const autocompleteInstance = new google.maps.places.Autocomplete(
      inputField,
      options
    );

    setAutocomplete(autocompleteInstance);

    // Add places change listener to Autocomplete
    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();
      if (placeChangedHandler.current) placeChangedHandler.current(place);
    });

    // Clear listeners on unmount
    return () => {
      if (autocompleteInstance && typeof google.maps === 'object') {
        google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [googleMapsAPIIsLoaded, inputField, options]);

  return autocomplete;
};
