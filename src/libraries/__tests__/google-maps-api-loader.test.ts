import {APILoadingStatus} from '../api-loading-status';
import {setOptions, importLibrary} from '@googlemaps/js-api-loader';

let GoogleMapsApiLoader: typeof import('../google-maps-api-loader').GoogleMapsApiLoader;

jest.mock('@googlemaps/js-api-loader');

const mockedSetOptions = jest.mocked(setOptions);
const mockedImportLibrary = jest.mocked(importLibrary);

const timeout = (t: number = 0) =>
  new Promise<void>(resolve => global.setTimeout(resolve, t));

describe('GoogleMapsApiLoader', () => {
  beforeEach(async () => {
    // GoogleMapsApiLoader uses state stored in private static properties, so we have to
    // isolate it so the internal state doesn't crosstalk into other tests.
    await jest.isolateModulesAsync(async () => {
      GoogleMapsApiLoader = (await import('../google-maps-api-loader'))
        .GoogleMapsApiLoader;
    });

    mockedSetOptions.mockImplementation(() => {});
    mockedImportLibrary.mockImplementation(() =>
      Promise.resolve(undefined as never)
    );
  });

  afterEach(() => {
    // clean up JSDOM after tests (still relevant for general document state even if script tag isn't checked)
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // These globals are still defined by our loader, so we need to clean them up.
    delete window.__googleMapsCallback__;
    delete window.gm_authFailure;
    (window.google as unknown) = undefined;

    jest.clearAllMocks();
  });

  test('calls setOptions and importLibrary with parameters', async () => {
    const params = {
      key: 'abcd',
      v: 'version',
      language: 'language',
      region: 'region',
      solutionChannel: 'solutionChannel',
      authReferrerPolicy: 'origin',
      libraries: 'a,b,c',
      channel: 123
    };
    const statusCallback = jest.fn();
    await GoogleMapsApiLoader.load(params, statusCallback);

    expect(window.__googleMapsCallback__).toBeDefined();
    expect(window.gm_authFailure).toBeDefined();

    expect(mockedSetOptions).toHaveBeenCalledTimes(1);
    expect(mockedSetOptions).toHaveBeenCalledWith({
      key: params.key,
      v: params.v,
      language: params.language,
      region: params.region,
      solutionChannel: params.solutionChannel,
      authReferrerPolicy: params.authReferrerPolicy,
      libraries: ['a', 'b', 'c'], // should be an array
      channel: String(params.channel) // should be a string
    });

    expect(mockedImportLibrary).toHaveBeenCalledTimes(4); // 'maps', 'a', 'b', 'c'
    expect(mockedImportLibrary).toHaveBeenCalledWith('maps');
    expect(mockedImportLibrary).toHaveBeenCalledWith('a');
    expect(mockedImportLibrary).toHaveBeenCalledWith('b');
    expect(mockedImportLibrary).toHaveBeenCalledWith('c');
  });

  test('loads specified libraries and handles callbacks', async () => {
    const statusCallback = jest.fn();
    const promise = GoogleMapsApiLoader.load(
      {key: 'abc', libraries: 'a,b,c'},
      statusCallback
    );

    expect(statusCallback).toHaveBeenCalledWith(APILoadingStatus.LOADING);

    // Call the global callback as if Google Maps API loaded
    window.__googleMapsCallback__!();

    // allow for internal promise .then() callbacks to run
    await timeout();

    expect(statusCallback).toHaveBeenCalledTimes(2);
    expect(statusCallback).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    await promise; // Ensure the promise resolves
  });

  test('handles multiple calls properly', async () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const promise1 = GoogleMapsApiLoader.load({key: 'abc'}, callback1);

    // Simulate API loading
    window.__googleMapsCallback__!();
    await timeout();

    const promise2 = GoogleMapsApiLoader.load({key: 'abc'}, callback2);

    await Promise.all([promise1, promise2]);

    expect(callback1).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    expect(callback2).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    expect(mockedSetOptions).toHaveBeenCalledTimes(1); // Should only be called once
  });

  test('handle multiple calls when already loaded', async () => {
    const callback1 = jest.fn();
    await GoogleMapsApiLoader.load({key: 'abc'}, callback1); // This will call __googleMapsCallback__ internally

    const callback2 = jest.fn();
    await GoogleMapsApiLoader.load({key: 'abc'}, callback2);

    expect(callback1).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    expect(callback2).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    expect(mockedSetOptions).toHaveBeenCalledTimes(1); // Should still only be called once
  });

  test('logs a warning when called multiple times with different parameters', async () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    void GoogleMapsApiLoader.load({key: 'abc'}, jest.fn());
    expect(consoleWarnSpy).not.toHaveBeenCalled();

    void GoogleMapsApiLoader.load({key: 'def'}, jest.fn());

    window.__googleMapsCallback__!(); // Simulate loading to clear pending state
    await timeout();

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1); // Expect only one warning
    expect(consoleWarnSpy.mock.calls).toMatchSnapshot();
    consoleWarnSpy.mockRestore();
  });

  test('treat externally loaded maps API as loaded', async () => {
    // mock API having already been loaded (before our loader attempts to load)
    global.google = {maps: {importLibrary: mockedImportLibrary}} as never;

    const callback = jest.fn();
    await GoogleMapsApiLoader.load({key: 'abc'}, callback);

    expect(callback).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    expect(mockedSetOptions).not.toHaveBeenCalled(); // setOptions should not be called if external loader is present
    expect(mockedImportLibrary).toHaveBeenCalledWith('maps'); // 'maps' should still be imported
  });

  test('handle gm_authFailure', async () => {
    const callback = jest.fn();
    const promise = GoogleMapsApiLoader.load({key: 'abc'}, callback);

    // Simulate auth failure
    window.gm_authFailure!();

    await promise;
    expect(callback).toHaveBeenLastCalledWith(APILoadingStatus.AUTH_FAILURE);
  });

  test('handles loading error from importLibrary', async () => {
    const error = new Error('importLibrary failed');
    mockedImportLibrary.mockRejectedValueOnce(error); // Mock just for this test

    const callback = jest.fn();
    const promise = GoogleMapsApiLoader.load({key: 'abc'}, callback);

    await expect(promise).rejects.toBe(error);
    expect(callback).toHaveBeenLastCalledWith(APILoadingStatus.FAILED);
    expect(mockedSetOptions).toHaveBeenCalledTimes(1);
    expect(mockedImportLibrary).toHaveBeenCalledTimes(1); // Only for 'maps' before it rejects
  });

  test.todo('handle CSP script nonce');
});
