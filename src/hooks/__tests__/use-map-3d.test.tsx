import {initialize} from '@googlemaps/jest-mocks';
import {renderHook} from '@testing-library/react';
import React, {ReactNode} from 'react';

import {
  APIProviderContext,
  APIProviderContextValue
} from '../../components/api-provider';
import {GoogleMaps3DContext} from '../../components/map-3d';
import {useMap3D} from '../use-map-3d';
import {APILoadingStatus} from '../../libraries/api-loading-status';

let wrapper: ({children}: {children: ReactNode}) => React.ReactNode;
let mockContextValue: jest.MockedObject<APIProviderContextValue>;

beforeEach(() => {
  initialize();

  mockContextValue = {
    importLibrary: jest.fn(),
    loadedLibraries: {},
    status: APILoadingStatus.LOADED,
    mapInstances: {},
    addMapInstance: jest.fn(),
    removeMapInstance: jest.fn(),
    clearMapInstances: jest.fn(),
    map3dInstances: {},
    addMap3DInstance: jest.fn(),
    removeMap3DInstance: jest.fn(),
    clearMap3DInstances: jest.fn()
  } as unknown as jest.MockedObject<APIProviderContextValue>;

  wrapper = ({children}: {children: ReactNode}) => (
    <APIProviderContext.Provider value={mockContextValue}>
      {children}
    </APIProviderContext.Provider>
  );
});

test('returns null when no map3d available', () => {
  const {result} = renderHook(() => useMap3D(), {wrapper});

  expect(result.current).toBe(null);
});

test('returns map3d from parent context', () => {
  const mockMap3D = {} as google.maps.maps3d.Map3DElement;

  const wrapperWithMap3D = ({children}: {children: ReactNode}) => (
    <APIProviderContext.Provider value={mockContextValue}>
      <GoogleMaps3DContext.Provider value={{map3d: mockMap3D}}>
        {children}
      </GoogleMaps3DContext.Provider>
    </APIProviderContext.Provider>
  );

  const {result} = renderHook(() => useMap3D(), {wrapper: wrapperWithMap3D});

  expect(result.current).toBe(mockMap3D);
});

test('returns map3d by id from context', () => {
  const mockMap3D = {} as google.maps.maps3d.Map3DElement;
  mockContextValue.map3dInstances = {'my-map': mockMap3D};

  const {result} = renderHook(() => useMap3D('my-map'), {wrapper});

  expect(result.current).toBe(mockMap3D);
});

test('returns null for unknown id', () => {
  mockContextValue.map3dInstances = {};

  const {result} = renderHook(() => useMap3D('unknown-id'), {wrapper});

  expect(result.current).toBe(null);
});

test('logs error and returns null when used outside APIProvider', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  const {result} = renderHook(() => useMap3D());

  expect(result.current).toBe(null);
  expect(console.error).toHaveBeenCalled();

  jest.mocked(console.error).mockRestore();
});
