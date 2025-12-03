import {useContext} from 'react';

import {APIProviderContext} from '../components/api-provider';
import {GoogleMaps3DContext} from '../components/map-3d';
import {logErrorOnce} from '../libraries/errors';

/**
 * Hook to retrieve the Map3DElement instance from context.
 *
 * Must be used within a Map3D component.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const map3d = useMap3D();
 *
 *   const handleClick = () => {
 *     map3d?.flyCameraTo({
 *       endCamera: {
 *         center: { lat: 37.7749, lng: -122.4194, altitude: 1000 },
 *         range: 5000
 *       },
 *       durationMillis: 2000
 *     });
 *   };
 *
 *   return <button onClick={handleClick}>Fly to SF</button>;
 * }
 * ```
 */
export function useMap3D(): google.maps.maps3d.Map3DElement | null {
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

  if (map3dContext === null) {
    logErrorOnce(
      'useMap3D(): failed to retrieve GoogleMaps3DContext. ' +
        'Make sure that the component you are calling `useMap3D()` from is ' +
        'a child of the <Map3D> component.'
    );

    return null;
  }

  return map3dContext.map3d;
}
