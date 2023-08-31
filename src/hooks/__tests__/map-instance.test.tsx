import React from 'react';
import '@testing-library/jest-dom';
import {renderHook} from '@testing-library/react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';

import {useGoogleMap} from '../map-instance';
import {
  APILoadingStatus,
  APIProviderContext,
  APIProviderContextValue
} from '../../components/api-provider';
import {Map as GoogleMap} from '../../components/map';

let MockApiContextProvider: ({
  children
}: {
  children: React.ReactNode;
}) => JSX.Element | null;
let mockContextValue: jest.MockedObject<APIProviderContextValue>;
let createMapSpy: jest.Mock<
  void,
  ConstructorParameters<typeof google.maps.Map>
>;

beforeEach(() => {
  // initialize @googlemaps/jest-mocks
  initialize();

  mockContextValue = {
    status: APILoadingStatus.LOADED,
    mapInstances: {},
    addMapInstance: jest.fn(),
    removeMapInstance: jest.fn(),
    clearMapInstances: jest.fn()
  };

  MockApiContextProvider = ({children}: {children: React.ReactNode}) => (
    <APIProviderContext.Provider value={mockContextValue}>
      {children}
    </APIProviderContext.Provider>
  );

  // override the google.maps.Map constructor with a spied-on version
  createMapSpy = jest.fn();
  google.maps.Map = class extends google.maps.Map {
    constructor(...args: ConstructorParameters<typeof google.maps.Map>) {
      createMapSpy(...args);
      super(...args);
    }
  };
});

test('returns the parent map instance when called without id', async () => {
  // Create wrapper component
  const wrapper = ({children}: React.PropsWithChildren) => (
    <MockApiContextProvider>
      <GoogleMap>{children}</GoogleMap>
    </MockApiContextProvider>
  );

  const {result} = renderHook(() => useGoogleMap(), {wrapper});

  const map = mockInstances.get(google.maps.Map).at(-1);

  expect(map).toBeDefined();
  expect(map).toBeInstanceOf(google.maps.Map);

  expect(result.current).toBe(map);
});

test('it should return a map instance by its id', () => {
  const wrapper = ({children}: React.PropsWithChildren) => (
    <MockApiContextProvider>{children}</MockApiContextProvider>
  );

  const map1 = new google.maps.Map(null as never);
  const map2 = new google.maps.Map(null as never);

  mockContextValue.mapInstances = {one: map1, two: map2};

  let renderHookResult = renderHook(() => useGoogleMap(), {wrapper});
  expect(renderHookResult.result.current).toBe(null);

  renderHookResult = renderHook(() => useGoogleMap('one'), {wrapper});
  expect(renderHookResult.result.current).toBe(map1);

  renderHookResult = renderHook(() => useGoogleMap('two'), {wrapper});
  expect(renderHookResult.result.current).toBe(map2);

  renderHookResult = renderHook(() => useGoogleMap('unknown'), {wrapper});
  expect(renderHookResult.result.current).toBe(null);
});
