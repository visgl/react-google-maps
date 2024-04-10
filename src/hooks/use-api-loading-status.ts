import {useApi} from './use-api';
import {APILoadingStatus} from '../libraries/api-loading-status';

export function useApiLoadingStatus(): APILoadingStatus {
  return useApi()?.status || APILoadingStatus.NOT_LOADED;
}
