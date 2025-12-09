import {useContext} from 'react';

import {APIProviderContext} from '../components/api-provider';
import {GoogleMaps3DContext} from '../components/map-3d';
import {logErrorOnce} from '../libraries/errors';

/**
 * Hook to retrieve a Map3DElement instance from context.
 *
 * When called without an id, it returns the map from the nearest parent Map3D
 * component. When called with an id, it retrieves the map with that id from
 * the APIProvider context.
 *
 * @param id - Optional id of the map to retrieve. If not specified, returns
 *   the parent map instance or the default map instance.
 *
 * @example
 * ```tsx
 * // Get the parent Map3D instance
 * function MyComponent() {
 *   const map3d = useMap3D();
 *   // ...
 * }
 *
 * // Get a specific Map3D instance by id
 * function ControlPanel() {
 *   const mainMap = useMap3D('main-map');
 *   const miniMap = useMap3D('mini-map');
 *   // ...
 * }
 * ```
 */
export function useMap3D(
  id: string | null = null
): google.maps.maps3d.Map3DElement | null {
  const apiContext = useContext(APIProviderContext);
  const map3dContext = useContext(GoogleMaps3DContext);

  if (apiContext === null) {
    logErrorOnce(
      'useMap3D(): failed to retrieve APIProviderContext. ' +
        'Make sure that the <APIProvider> component exists and that the ' +
        'component you are calling `useMap3D()` from is a child of the ' +
        '<APIProvider>.'
    );

    return null;
  }

  const {map3dInstances} = apiContext;

  // if an id is specified, the corresponding map3d or null is returned
  if (id !== null) return map3dInstances[id] || null;

  // otherwise, return the closest ancestor
  if (map3dContext?.map3d) return map3dContext.map3d;

  // finally, return the default map3d instance
  return map3dInstances['default'] || null;
}
