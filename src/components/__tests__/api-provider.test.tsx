import React, {useContext} from 'react';
import {act, cleanup, render, screen, waitFor} from '@testing-library/react';
import {
  importLibrary as importLibraryMock,
  initialize
} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom';

import {VERSION} from '../../version';
import {
  __resetModuleState as resetAPIProviderState,
  APIProvider,
  APIProviderContext,
  APIProviderContextValue
} from '../api-provider';

import {useApiIsLoaded} from '../../hooks/use-api-is-loaded';
import {APILoadingStatus} from '../../libraries/api-loading-status';

type ImportLibraryResult = Awaited<
  ReturnType<typeof google.maps.importLibrary>
>;

let importLibraryPromise: Promise<ImportLibraryResult>;
let resolveImportLibrary: (value: ImportLibraryResult) => void;
let rejectImportLibrary: (reason?: unknown) => void;

const resetImportLibraryPromise = () => {
  ({
    promise: importLibraryPromise,
    resolve: resolveImportLibrary,
    reject: rejectImportLibrary
  } = Promise.withResolvers<ImportLibraryResult>());
};

const triggerMapsApiLoaded = () => {
  resolveImportLibrary({} as google.maps.CoreLibrary);
};

const triggerLoadingFailed = () => {
  rejectImportLibrary(new Error('loading failed'));
};

const setOptionsSpy = jest.fn();

jest.mock('@googlemaps/js-api-loader', () => {
  return {
    setOptions: jest.fn((options: Record<string, unknown>) => {
      setOptionsSpy(options);
    }),
    importLibrary: jest.fn(async (name: string) => {
      await importLibraryPromise;

      return importLibraryMock(name);
    })
  };
});

const ContextSpyComponent = () => {
  const context = useContext(APIProviderContext);
  ContextSpyComponent.spy(context);

  return <></>;
};
ContextSpyComponent.spy = jest.fn();

beforeEach(() => {
  initialize();
  jest.clearAllMocks();
  // @ts-expect-error - accessing mock implementation
  window.google.maps.importLibrary = undefined;
  resetAPIProviderState();
  resetImportLibraryPromise();
});

afterEach(() => {
  cleanup();
});

test('passes parameters to GoogleMapsAPILoader', async () => {
  render(
    <APIProvider
      apiKey={'apikey'}
      libraries={['places', 'marker']}
      version={'beta'}
      language={'en'}
      region={'us'}
      solutionChannel={'test-channel_value'}
      authReferrerPolicy={'origin'}></APIProvider>
  );

  await waitFor(() => expect(setOptionsSpy).toHaveBeenCalled());

  expect(setOptionsSpy.mock.lastCall[0]).toMatchObject({
    key: 'apikey',
    libraries: ['places', 'marker'],
    v: 'beta',
    language: 'en',
    region: 'us',
    solutionChannel: 'test-channel_value',
    authReferrerPolicy: 'origin'
  });
});

test('passes parameters to GoogleMapsAPILoader', async () => {
  render(<APIProvider apiKey={'apikey'} version={'version'}></APIProvider>);

  await waitFor(() => expect(setOptionsSpy).toHaveBeenCalled());

  const actual = setOptionsSpy.mock.lastCall[0];
  expect(actual).toMatchObject({key: 'apikey', v: 'version'});
});

test('uses default solutionChannel', async () => {
  render(<APIProvider apiKey={'apikey'}></APIProvider>);

  await waitFor(() => expect(setOptionsSpy).toHaveBeenCalled());

  const actual = setOptionsSpy.mock.lastCall[0];
  expect(actual.solutionChannel).toBe('GMP_visgl_rgmlibrary_v1_default');
});

test("doesn't set solutionChannel when specified as empty string", async () => {
  render(<APIProvider apiKey={'apikey'} solutionChannel={''}></APIProvider>);

  await waitFor(() => expect(setOptionsSpy).toHaveBeenCalled());

  const actual = setOptionsSpy.mock.lastCall[0];
  expect(actual).not.toHaveProperty('solutionChannel');
});

test('renders inner components', async () => {
  const LoadingStatus = () => {
    const mapsLoaded = useApiIsLoaded();
    return <span>{mapsLoaded ? 'loaded' : 'not loaded'}</span>;
  };

  render(
    <APIProvider apiKey={'apikey'}>
      <LoadingStatus />
    </APIProvider>
  );

  expect(screen.getByText('not loaded')).toBeInTheDocument();

  await act(async () => {
    triggerMapsApiLoaded();
  });

  expect(screen.getByText('loaded')).toBeInTheDocument();
});

test('provides context values', async () => {
  render(
    <APIProvider apiKey={'apikey'}>
      <ContextSpyComponent />
    </APIProvider>
  );

  const contextSpy = ContextSpyComponent.spy;
  expect(contextSpy).toHaveBeenCalled();
  let actualContext: APIProviderContextValue = contextSpy.mock.lastCall[0];

  expect(actualContext.status).toEqual(APILoadingStatus.LOADING);
  expect(actualContext.mapInstances).toEqual({});

  contextSpy.mockReset();

  await act(async () => {
    triggerMapsApiLoaded();
  });

  expect(contextSpy).toHaveBeenCalled();

  actualContext = contextSpy.mock.lastCall[0];
  expect(actualContext.status).toBe(APILoadingStatus.LOADED);
});

test('map instance management: add, access and remove', async () => {
  render(
    <APIProvider apiKey={'apikey'}>
      <ContextSpyComponent />
    </APIProvider>
  );

  const contextSpy = ContextSpyComponent.spy;

  let actualContext: APIProviderContextValue = contextSpy.mock.lastCall[0];
  const map1 = new google.maps.Map(null as unknown as HTMLElement);
  const map2 = new google.maps.Map(null as unknown as HTMLElement);

  contextSpy.mockReset();
  await act(() => {
    actualContext.addMapInstance(map1, 'map-id-1');
    actualContext.addMapInstance(map2, 'map-id-2');
  });

  expect(contextSpy).toHaveBeenCalled();

  actualContext = contextSpy.mock.lastCall[0];
  expect(actualContext.mapInstances['map-id-1']).toBe(map1);
  expect(actualContext.mapInstances['map-id-2']).toBe(map2);

  contextSpy.mockReset();
  await act(() => {
    actualContext.removeMapInstance('map-id-1');
  });

  actualContext = contextSpy.mock.lastCall[0];
  expect(actualContext.mapInstances).toEqual({'map-id-2': map2});
});

test('calls onError when loading the Google Maps JavaScript API fails', async () => {
  const onErrorMock = jest.fn();

  render(<APIProvider apiKey={'apikey'} onError={onErrorMock}></APIProvider>);

  triggerLoadingFailed();

  await waitFor(() => expect(onErrorMock).toHaveBeenCalled());
});

test('sets fetchAppCheckToken on google.maps.Settings after API loads', async () => {
  const mockFetchToken = jest
    .fn()
    .mockResolvedValue({token: 'test-token'});

  // Set up the Settings mock
  const settingsInstance = {fetchAppCheckToken: null as (() => Promise<google.maps.MapsAppCheckTokenResult>) | null};
  google.maps.Settings = {
    getInstance: () => settingsInstance
  } as unknown as typeof google.maps.Settings;

  render(
    <APIProvider apiKey={'apikey'} fetchAppCheckToken={mockFetchToken}>
      <ContextSpyComponent />
    </APIProvider>
  );

  await act(async () => {
    triggerMapsApiLoaded();
  });

  expect(settingsInstance.fetchAppCheckToken).toBe(mockFetchToken);
});

describe('internalUsageAttributionIds', () => {
  test('provides default attribution IDs in context', () => {
    render(
      <APIProvider apiKey={'apikey'}>
        <ContextSpyComponent />
      </APIProvider>
    );

    const contextSpy = ContextSpyComponent.spy;
    const actualContext: APIProviderContextValue = contextSpy.mock.lastCall[0];

    expect(actualContext.internalUsageAttributionIds).toEqual([
      `gmp_visgl_reactgooglemaps_v${VERSION}`
    ]);
  });

  test('sets internalUsageAttributionIds to null when disableUsageAttribution is true', () => {
    render(
      <APIProvider apiKey={'apikey'} disableUsageAttribution>
        <ContextSpyComponent />
      </APIProvider>
    );

    const contextSpy = ContextSpyComponent.spy;
    const actualContext: APIProviderContextValue = contextSpy.mock.lastCall[0];

    expect(actualContext.internalUsageAttributionIds).toBeNull();
  });
});
