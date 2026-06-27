import {useContext, useEffect} from 'react';

import {APIProviderContext} from '../components/api-provider';
import {useApiIsLoaded} from './use-api-is-loaded';

type LibraryName = keyof google.maps.ImportLibraryMap;

export function useMapsLibrary<K extends LibraryName>(
  name: K
): google.maps.ImportLibraryMap[K] | null;

export function useMapsLibrary(name: string) {
  const apiIsLoaded = useApiIsLoaded();
  const ctx = useContext(APIProviderContext);

  useEffect(() => {
    if (!apiIsLoaded || !ctx) return;

    // Trigger loading the libraries via our proxy-method.
    // The returned promise is ignored, since importLibrary will update loadedLibraries
    // list in the context, triggering a re-render.
    void ctx.importLibrary(name as LibraryName);
  }, [apiIsLoaded, ctx, name]);

  return (
    (ctx?.loadedLibraries[name as LibraryName] as
      | google.maps.ImportLibraryMap[LibraryName]
      | undefined) ?? null
  );
}
