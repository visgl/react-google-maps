import React, {useContext} from 'react';
import {act, render, screen} from '@testing-library/react';
import {initialize} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom';

// FIXME: this should no longer be needed with the next version of @googlemaps/jest-mocks
import {importLibraryMock} from '../../libraries/__mocks__/lib/import-library-mock';

import {
  APIProvider,
  APIProviderContext,
  APIProviderContextValue
} from '../api-provider';
import {ApiParams} from '../../libraries/google-maps-api-loader';
import {useApiIsLoaded} from '../../hooks/use-api-is-loaded';
import {APILoadingStatus} from '../../libraries/api-loading-status';

const apiLoadSpy = jest.fn();
const apiUnloadSpy = jest.fn();

const ContextSpyComponent = () => {
  const context = useContext(APIProviderContext);
  ContextSpyComponent.spy(context);

  return <></>;
};
ContextSpyComponent.spy = jest.fn();

let triggerMapsApiLoaded: () => void;
let triggerLoadingFailed: () => void;

jest.mock('../../libraries/google-maps-api-loader', () => {
  class GoogleMapsApiLoader {
    static async load(
      params: ApiParams,
      onLoadingStatusChange: (s: APILoadingStatus) => void
    ): Promise<void> {
      apiLoadSpy(params);
      onLoadingStatusChange(APILoadingStatus.LOADING);

      google.maps.importLibrary = importLibraryMock;

      return new Promise((resolve, reject) => {
        triggerLoadingFailed = () => {
          reject();
          onLoadingStatusChange(APILoadingStatus.FAILED);
        };

        triggerMapsApiLoaded = () => {
          resolve();
          onLoadingStatusChange(APILoadingStatus.LOADED);
        };
      });
    }

    static unload() {
      apiUnloadSpy();
    }
  }

  return {__esModule: true, GoogleMapsApiLoader};
});

beforeEach(() => {
  initialize();
  jest.clearAllMocks();
});

test('passes parameters to GoogleMapsAPILoader', () => {
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

  expect(apiLoadSpy.mock.lastCall[0]).toMatchObject({
    key: 'apikey',
    libraries: 'places,marker',
    v: 'beta',
    language: 'en',
    region: 'us',
    solutionChannel: 'test-channel_value',
    authReferrerPolicy: 'origin'
  });
});

test('passes parameters to GoogleMapsAPILoader', () => {
  render(<APIProvider apiKey={'apikey'} version={'version'}></APIProvider>);

  const actual = apiLoadSpy.mock.lastCall[0];
  expect(actual).toMatchObject({key: 'apikey', v: 'version'});
});

test('uses default solutionChannel', () => {
  render(<APIProvider apiKey={'apikey'}></APIProvider>);

  const actual = apiLoadSpy.mock.lastCall[0];
  expect(actual.solutionChannel).toBe('GMP_visgl_rgmlibrary_v1_default');
});

test("doesn't set solutionChannel when specified as empty string", () => {
  render(<APIProvider apiKey={'apikey'} solutionChannel={''}></APIProvider>);

  const actual = apiLoadSpy.mock.lastCall[0];
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

  await act(() => triggerMapsApiLoaded());

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
  await act(() => triggerMapsApiLoaded());

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

  await act(() => triggerLoadingFailed());

  expect(onErrorMock).toHaveBeenCalled();
});
