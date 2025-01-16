import {APILoadingStatus} from './api-loading-status';

export type ApiParams = {
  key: string;
  v?: string;
  language?: string;
  region?: string;
  libraries?: string;
  channel?: number;
  solutionChannel?: string;
  authReferrerPolicy?: string;
};

type LoadingStatusCallback = (status: APILoadingStatus) => void;

const MAPS_API_BASE_URL = 'https://maps.googleapis.com/maps/api/js';

/**
 * A GoogleMapsApiLoader to reliably load and unload the Google Maps JavaScript API.
 *
 * The actual loading and unloading is delayed into the microtask queue, to
 * allow using the API in an useEffect hook, without worrying about multiple API loads.
 */
export class GoogleMapsApiLoader {
  /**
   * The current loadingStatus of the API.
   */
  public static loadingStatus: APILoadingStatus = APILoadingStatus.NOT_LOADED;

  /**
   * The parameters used for first loading the API.
   */
  public static serializedApiParams?: string;

  /**
   * A list of functions to be notified when the loading status changes.
   */
  private static listeners: LoadingStatusCallback[] = [];

  /**
   * Loads the Maps JavaScript API with the specified parameters.
   * Since the Maps library can only be loaded once per page, this will
   * produce a warning when called multiple times with different
   * parameters.
   *
   * The returned promise resolves when loading completes
   * and rejects in case of an error or when the loading was aborted.
   */
  static async load(
    params: ApiParams,
    onLoadingStatusChange: (status: APILoadingStatus) => void
  ): Promise<void> {
    const libraries = params.libraries ? params.libraries.split(',') : [];
    const serializedParams = this.serializeParams(params);

    this.listeners.push(onLoadingStatusChange);

    // Note: if `google.maps.importLibrary` has been defined externally, we
    //   assume that loading is complete and successful.
    //   If it was defined by a previous call to this method, a warning
    //   message is logged if there are differences in api-parameters used
    //   for both calls.

    if (window.google?.maps?.importLibrary as unknown) {
      // no serialized parameters means it was loaded externally
      if (!this.serializedApiParams) {
        this.loadingStatus = APILoadingStatus.LOADED;
      }
      this.notifyLoadingStatusListeners();
    } else {
      this.serializedApiParams = serializedParams;
      this.initImportLibrary(params);
    }

    if (
      this.serializedApiParams &&
      this.serializedApiParams !== serializedParams
    ) {
      console.warn(
        `[google-maps-api-loader] The maps API has already been loaded ` +
          `with different parameters and will not be loaded again. Refresh the ` +
          `page for new values to have effect.`
      );
    }

    const librariesToLoad = ['maps', ...libraries];
    await Promise.all(
      librariesToLoad.map(name => google.maps.importLibrary(name))
    );
  }

  /**
   * Serialize the parameters used to load the library for easier comparison.
   */
  private static serializeParams(params: ApiParams): string {
    return [
      params.v,
      params.key,
      params.language,
      params.region,
      params.authReferrerPolicy,
      params.solutionChannel
    ].join('/');
  }

  /**
   * Creates the global `google.maps.importLibrary` function for bootstrapping.
   * This is essentially a formatted version of the dynamic loading script
   * from the official documentation with some minor adjustments.
   *
   * The created importLibrary function will load the Google Maps JavaScript API,
   * which will then replace the `google.maps.importLibrary` function with the full
   * implementation.
   *
   * @see https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import
   */
  private static initImportLibrary(params: ApiParams) {
    if (!window.google) window.google = {} as never;
    if (!window.google.maps) window.google.maps = {} as never;

    if (window.google.maps['importLibrary']) {
      console.error(
        '[google-maps-api-loader-internal]: initImportLibrary must only be called once'
      );

      return;
    }

    let apiPromise: Promise<void> | null = null;

    const loadApi = () => {
      if (apiPromise) return apiPromise;

      apiPromise = new Promise((resolve, reject) => {
        const scriptElement = document.createElement('script');
        const urlParams = new URLSearchParams();

        for (const [key, value] of Object.entries(params)) {
          const urlParamName = key.replace(
            /[A-Z]/g,
            t => '_' + t[0].toLowerCase()
          );
          urlParams.set(urlParamName, String(value));
        }
        urlParams.set('loading', 'async');
        urlParams.set('callback', '__googleMapsCallback__');

        scriptElement.async = true;
        scriptElement.src = MAPS_API_BASE_URL + `?` + urlParams.toString();
        scriptElement.nonce =
          (document.querySelector('script[nonce]') as HTMLScriptElement)
            ?.nonce || '';

        scriptElement.onerror = () => {
          this.loadingStatus = APILoadingStatus.FAILED;
          this.notifyLoadingStatusListeners();
          reject(new Error('The Google Maps JavaScript API could not load.'));
        };

        window.__googleMapsCallback__ = () => {
          this.loadingStatus = APILoadingStatus.LOADED;
          this.notifyLoadingStatusListeners();
          resolve();
        };

        window.gm_authFailure = () => {
          this.loadingStatus = APILoadingStatus.AUTH_FAILURE;
          this.notifyLoadingStatusListeners();
        };

        this.loadingStatus = APILoadingStatus.LOADING;
        this.notifyLoadingStatusListeners();

        document.head.append(scriptElement);
      });

      return apiPromise;
    };

    // for the first load, we declare an importLibrary function that will
    // be overwritten once the api is loaded.
    google.maps.importLibrary = libraryName =>
      loadApi().then(() => google.maps.importLibrary(libraryName));
  }

  /**
   * Calls all registered loadingStatusListeners after a status update.
   */
  private static notifyLoadingStatusListeners() {
    for (const fn of this.listeners) {
      fn(this.loadingStatus);
    }
  }
}

// Declare global maps callback functions
declare global {
  interface Window {
    __googleMapsCallback__?: () => void;
    gm_authFailure?: () => void;
  }
}
