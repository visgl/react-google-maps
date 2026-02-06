import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react';
import {APIOptions, importLibrary, setOptions} from '@googlemaps/js-api-loader';

import {APILoadingStatus} from '../libraries/api-loading-status';
import {VERSION} from '../version';

type ImportLibraryFunction = typeof importLibrary;
type GoogleMapsLibrary = Awaited<ReturnType<ImportLibraryFunction>>;
type LoadedLibraries = {[name: string]: GoogleMapsLibrary};
type LoadingStatusCallback = (status: APILoadingStatus) => void;

export interface APIProviderContextValue {
  status: APILoadingStatus;
  loadedLibraries: LoadedLibraries;
  importLibrary: typeof importLibrary;
  mapInstances: Record<string, google.maps.Map>;
  addMapInstance: (map: google.maps.Map, id?: string) => void;
  removeMapInstance: (id?: string) => void;
  clearMapInstances: () => void;
  map3dInstances: Record<string, google.maps.maps3d.Map3DElement>;
  addMap3DInstance: (
    map3d: google.maps.maps3d.Map3DElement,
    id?: string
  ) => void;
  removeMap3DInstance: (id?: string) => void;
  clearMap3DInstances: () => void;
  internalUsageAttributionIds: string[] | null;
}

const DEFAULT_SOLUTION_CHANNEL = 'GMP_visgl_rgmlibrary_v1_default';
const DEFAULT_INTERNAL_USAGE_ATTRIBUTION_IDS = [
  `gmp_visgl_reactgooglemaps_v${VERSION}`
];

export const APIProviderContext =
  React.createContext<APIProviderContextValue | null>(null);

export type APIProviderProps = PropsWithChildren<{
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
  /**
   * To track usage of Google Maps JavaScript API via numeric channels.
   * The only acceptable channel values are numbers from 0-999.
   * Read more in the
   * [documentation](https://developers.google.com/maps/reporting-and-monitoring/reporting#usage-tracking-per-channel)
   */
  channel?: number;
  /**
   * To understand usage and ways to improve our solutions, Google includes the
   * `solution_channel` query parameter in API calls to gather information about
   * code usage. You may opt out at any time by setting this attribute to an
   * empty string. Read more in the
   * [documentation](https://developers.google.com/maps/reporting-and-monitoring/reporting#solutions-usage).
   */
  solutionChannel?: string;
  /**
   * To help Google understand which libraries and samples are helpful to developers, such as usage of this library.
   * To opt out of sending the usage attribution ID, use this boolean prop. Read more in the
   * [documentation](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.internalUsageAttributionIds).
   */
  disableUsageAttribution?: boolean;
  /**
   * A function that can be used to execute code after the Google Maps JavaScript API has been loaded.
   */
  onLoad?: () => void;
  /**
   * A function that will be called if there was an error when loading the Google Maps JavaScript API.
   */
  onError?: (error: unknown) => void;
  /**
   * A function that returns a Promise resolving to an App Check token.
   * When provided, it will be set on `google.maps.Settings.getInstance().fetchAppCheckToken`
   * after the Google Maps JavaScript API has been loaded.
   */
  fetchAppCheckToken?: () => Promise<google.maps.MapsAppCheckTokenResult>;
}>;

// loading the Maps JavaScript API can only happen once in the runtime, so these
// variables are kept at the module level.
let loadingStatus: APILoadingStatus = APILoadingStatus.NOT_LOADED;
let serializedApiParams: string | undefined;

const listeners = new Set<LoadingStatusCallback>();

/**
 * Called to update the local status and notify the listeners for any mounted
 * components.
 * @internal
 */
function updateLoadingStatus(status: APILoadingStatus) {
  if (status === loadingStatus) {
    return;
  }
  loadingStatus = status;
  listeners.forEach(listener => listener(loadingStatus));
}

/**
 * Local hook to set up the map-instance management context.
 * @internal
 */
function useMapInstances() {
  const [mapInstances, setMapInstances] = useState<
    Record<string, google.maps.Map>
  >({});

  const addMapInstance = (mapInstance: google.maps.Map, id = 'default') => {
    setMapInstances(instances => ({...instances, [id]: mapInstance}));
  };

  const removeMapInstance = (id = 'default') => {
    setMapInstances(({[id]: _, ...remaining}) => remaining);
  };

  const clearMapInstances = () => {
    setMapInstances({});
  };

  return {mapInstances, addMapInstance, removeMapInstance, clearMapInstances};
}

/**
 * local hook to set up the 3D map-instance management context.
 */
function useMap3DInstances() {
  const [map3dInstances, setMap3DInstances] = useState<
    Record<string, google.maps.maps3d.Map3DElement>
  >({});

  const addMap3DInstance = (
    map3dInstance: google.maps.maps3d.Map3DElement,
    id = 'default'
  ) => {
    setMap3DInstances(instances => ({...instances, [id]: map3dInstance}));
  };

  const removeMap3DInstance = (id = 'default') => {
    setMap3DInstances(({[id]: _, ...remaining}) => remaining);
  };

  const clearMap3DInstances = () => {
    setMap3DInstances({});
  };

  return {
    map3dInstances,
    addMap3DInstance,
    removeMap3DInstance,
    clearMap3DInstances
  };
}

/**
 * Local hook to handle the loading of the maps API.
 * @internal
 */
function useGoogleMapsApiLoader(props: APIProviderProps) {
  const {
    onLoad,
    onError,
    apiKey,
    version,
    libraries = [],
    region,
    language,
    authReferrerPolicy,
    channel,
    solutionChannel,
    fetchAppCheckToken
  } = props;

  const [status, setStatus] = useState<APILoadingStatus>(loadingStatus);
  const [loadedLibraries, addLoadedLibrary] = useReducer(
    (
      loadedLibraries: LoadedLibraries,
      action: {name: keyof LoadedLibraries; value: LoadedLibraries[string]}
    ) => {
      return loadedLibraries[action.name]
        ? loadedLibraries
        : {...loadedLibraries, [action.name]: action.value};
    },
    {}
  );

  const currentSerializedParams = useMemo(() => {
    const params = {
      apiKey,
      version,
      libraries: libraries.join(','),
      region,
      language,
      authReferrerPolicy,
      channel,
      solutionChannel
    };
    return JSON.stringify(params);
  }, [
    apiKey,
    version,
    libraries,
    region,
    language,
    authReferrerPolicy,
    channel,
    solutionChannel
  ]);

  const importLibraryCallback: typeof importLibrary = useCallback(
    async (name: string) => {
      if (loadedLibraries[name]) {
        return loadedLibraries[name];
      }

      const res = await importLibrary(name);
      addLoadedLibrary({name, value: res});

      return res;
    },
    [loadedLibraries]
  );

  // effect: we want to get notified of global loading-status changes
  useEffect(() => {
    listeners.add(setStatus);

    // sync component state on mount (shouldn't be different from the initial state)
    setStatus(loadingStatus);

    return () => {
      listeners.delete(setStatus);
    };
  }, []);

  // effect: set and store options
  useEffect(
    () => {
      (async () => {
        try {
          // This indicates that the API has been loaded with a different set of parameters.
          // While this is not blocking, it's not recommended and we should warn the user.
          if (
            serializedApiParams &&
            serializedApiParams !== currentSerializedParams
          ) {
            console.warn(
              `The Google Maps JavaScript API has already been loaded with different parameters. ` +
                `The new parameters will be ignored. If you need to use different parameters, ` +
                `please refresh the page.`
            );
          }

          const librariesToLoad = ['core', 'maps', ...libraries];

          // If the google.maps namespace is already available, the API has been loaded externally.
          if (window.google?.maps?.importLibrary as unknown) {
            if (!serializedApiParams) {
              updateLoadingStatus(APILoadingStatus.LOADED);
            }
            await Promise.all(
              librariesToLoad.map(name => importLibraryCallback(name))
            );
            if (onLoad) onLoad();
            return;
          }

          // Abort if the API is already loading or has been loaded.
          if (
            loadingStatus === APILoadingStatus.LOADING ||
            loadingStatus === APILoadingStatus.LOADED
          ) {
            if (loadingStatus === APILoadingStatus.LOADED && onLoad) onLoad();
            return;
          }

          serializedApiParams = currentSerializedParams;
          updateLoadingStatus(APILoadingStatus.LOADING);

          const options: APIOptions = Object.fromEntries(
            Object.entries({
              key: apiKey,
              v: version,
              libraries,
              region,
              language,
              authReferrerPolicy
            }).filter(([, value]) => value !== undefined)
          );

          if (channel !== undefined && channel >= 0 && channel <= 999) {
            options.channel = String(channel);
          }

          // solution-channel: when undefined, use the default; otherwise use
          // an explicit value.
          if (solutionChannel === undefined) {
            options.solutionChannel = DEFAULT_SOLUTION_CHANNEL;
          } else if (solutionChannel !== '') {
            options.solutionChannel = solutionChannel;
          }

          // this will actually trigger loading the maps API
          setOptions(options);

          // wait for all requested libraries (inluding 'core' and 'maps') to
          // finish loading
          await Promise.all(
            librariesToLoad.map(name => importLibraryCallback(name))
          );
          updateLoadingStatus(APILoadingStatus.LOADED);

          if (onLoad) {
            onLoad();
          }
        } catch (error) {
          updateLoadingStatus(APILoadingStatus.FAILED);
          if (onError) {
            onError(error);
          } else {
            console.error(
              'The Google Maps JavaScript API failed to load.',
              error
            );
          }
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSerializedParams, onLoad, onError, importLibraryCallback, libraries]
  );

  // set the fetchAppCheckToken if provided
  useEffect(() => {
    if (status !== APILoadingStatus.LOADED) return;

    const settings = google.maps.Settings.getInstance();
    if (fetchAppCheckToken) {
      settings.fetchAppCheckToken = fetchAppCheckToken;
    } else if (settings.fetchAppCheckToken) {
      settings.fetchAppCheckToken = null;
    }
  }, [status, fetchAppCheckToken]);

  return {
    status,
    loadedLibraries,
    importLibrary: importLibraryCallback
  };
}

function useInternalUsageAttributionIds(props: APIProviderProps) {
  return useMemo(
    () =>
      props.disableUsageAttribution
        ? null
        : DEFAULT_INTERNAL_USAGE_ATTRIBUTION_IDS,
    [props.disableUsageAttribution]
  );
}

/**
 * Component to wrap the components from this library and load the Google Maps JavaScript API
 */
export const APIProvider: FunctionComponent<APIProviderProps> = props => {
  const {children, ...loaderProps} = props;
  const {mapInstances, addMapInstance, removeMapInstance, clearMapInstances} =
    useMapInstances();
  const {
    map3dInstances,
    addMap3DInstance,
    removeMap3DInstance,
    clearMap3DInstances
  } = useMap3DInstances();

  const {status, loadedLibraries, importLibrary} =
    useGoogleMapsApiLoader(loaderProps);

  const internalUsageAttributionIds =
    useInternalUsageAttributionIds(loaderProps);

  const contextValue: APIProviderContextValue = useMemo(
    () => ({
      mapInstances,
      addMapInstance,
      removeMapInstance,
      clearMapInstances,
      map3dInstances,
      addMap3DInstance,
      removeMap3DInstance,
      clearMap3DInstances,
      status,
      loadedLibraries,
      importLibrary,
      internalUsageAttributionIds
    }),
    [
      mapInstances,
      addMapInstance,
      removeMapInstance,
      clearMapInstances,
      map3dInstances,
      addMap3DInstance,
      removeMap3DInstance,
      clearMap3DInstances,
      status,
      loadedLibraries,
      importLibrary,
      internalUsageAttributionIds
    ]
  );

  return (
    <APIProviderContext.Provider value={contextValue}>
      {children}
    </APIProviderContext.Provider>
  );
};

/**
 * @internal
 * Resets module-level state for testing purposes only.
 * This should never be used in production code.
 */
export function __resetModuleState() {
  loadingStatus = APILoadingStatus.NOT_LOADED;
  serializedApiParams = undefined;
  listeners.clear();
}
