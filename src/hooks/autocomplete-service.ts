import {useMemo} from 'react';

import {useApiIsLoaded} from './api-loading-status';

/**
 * Hook to get Google Maps Autocomplete Service instance
 */
export const useAutocompleteService =
  (): google.maps.places.AutocompleteService | null => {
    const googleMapsAPIISLoaded = useApiIsLoaded();

    return useMemo<google.maps.places.AutocompleteService | null>(() => {
      if (!googleMapsAPIISLoaded) {
        return null;
      }

      if (!google.maps.places) {
        console.error(
          'Google Maps Places library is missing. ' +
            'Please add the places library to the props of the <ApiProvider> ' +
            'component.'
        );

        return null;
      }

      return new google.maps.places.AutocompleteService();
    }, [googleMapsAPIISLoaded]);
  };
