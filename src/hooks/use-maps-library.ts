import {useEffect} from 'react';

import {useApiIsLoaded} from './use-api-is-loaded';
import {useApi} from './use-api';

interface ApiLibraries {
  core: google.maps.CoreLibrary;
  maps: google.maps.MapsLibrary;
  places: google.maps.PlacesLibrary;
  geocoding: google.maps.GeocodingLibrary;
  routes: google.maps.RoutesLibrary;
  marker: google.maps.MarkerLibrary;
  geometry: google.maps.GeometryLibrary;
  elevation: google.maps.ElevationLibrary;
  streetView: google.maps.StreetViewLibrary;
  journeySharing: google.maps.JourneySharingLibrary;
  drawing: google.maps.DrawingLibrary;
  visualization: google.maps.VisualizationLibrary;
}

export function useMapsLibrary<
  K extends keyof ApiLibraries,
  V extends ApiLibraries[K]
>(name: K): V | null;

export function useMapsLibrary(name: string) {
  const apiIsLoaded = useApiIsLoaded();
  const api = useApi();

  useEffect(() => {
    if (!apiIsLoaded || !api) return;

    // Trigger loading the libraries via our proxy-method.
    // The returned promise is ignored, since importLibrary will update loadedLibraries
    // list in the context, triggering a re-render.
    void api.importLibrary(name);
  }, [apiIsLoaded, api, name]);

  return api?.loadedLibraries[name] || null;
}
