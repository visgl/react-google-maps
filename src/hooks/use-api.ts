import {useContext} from 'react';

import {
  APIProviderContext,
  APIProviderContextValue
} from '../components/api-provider';

export const useApi = (): APIProviderContextValue | null => {
  return useContext(APIProviderContext);
};
