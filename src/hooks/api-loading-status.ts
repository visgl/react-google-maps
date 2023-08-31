import {useContext} from 'react';

import {APILoadingStatus, APIProviderContext} from '../components/api-provider';

/**
 * Hook to check, if the Google Maps API is loaded
 */
export const useApiIsLoaded = (): boolean => {
  const status = useApiLoadingStatus();

  return status === APILoadingStatus.LOADED;
};

export const useApiLoadingStatus = (): APILoadingStatus => {
  return useContext(APIProviderContext)?.status || APILoadingStatus.NOT_LOADED;
};
