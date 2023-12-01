import {useContext} from 'react';

import {APIProviderContext} from '../components/api-provider';
import {GoogleMapsContext} from '../components/map';
import {logErrorOnce} from '../libraries/errors';

/**
 * Retrieves a map-instance from the context. This is either an instance
 * identified by id or the parent map instance if no id is specified.
 * Returns null if neither can be found.
 */
export const useMap = (id: string | null = null): google.maps.Map | null => {
  const ctx = useContext(APIProviderContext);
  const {map} = useContext(GoogleMapsContext) || {};

  if (ctx === null) {
    logErrorOnce(
      'useMap(): failed to retrieve APIProviderContext. ' +
        'Make sure that the <APIProvider> component exists and that the ' +
        'component you are calling `useMap()` from is a sibling of the ' +
        '<APIProvider>.'
    );

    return null;
  }

  const {mapInstances} = ctx;

  // if an id is specified, the corresponding map or null is returned
  if (id !== null) return mapInstances[id] || null;

  // otherwise, return the closest ancestor
  if (map) return map;

  // finally, return the default map instance
  return mapInstances['default'] || null;
};
