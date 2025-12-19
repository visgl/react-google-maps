import {importLibrary, setOptions} from '@googlemaps/js-api-loader';

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
    const serializedParams = this.serializeParams(params);
    this.listeners.push(onLoadingStatusChange);

    // Set global callbacks for Maps JS API to use (always define them).
    // These will be called by the Google Maps script when it loads or fails authentication.
    window.__googleMapsCallback__ = () => {
      if (this.loadingStatus !== APILoadingStatus.LOADED) {
        this.loadingStatus = APILoadingStatus.LOADED;
        this.notifyLoadingStatusListeners();
      }
    };
    window.gm_authFailure = () => {
      if (this.loadingStatus !== APILoadingStatus.AUTH_FAILURE) {
        this.loadingStatus = APILoadingStatus.AUTH_FAILURE;
        this.notifyLoadingStatusListeners();
      }
    };

    // Warning for different parameters if already loaded (this is for internal loads only)
    // Only check if serializedApiParams already exists (i.e., a previous load attempt by us)
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

    // --- Start: Handle existing (possibly externally loaded) API ---
    if (window.google?.maps?.importLibrary as unknown) {
      // If `importLibrary` is already defined, the API script has been loaded (either by us or externally).
      // We still need to process new library requests.

      // If we haven't recorded params, this was an external load. Update status.
      if (!this.serializedApiParams) {
        // This will only be true for the very first external load detected.
        this.loadingStatus = APILoadingStatus.LOADED;
        this.notifyLoadingStatusListeners();
      }

      try {
        const libraries = params.libraries ? params.libraries.split(',') : [];
        const librariesToLoad = ['maps', ...libraries];
        await Promise.all(
          librariesToLoad.map(name => google.maps.importLibrary(name))
        );

        // If successful, and status isn't LOADED (e.g., from an earlier auth failure), set it.
        if (this.loadingStatus !== APILoadingStatus.LOADED) {
          this.loadingStatus = APILoadingStatus.LOADED;
          this.notifyLoadingStatusListeners();
        }
      } catch (err) {
        this.loadingStatus = APILoadingStatus.FAILED;
        this.notifyLoadingStatusListeners();
        console.error(
          'The Google Maps JavaScript API could not load (libraries import failed in external load scenario).',
          err
        );
        throw err;
      }
      return; // Handled existing API, exit.
    }
    // --- End: Handle existing (possibly externally loaded) API ---

    // --- Start: Handle initial internal API loading ---
    // If we reach here, `window.google?.maps?.importLibrary` was not initially defined,
    // so we need to initiate the load using `setOptions`.

    // Check for existing internal load attempt already in progress
    if (this.loadingStatus === APILoadingStatus.LOADING) {
      this.notifyLoadingStatusListeners();
      return;
    }
    // Check for existing internal load already completed
    if (this.loadingStatus === APILoadingStatus.LOADED) {
      this.notifyLoadingStatusListeners();
      return;
    }

    this.serializedApiParams = serializedParams; // Record parameters for *this* load attempt.
    this.loadingStatus = APILoadingStatus.LOADING;
    this.notifyLoadingStatusListeners();

    try {
      const {libraries: librariesStr, channel, ...rest} = params;
      const libraries = librariesStr ? librariesStr.split(',') : [];

      setOptions({
        ...rest,
        libraries,
        ...(channel !== undefined && {channel: String(channel)})
      });

      const librariesToLoad = ['maps', ...libraries];
      await Promise.all(librariesToLoad.map(name => importLibrary(name)));

      // If Promise.all resolves here, explicitly set LOADED status.
      if (this.loadingStatus === APILoadingStatus.LOADING) {
        this.loadingStatus = APILoadingStatus.LOADED;
        this.notifyLoadingStatusListeners();
      }
    } catch (err) {
      this.loadingStatus = APILoadingStatus.FAILED;
      this.notifyLoadingStatusListeners();
      console.error(
        'The Google Maps JavaScript API could not load (internal load failed).',
        err
      );
      throw err;
    }
    // --- End: Handle initial internal API loading ---
  }

  /**
   * Serialize the parameters used to load the library for easier comparison.
   */
  private static serializeParams(params: ApiParams): string {
    return [
      params.key,
      params.v,
      params.language,
      params.region,
      params.channel,
      params.solutionChannel,
      params.authReferrerPolicy
    ].join('/');
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
