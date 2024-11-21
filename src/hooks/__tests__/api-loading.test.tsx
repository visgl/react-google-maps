import React, {FunctionComponent, PropsWithChildren} from 'react';
import {initialize} from '@googlemaps/jest-mocks';
import {renderHook} from '@testing-library/react';

import {
  APIProviderContext,
  APIProviderContextValue
} from '../../components/api-provider';

import {useApiLoadingStatus} from '../use-api-loading-status';
import {useApiIsLoaded} from '../use-api-is-loaded';
import {APILoadingStatus} from '../../libraries/api-loading-status';

let wrapper: FunctionComponent<PropsWithChildren>;
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
    clearMapInstances: jest.fn()
  };

  wrapper = ({children}) => (
    <APIProviderContext.Provider value={mockContextValue}>
      {children}
    </APIProviderContext.Provider>
  );
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe('useApiIsLoaded()', () => {
  it('should return false when loading', () => {
    mockContextValue.status = APILoadingStatus.LOADING;
    const {result} = renderHook(() => useApiIsLoaded(), {
      wrapper
    });
    expect(result.current).toBe(false);
  });

  it('should return true when loaded', () => {
    mockContextValue.status = APILoadingStatus.LOADED;
    const {result} = renderHook(() => useApiIsLoaded(), {
      wrapper
    });
    expect(result.current).toBe(true);
  });
});

describe('useApiLoadingStatus()', () => {
  it('returns the loading status', () => {
    mockContextValue.status = APILoadingStatus.NOT_LOADED;
    const {result} = renderHook(() => useApiLoadingStatus(), {
      wrapper
    });
    expect(result.current).toBe(APILoadingStatus.NOT_LOADED);
  });
});

describe('useMapsLibrary()', () => {
  test.todo('returns library loading status');
  test.todo('calls importLibrary for libraries not yet loaded');
});
