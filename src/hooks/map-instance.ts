import {useContext} from 'react';

import {APIProviderContext} from '../components/api-provider';
import {GoogleMapsContext} from '../components/map';

/**
 * Retrieves a map-instance from the context. This is either an instance
 * identified by id or the parent map instance if no id is specified.
 * Returns null if neither can be found.
 */
export const useGoogleMap = (
  id: string | null = null
): google.maps.Map | null => {
  const {mapInstances = {}} = useContext(APIProviderContext) || {};
  const {map} = useContext(GoogleMapsContext) || {};

  // if an if is specified, the corresponding map or null is returned
  if (id !== null) return mapInstances[id] || null;

  // otherwise, return the closest ancestor
  if (map) return map;

  // finally, return the default map instance
  return mapInstances['default'] || null;
};
