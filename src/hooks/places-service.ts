import {useEffect, useState} from 'react';

import {useApiIsLoaded} from './api-loading-status';
import {useMap} from './map-instance';

export interface PlacesServiceProps {
  mapId?: string;
  attributionContainer?: HTMLDivElement | null;
}

/**
 * Hook to get Google Maps Places Service instance
 */
export const usePlacesService = (
  props: PlacesServiceProps = {}
): google.maps.places.PlacesService | null => {
  const {mapId, attributionContainer} = props;
  const isApiLoaded = useApiIsLoaded();
  const map = useMap(mapId);

  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  // Creates a Places Service instance
  useEffect(() => {
    if (!isApiLoaded) return;

    if (!google.maps.places) {
      console.error(
        'Google Maps Places library is missing. ' +
          'Please add the places library to the props of the <ApiProvider> ' +
          'component.'
      );

      return;
    }

    // when attributionContainer isn't specified, we use the map
    if (props.attributionContainer === undefined) {
      // wait for map to be ready
      if (!map) return;

      setPlacesService(new google.maps.places.PlacesService(map));
    } else {
      if (!attributionContainer) return;

      setPlacesService(
        new google.maps.places.PlacesService(attributionContainer)
      );
    }
  }, [isApiLoaded, map, attributionContainer]);

  return placesService;
};
