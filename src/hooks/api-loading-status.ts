import {useContext, useEffect} from 'react';

import {APILoadingStatus, APIProviderContext} from '../components/api-provider';

/**
 * Hook to check if the Google Maps API is loaded
 */
export function useApiIsLoaded(): boolean {
  const status = useApiLoadingStatus();

  return status === APILoadingStatus.LOADED;
}

export function useApiLoadingStatus(): APILoadingStatus {
  return useContext(APIProviderContext)?.status || APILoadingStatus.NOT_LOADED;
}

export function useMapsLibrary(...names: string[]) {
  const apiIsLoaded = useApiIsLoaded();
  const ctx = useContext(APIProviderContext);

  useEffect(() => {
    if (!apiIsLoaded || !ctx) return;

    // trigger loading the libraries via our proxy-method, which will update the
    // loadedLibraries list in the context, triggering a re-render.
    for (const name of names) {
      if (!ctx.loadedLibraries.has(name)) void ctx.importLibrary(name);
    }
  }, [apiIsLoaded, ctx?.importLibrary]);

  return names.every(name => ctx?.loadedLibraries.has(name) || false);
}
