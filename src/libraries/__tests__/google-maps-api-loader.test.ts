import {APILoadingStatus} from '../api-loading-status';

let GoogleMapsApiLoader: typeof import('../google-maps-api-loader').GoogleMapsApiLoader;

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
  });

  afterEach(() => {
    // clean up JSDOM after tests
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    delete window.__googleMapsCallback__;
    delete window.gm_authFailure;
    (window.google as unknown) = undefined;
  });

  test.each([
    {
      params: {key: 'xyza'},
      expected: {key: 'xyza', callback: '__googleMapsCallback__'}
    },
    {
      params: {
        key: 'abcd',
        v: 'version',
        language: 'language',
        region: 'region',
        solutionChannel: 'solutionChannel',
        authReferrerPolicy: 'origin'
      },
      expected: {
        key: 'abcd',
        v: 'version',
        language: 'language',
        region: 'region',
        auth_referrer_policy: 'origin',
        solution_channel: 'solutionChannel',
        callback: '__googleMapsCallback__'
      }
    }
  ])('creates script-tag with parameters', async ({params, expected}) => {
    void GoogleMapsApiLoader.load(params, jest.fn());

    expect(window.__googleMapsCallback__).toBeDefined();
    expect(window.gm_authFailure).toBeDefined();

    const el = document.querySelector('script') as HTMLScriptElement;
    const url = new URL(el.src);

    expect(url.origin).toBe('https://maps.googleapis.com');
    expect(url.pathname).toBe('/maps/api/js');

    const actualParams = Object.fromEntries(url.searchParams.entries());
    expect(actualParams).toMatchObject(expected);
  });

  test('loads specified libraries', async () => {
    const statusCallback = jest.fn();
    const promise = GoogleMapsApiLoader.load(
      {key: 'abc', libraries: 'a,b,c'},
      statusCallback
    );

    expect(statusCallback).toHaveBeenCalledWith(APILoadingStatus.LOADING);

    // mock API being loaded
    const importLibraryMock = jest.fn();
    google.maps.importLibrary = importLibraryMock;
    window.__googleMapsCallback__!();

    // allow for internal promise .then() callbacks to run
    await timeout();

    expect(statusCallback).toHaveBeenCalledTimes(2);
    expect(statusCallback).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    expect(await promise.then(() => true)).toBeTruthy();

    expect(importLibraryMock).toHaveBeenCalledTimes(4);
    const loadedLibraries = importLibraryMock.mock.calls.flat();
    expect(loadedLibraries).toEqual(['maps', 'a', 'b', 'c']);
  });

  test('handles multiple calls properly', async () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const promise1 = GoogleMapsApiLoader.load({key: 'abc'}, callback1);
    const promise2 = GoogleMapsApiLoader.load({key: 'abc'}, callback2);

    // mock API being loaded
    google.maps.importLibrary = jest.fn();
    window.__googleMapsCallback__!();

    // allow for internal promise .then() callbacks to run
    await timeout();

    expect(callback1).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    expect(callback2).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);

    expect(
      await Promise.all([promise1, promise2]).then(() => true)
    ).toBeTruthy();
  });

  test('handle multiple calls when already loaded', async () => {
    const callback1 = jest.fn();
    const promise1 = GoogleMapsApiLoader.load({key: 'abc'}, callback1);

    // mock API being loaded
    google.maps.importLibrary = jest.fn();
    window.__googleMapsCallback__!();

    // allow for internal promise .then() callbacks to run
    await timeout();

    expect(await promise1.then(() => true)).toBeTruthy();

    const callback2 = jest.fn();
    const promise2 = GoogleMapsApiLoader.load({key: 'abc'}, callback2);

    expect(callback1).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    expect(callback2).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    expect(await promise2.then(() => true)).toBeTruthy();
  });

  test('logs a warning when called multiple times with different parameters', async () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const callback1 = jest.fn();
    void GoogleMapsApiLoader.load({key: 'abc'}, callback1);

    expect(consoleWarnSpy).not.toHaveBeenCalled();

    const callback2 = jest.fn();
    void GoogleMapsApiLoader.load({key: 'def'}, callback2);

    // mock API being loaded
    google.maps.importLibrary = jest.fn();
    window.__googleMapsCallback__!();

    await timeout();

    expect(consoleWarnSpy.mock.calls).toMatchSnapshot();
    consoleWarnSpy.mockRestore();
  });

  test('treat externally loaded maps API as loaded', async () => {
    // mock API having already been loaded
    global.google = {maps: {importLibrary: jest.fn()}} as never;

    const callback = jest.fn();
    const promise = GoogleMapsApiLoader.load({key: 'abc'}, callback);

    await timeout();

    expect(callback).toHaveBeenLastCalledWith(APILoadingStatus.LOADED);
    expect(await promise.then(() => true)).toBeTruthy();
  });

  test('handle gm_authFailure', async () => {
    const callback = jest.fn();
    void GoogleMapsApiLoader.load({key: 'abc'}, callback);

    // mock API being loaded
    google.maps.importLibrary = jest.fn();
    window.__googleMapsCallback__!();

    await timeout();

    // mock auth failure
    window.gm_authFailure!();

    expect(callback).toHaveBeenLastCalledWith(APILoadingStatus.AUTH_FAILURE);
  });

  test.todo('handle loading error');
  test.todo('handle CSP script nonce');
});
