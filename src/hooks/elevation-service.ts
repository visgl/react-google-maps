import {useMemo} from 'react';

import {useApiIsLoaded} from './api-loading-status';

/**
 * Hook to get Elevation Service instance
 */
export const useElevationService = (): google.maps.ElevationService | null => {
  const googleMapsAPIIsLoaded = useApiIsLoaded();

  // Creates an Elevation Service instance
  return useMemo<google.maps.ElevationService | null>(() => {
    if (!googleMapsAPIIsLoaded) {
      return null;
    }

    return new google.maps.ElevationService();
  }, [googleMapsAPIIsLoaded]);
};
