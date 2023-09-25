export type ApiParams = {
  key: string;
  v?: string;
  language?: string;
  region?: string;
  libraries?: string;
  solutionChannel?: string;
  authReferrerPolicy?: string;
};

// Declare global maps callback function
declare global {
  interface Window {
    __googleMapsCallback__?: () => void;
    __googleMapsApiParams__?: string;
  }
}

const MAPS_API_BASE_URL = 'https://maps.googleapis.com/maps/api/js';

/**
 * A GoogleMapsApiLoader to reliably load and unload the Google Maps JavaScript API.
 *
 * The actual loading and unloading is delayed into the microtask queue, to
 * allow using the API in an useEffect hook, without worrying about multiple API loads.
 */
export class GoogleMapsApiLoader {
  /**
   * Loads the Google Maps API with the specified parameters.
   * Since the maps library can only be loaded once per page, this will
   * produce a warning when called multiple times with different
   * parameters.
   *
   * The returned promise resolves when loading completes
   * and rejects in case of an error or when the loading was aborted.
   * @param params
   */
  static async load(params: ApiParams): Promise<void> {
    const libraries = params.libraries ? params.libraries.split(',') : [];
    const serializedParams = this.serializeParams(params);

    if (!window.google?.maps?.importLibrary) {
      window.__googleMapsApiParams__ = serializedParams;
      this.initImportLibrary(params);
    }

    if (
      window.__googleMapsApiParams__ &&
      window.__googleMapsApiParams__ !== serializedParams
    ) {
      console.warn(
        `The maps API has already been loaded with different ` +
          `parameters and will not be loaded again. Refresh the page for ` +
          `new values to have effect.`
      );
    }

    for (const lib of ['maps', ...libraries]) {
      await google.maps.importLibrary(lib);
    }
  }

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

  private static initImportLibrary(params: ApiParams) {
    if (!window.google) window.google = {} as never;
    if (!window.google.maps) window.google.maps = {} as never;

    if (window.google.maps['importLibrary']) {
      console.warn('initImportLibrary can only be called once.', params);

      return;
    }

    let apiPromise: Promise<void> | null = null;

    const loadApi = (library: string) => {
      if (apiPromise) return apiPromise;

      apiPromise = new Promise((resolve, reject) => {
        const scriptElement = document.createElement('script');
        const urlParams = new URLSearchParams();

        for (const [key, value] of Object.entries(params)) {
          const urlParamName = key.replace(
            /[A-Z]/g,
            t => '_' + t[0].toLowerCase()
          );
          urlParams.set(urlParamName, value);
        }
        urlParams.set('libraries', library);
        urlParams.set('callback', '__googleMapsCallback__');
        scriptElement.src = MAPS_API_BASE_URL + `?` + urlParams.toString();

        window.__googleMapsCallback__ = resolve;

        scriptElement.onerror = () =>
          reject(new Error('The Google Maps JavaScript API could not load.'));
        scriptElement.nonce =
          (document.querySelector('script[nonce]') as HTMLScriptElement)
            ?.nonce || '';

        document.head.append(scriptElement);
      });

      return apiPromise;
    };

    // for the first load we declare an importLibrary function that will
    // be overwritten once the api is loaded.
    google.maps.importLibrary = libraryName =>
      loadApi(libraryName).then(() => google.maps.importLibrary(libraryName));
  }
}
