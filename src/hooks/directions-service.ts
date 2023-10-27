import {useMemo, useEffect, useCallback} from 'react';

import {useApiIsLoaded} from './use-api-is-loaded';
import {useMap} from './use-map';
import {assertNotNull} from '../libraries/assert-not-null';

export interface DirectionsServiceHookOptions {
  mapId?: string;
  renderOnMap?: boolean;
  renderOptions?: google.maps.DirectionsRendererOptions;
}

interface DirectionsServiceHookReturns {
  directionsService: google.maps.DirectionsService | null;
  directionsRenderer: google.maps.DirectionsRenderer | null;
  renderRoute:
    | ((
        request: google.maps.DirectionsRequest
      ) => Promise<google.maps.DirectionsResult>)
    | null;
  setRenderedRouteIndex: ((index: number) => void) | null;
}

const useDirectionsRenderer = (
  mapId: string | null,
  renderOnMap?: boolean,
  renderOptions?: google.maps.DirectionsRendererOptions
) => {
  const map = useMap(mapId);

  // create the renderer instance
  const directionsRenderer = useMemo(
    () => {
      if (!map || !renderOnMap) return null;

      const renderer = new google.maps.DirectionsRenderer(renderOptions);
      renderer.setMap(map);

      return renderer;
    },
    // note: no dependency on renderOptions since those are handled in the
    // next effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, renderOnMap]
  );

  useEffect(
    () => {
      if (!directionsRenderer) return;

      directionsRenderer.setOptions(renderOptions || {});
    },
    // note: directionsRenderer dependency isn't needed since the
    // renderOptions will be set on initialization when creating the renderer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renderOptions]
  );

  return directionsRenderer;
};

/**
 * Hook to get Google Maps Places Directions Service instance
 */
export const useDirectionsService = (
  props: DirectionsServiceHookOptions = {}
): DirectionsServiceHookReturns => {
  const {mapId = null, renderOnMap, renderOptions} = props;
  const isApiLoaded = useApiIsLoaded();

  // Creates a Directions Service instance
  const directionsService = useMemo(() => {
    // Wait for Google Maps API to be loaded
    if (!isApiLoaded) return null;

    return new google.maps.DirectionsService();
  }, [isApiLoaded]);

  // create the renderer instance
  const directionsRenderer = useDirectionsRenderer(
    mapId,
    renderOnMap,
    renderOptions
  );

  // Custom Directions route request followed by directions rendering
  const renderRoute = useCallback(
    async (
      request: google.maps.DirectionsRequest
    ): Promise<google.maps.DirectionsResult> => {
      // findAndRenderRoute() isn't callable when either directions
      // service or renderer aren't ready
      assertNotNull(directionsService);
      assertNotNull(directionsRenderer);

      const result = await directionsService.route(request);
      directionsRenderer.setDirections(result);

      return result;
    },
    [directionsService, directionsRenderer]
  );

  // Renders directions route of given index
  const setRenderedRouteIndex = (index: number) => {
    assertNotNull(directionsRenderer);

    directionsRenderer.setRouteIndex(index);
  };

  return {
    directionsService,
    directionsRenderer,
    renderRoute: directionsService && directionsRenderer ? renderRoute : null,
    setRenderedRouteIndex:
      directionsService && directionsRenderer ? setRenderedRouteIndex : null
  };
};
