import React from 'react';
import {act, render, screen} from '@testing-library/react';
import {initialize} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom';

// FIXME: this should no longer be needed with the next version of @googlemaps/jest-mocks
import {importLibraryMock} from '../../libraries/__mocks__/lib/import-library-mock';

import {APIProvider, APIProviderContextValue} from '../api-provider';
import {ApiParams} from '../../libraries/google-maps-api-loader';
import {useApiIsLoaded} from '../../hooks/use-api-is-loaded';
import {APILoadingStatus} from '../../libraries/api-loading-status';
import {useApi} from '../../hooks/use-api';

const apiLoadSpy = jest.fn();
const apiUnloadSpy = jest.fn();

const ApiSpyComponent = () => {
  const api = useApi();
  ApiSpyComponent.spy(api);

  return <></>;
};
ApiSpyComponent.spy = jest.fn();

let triggerMapsApiLoaded: () => void;

jest.mock('../../libraries/google-maps-api-loader', () => {
  class GoogleMapsApiLoader {
    static async load(
      params: ApiParams,
      onLoadingStatusChange: (s: APILoadingStatus) => void
    ): Promise<void> {
      apiLoadSpy(params);
      onLoadingStatusChange(APILoadingStatus.LOADING);

      google.maps.importLibrary = importLibraryMock;
      return new Promise(
        resolve =>
          (triggerMapsApiLoaded = () => {
            resolve();
            onLoadingStatusChange(APILoadingStatus.LOADED);
          })
      );
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
      authReferrerPolicy={'origin'}></APIProvider>
  );

  expect(apiLoadSpy.mock.lastCall[0]).toMatchObject({
    key: 'apikey',
    libraries: 'places,marker',
    v: 'beta',
    language: 'en',
    region: 'us',
    authReferrerPolicy: 'origin'
  });
});

test('passes parameters to GoogleMapsAPILoader', () => {
  render(<APIProvider apiKey={'apikey'}></APIProvider>);

  const actual = apiLoadSpy.mock.lastCall[0];
  expect(Object.keys(actual)).toMatchObject(['key']);
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
      <ApiSpyComponent />
    </APIProvider>
  );

  const apiSpy = ApiSpyComponent.spy;
  expect(apiSpy).toHaveBeenCalled();
  let actual: APIProviderContextValue = apiSpy.mock.lastCall[0];

  expect(actual.status).toEqual(APILoadingStatus.LOADING);
  expect(actual.mapInstances).toEqual({});

  apiSpy.mockReset();
  await act(() => triggerMapsApiLoaded());

  expect(apiSpy).toHaveBeenCalled();

  actual = apiSpy.mock.lastCall[0];
  expect(actual.status).toBe(APILoadingStatus.LOADED);
});

test('map instance management: add, access and remove', async () => {
  render(
    <APIProvider apiKey={'apikey'}>
      <ApiSpyComponent />
    </APIProvider>
  );

  const apiSpy = ApiSpyComponent.spy;

  let actual: APIProviderContextValue = apiSpy.mock.lastCall[0];
  const map1 = new google.maps.Map(null as unknown as HTMLElement);
  const map2 = new google.maps.Map(null as unknown as HTMLElement);

  apiSpy.mockReset();
  await act(() => {
    actual.addMapInstance(map1, 'map-id-1');
    actual.addMapInstance(map2, 'map-id-2');
  });

  expect(apiSpy).toHaveBeenCalled();

  actual = apiSpy.mock.lastCall[0];
  expect(actual.mapInstances['map-id-1']).toBe(map1);
  expect(actual.mapInstances['map-id-2']).toBe(map2);

  apiSpy.mockReset();
  await act(() => {
    actual.removeMapInstance('map-id-1');
  });

  actual = apiSpy.mock.lastCall[0];
  expect(actual.mapInstances).toEqual({'map-id-2': map2});
});
