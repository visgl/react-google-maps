import {useContext} from 'react';
import {APILoadingStatus, APIProviderContext} from '../components/api-provider';

export function useApiLoadingStatus(): APILoadingStatus {
  return useContext(APIProviderContext)?.status || APILoadingStatus.NOT_LOADED;
}
