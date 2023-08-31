import {useMemo} from 'react';

import {useApiIsLoaded} from './api-loading-status';

/**
 * Hook to get Google Maps Geocoder instance
 */
export const useGeocodingService = (): google.maps.Geocoder | null => {
  const googleMapsAPIIsLoaded = useApiIsLoaded();

  return useMemo<google.maps.Geocoder | null>(() => {
    if (!googleMapsAPIIsLoaded) {
      return null;
    }

    return new google.maps.Geocoder();
  }, [googleMapsAPIIsLoaded]);
};
