import React, {FunctionComponent, PropsWithChildren} from 'react';
import {cleanup, renderHook} from '@testing-library/react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom';

import {useMap} from '../use-map';
import {
  APIProviderContext,
  APIProviderContextValue
} from '../../components/api-provider';
import {Map as GoogleMap} from '../../components/map';
import {APILoadingStatus} from '../../libraries/api-loading-status';

let MockContextProvider: FunctionComponent<PropsWithChildren>;
let mockContextValue: jest.MockedObject<APIProviderContextValue>;
let createMapSpy: jest.Mock<
  void,
  ConstructorParameters<typeof google.maps.Map>
>;

beforeEach(() => {
  initialize();
  jest.clearAllMocks();

  mockContextValue = {
    importLibrary: jest.fn(),
    loadedLibraries: {},
    status: APILoadingStatus.LOADED,
    mapInstances: {},
    addMapInstance: jest.fn(),
    removeMapInstance: jest.fn(),
    clearMapInstances: jest.fn(),
    internalUsageAttributionIds: null
  };

  MockContextProvider = ({children}) => (
    <APIProviderContext.Provider value={mockContextValue}>
      {children}
    </APIProviderContext.Provider>
  );

  createMapSpy = jest.fn();
  google.maps.Map = class extends google.maps.Map {
    constructor(...args: ConstructorParameters<typeof google.maps.Map>) {
      createMapSpy(...args);
      super(...args);
    }
  };
});

afterEach(() => {
  cleanup();
});

test('returns the parent map instance when called without id', () => {
  const wrapper = ({children}: React.PropsWithChildren) => (
    <MockContextProvider>
      <GoogleMap zoom={8} center={{lat: 53.55, lng: 10.05}}>
        {children}
      </GoogleMap>
    </MockContextProvider>
  );

  const {result} = renderHook(() => useMap(), {wrapper});

  const map = mockInstances.get(google.maps.Map).at(-1);

  expect(map).toBeDefined();
  expect(map).toBeInstanceOf(google.maps.Map);

  expect(result.current).toBe(map);
});

test('returns a map instance by its id', () => {
  const wrapper = ({children}: React.PropsWithChildren) => (
    <MockContextProvider>{children}</MockContextProvider>
  );

  const map1 = new google.maps.Map(null as never);
  const map2 = new google.maps.Map(null as never);

  mockContextValue.mapInstances = {one: map1, two: map2};

  let renderHookResult = renderHook(() => useMap(), {wrapper});
  expect(renderHookResult.result.current).toBe(null);

  renderHookResult = renderHook(() => useMap('one'), {wrapper});
  expect(renderHookResult.result.current).toBe(map1);

  renderHookResult = renderHook(() => useMap('two'), {wrapper});
  expect(renderHookResult.result.current).toBe(map2);

  renderHookResult = renderHook(() => useMap('unknown'), {wrapper});
  expect(renderHookResult.result.current).toBe(null);
});

test('logs an error when used outside the APIProvider', () => {
  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  const res = renderHook(() => useMap());
  expect(res.result.current).toBe(null);

  expect(consoleErrorSpy).toHaveBeenCalled();
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});
