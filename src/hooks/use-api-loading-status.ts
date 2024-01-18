import {useContext} from 'react';
import {APIProviderContext} from '../components/api-provider';
import {APILoadingStatus} from '../libraries/api-loading-status';

export function useApiLoadingStatus(): APILoadingStatus {
  return useContext(APIProviderContext)?.status || APILoadingStatus.NOT_LOADED;
}
