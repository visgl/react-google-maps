import {useMemo} from 'react';

import {useApiIsLoaded} from './api-loading-status';

/**
 * Hook to get Distance Matrix Service instance
 */
export const useDistanceMatrixService =
  (): google.maps.DistanceMatrixService | null => {
    const isApiLoaded = useApiIsLoaded();

    // Creates a Distance Matrix Service instance
    return useMemo<google.maps.DistanceMatrixService | null>(() => {
      if (!isApiLoaded) {
        return null;
      }
      if (!google.maps.DistanceMatrixService) {
        console.error('Google Maps Distance Matrix library is missing.');

        return null;
      }

      return new google.maps.DistanceMatrixService();
    }, [isApiLoaded]);
  };
