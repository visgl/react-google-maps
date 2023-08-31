import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
  useState
} from 'react';

import {GoogleMapsApiLoader} from '../libraries/google-maps-api-loader';

/**
 * API Provider types
 */
export interface APILoadingOptions {
  /**
   * apiKey must be provided to load the Google Maps JavaScript API. To create an API key, see: https://developers.google.com/maps/documentation/javascript/get-api-key
   * Part of:
   */
  apiKey: string;
  /**
   * A custom id to reference the script tag can be provided. The default is set to 'google-maps-api'
   * @default 'google-maps-api'
   */
  libraries?: Array<string>;
  /**
   * A specific version of the Google Maps JavaScript API can be used.
   * Read more about versioning: https://developers.google.com/maps/documentation/javascript/versions
   * Part of: https://developers.google.com/maps/documentation/javascript/url-params
   */
  version?: string;
  /**
   * Sets the map to a specific region.
   * Read more about localizing the Map: https://developers.google.com/maps/documentation/javascript/localization
   * Part of: https://developers.google.com/maps/documentation/javascript/url-params
   */
  region?: string;
  /**
   * Use a specific language for the map.
   * Read more about localizing the Map: https://developers.google.com/maps/documentation/javascript/localization
   * Part of: https://developers.google.com/maps/documentation/javascript/url-params
   */
  language?: string;
  /**
   * auth_referrer_policy can be set to 'origin'.
   * Part of: https://developers.google.com/maps/documentation/javascript/url-params
   */
  authReferrerPolicy?: string;
}

export enum APILoadingStatus {
  NOT_LOADED = 'NOT_LOADED',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  FAILED = 'FAILED'
}

const {NOT_LOADED, LOADING, LOADED, FAILED} = APILoadingStatus;

/**
 * API Provider context
 */
export interface APIProviderContextValue {
  status: APILoadingStatus;
  mapInstances: Record<string, google.maps.Map>;
  addMapInstance: (map: google.maps.Map, id?: string) => void;
  removeMapInstance: (id?: string) => void;
  clearMapInstances: () => void;
}

export const APIProviderContext =
  React.createContext<APIProviderContextValue | null>(null);

/**
 * Props for the API Provider component
 */
export interface APIProviderProps extends APILoadingOptions {
  /**
   * A function that can be used to execute code after the Google Maps JavaScript API has been loaded.
   */
  onLoad?: () => void;
}

/**
 * local hook to manage access to map-instances.
 */
function useMapInstances() {
  const [mapInstances, setMapInstances] = useState<
    Record<string, google.maps.Map>
  >({});

  const addMapInstance = (mapInstance: google.maps.Map, id = 'default') => {
    setMapInstances(instances => ({...instances, [id]: mapInstance}));
  };

  const removeMapInstance = (id = 'default') => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setMapInstances(({[id]: _, ...remaining}) => remaining);
  };

  const clearMapInstances = () => {
    setMapInstances({});
  };

  return {mapInstances, addMapInstance, removeMapInstance, clearMapInstances};
}

/**
 * local hook to handle the loading of the maps API, returns the current loading status
 * @param props
 */
function useGoogleMapsApiLoader(props: APIProviderProps): APILoadingStatus {
  const {onLoad, apiKey, libraries, ...otherApiParams} = props;

  const [status, setStatus] = useState<APILoadingStatus>(NOT_LOADED);

  const librariesString = useMemo(() => libraries?.join(','), [libraries]);
  const serializedParams = useMemo(
    () => JSON.stringify(otherApiParams),
    [otherApiParams]
  );

  useEffect(
    () => {
      setStatus(LOADING);

      (async () => {
        try {
          await GoogleMapsApiLoader.load({
            key: apiKey,
            libraries: librariesString,
            ...otherApiParams
          });

          setStatus(LOADED);

          if (onLoad) {
            onLoad();
          }
        } catch (error) {
          console.error('<ApiProvider> failed to load Google Maps API', error);
          setStatus(FAILED);
        }
      })();
    },
    // FIXME: changes to onLoad callback aren't handled. Maybe remove that functionality?
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiKey, librariesString, serializedParams]
  );

  return status;
}

/**
 * Component to wrap the Google Maps React components and load the Google Maps JavaScript API
 */
export const APIProvider = (
  props: PropsWithChildren<APIProviderProps>
): ReactElement | null => {
  const {children, ...loaderProps} = props;
  const {mapInstances, addMapInstance, removeMapInstance, clearMapInstances} =
    useMapInstances();

  const status = useGoogleMapsApiLoader(loaderProps);

  return (
    <APIProviderContext.Provider
      value={{
        mapInstances,
        addMapInstance,
        removeMapInstance,
        clearMapInstances,
        status
      }}>
      {children}
    </APIProviderContext.Provider>
  );
};
