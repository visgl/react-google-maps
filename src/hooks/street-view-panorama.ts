/* eslint-disable complexity */
import {useEffect, useState} from 'react';
import {useApiIsLoaded} from './use-api-is-loaded';
import {useMap} from './use-map';

export interface StreetViewPanoramaProps {
  mapId?: string;
  divElement?: HTMLElement | null;
  position?: google.maps.LatLng | google.maps.LatLngLiteral;
  pov?: google.maps.StreetViewPov;
  zoom?: number;
}

/**
 * Hook to get Street View Panorama
 */
export const useStreetViewPanorama = (
  props: StreetViewPanoramaProps = {}
): google.maps.StreetViewPanorama | null => {
  const {mapId, divElement, position, pov, zoom} = props;
  const googleMapsAPIIsLoaded = useApiIsLoaded();
  const map = useMap(mapId);

  const [streetViewPanorama, setStreetViewPanorama] =
    useState<google.maps.StreetViewPanorama | null>(null);

  // Creates a Street View instance
  useEffect(
    () => {
      if (!googleMapsAPIIsLoaded) return;

      let pano: google.maps.StreetViewPanorama | null = null;
      if (divElement) {
        pano = new google.maps.StreetViewPanorama(divElement);
      } else if (map) {
        pano = map.getStreetView();
      }

      setStreetViewPanorama(pano);

      if (!pano) return;
      if (pov) pano.setPov(pov);
      if (position) pano.setPosition(position);
      if (zoom || zoom === 0) pano.setZoom(zoom);

      return (): void => {
        setStreetViewPanorama(null);

        if (map) map.setStreetView(null);
      };
    },
    // fixme: implement extra hook to update FOV when props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [googleMapsAPIIsLoaded, map, divElement]
  );

  return streetViewPanorama;
};
