import {useApiLoadingStatus} from './use-api-loading-status';
import {APILoadingStatus} from '../libraries/api-loading-status';
/**
 * Hook to check if the Google Maps API is loaded
 */
export function useApiIsLoaded(): boolean {
  const status = useApiLoadingStatus();

  return status === APILoadingStatus.LOADED;
}
