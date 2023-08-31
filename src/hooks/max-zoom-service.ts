import {useMemo} from 'react';

import {useApiIsLoaded} from './api-loading-status';

/**
 * Hook to get Max Zoom Service instance
 */
export const useMaxZoomService = (): google.maps.MaxZoomService | null => {
  const googleMapsAPIIsLoaded = useApiIsLoaded();

  // Creates a Max Zoom Service instance
  return useMemo<google.maps.MaxZoomService | null>(() => {
    if (!googleMapsAPIIsLoaded) {
      return null;
    }

    return new google.maps.MaxZoomService();
  }, [googleMapsAPIIsLoaded]);
};
