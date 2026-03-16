import {initialize} from '@googlemaps/jest-mocks';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import {Map3D} from '../map-3d';
import {useMapsLibrary} from '../../hooks/use-maps-library';
import {APIProviderContext} from '../api-provider';
import {APILoadingStatus} from '../../libraries/api-loading-status';
import {Map3DElement} from './__utils__/map-3d-mocks';

jest.mock('../../hooks/use-maps-library');

// ============================================================================
// Type declarations for test-specific global factory functions
// ============================================================================

declare global {
  var __map3dFactory: ((instance: Map3DElement) => void) | undefined;
}

let useMapsLibraryMock: jest.MockedFn<typeof useMapsLibrary>;
let createMap3DSpy: jest.Mock;

// ============================================================================
// Module-level: Register custom elements ONCE per test file
// ============================================================================

// Extend mock class to add spy functionality via factory pattern
class SpyMap3DElement extends Map3DElement {
  constructor(options?: google.maps.maps3d.Map3DElementOptions) {
    super(options);
    if (typeof globalThis.__map3dFactory === 'function') {
      globalThis.__map3dFactory(this);
    }
  }
}

// Register spy-enabled version of the mock component
if (!customElements.get('gmp-map-3d')) {
  customElements.define('gmp-map-3d', SpyMap3DElement);
}

// Create a mock context value that satisfies APIProviderContext
const createMockContextValue = () => ({
  status: APILoadingStatus.LOADED,
  loadedLibraries: {},
  importLibrary: jest.fn(),
  addLoadedLibrary: jest.fn(),
  mapInstances: {},
  addMapInstance: jest.fn(),
  removeMapInstance: jest.fn(),
  clearMapInstances: jest.fn(),
  map3dInstances: {},
  addMap3DInstance: jest.fn(),
  removeMap3DInstance: jest.fn(),
  clearMap3DInstances: jest.fn(),
  internalUsageAttributionIds: null
});

// ============================================================================
// Test-level: Create fresh spies for each test
// ============================================================================

beforeEach(() => {
  initialize();

  // Create fresh spy for this test
  createMap3DSpy = jest.fn();

  // Attach spy to the custom element constructor via factory function
  globalThis.__map3dFactory = (instance: Map3DElement) => {
    createMap3DSpy(instance);
  };

  useMapsLibraryMock = jest.mocked(useMapsLibrary);
  // Return empty object (library is no longer used in web component approach)
  useMapsLibraryMock.mockReturnValue({} as google.maps.Maps3DLibrary);

  // Mock customElements.whenDefined to resolve immediately
  jest
    .spyOn(customElements, 'whenDefined')
    .mockResolvedValue(SpyMap3DElement as unknown as CustomElementConstructor);
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();

  // Clean up factory function
  delete globalThis.__map3dFactory;
});

describe('Map3D', () => {
  test('creates gmp-map-3d element when rendered', async () => {
    render(
      <APIProviderContext.Provider value={createMockContextValue()}>
        <Map3D
          mode="SATELLITE"
          center={{lat: 37.7749, lng: -122.4194, altitude: 0}}
          range={1000}
        />
      </APIProviderContext.Provider>
    );

    // Wait for the custom element to be instantiated
    await waitFor(() => {
      expect(createMap3DSpy).toHaveBeenCalled();
    });

    // Verify we got the map3d instance
    const map3dInstance = createMap3DSpy.mock.calls[0][0];
    expect(map3dInstance).toBeInstanceOf(Map3DElement);
    expect(map3dInstance.tagName.toLowerCase()).toBe('gmp-map-3d');
  });

  test('renders container div with data-testid', async () => {
    render(
      <APIProviderContext.Provider value={createMockContextValue()}>
        <Map3D
          mode="SATELLITE"
          center={{lat: 37.7749, lng: -122.4194, altitude: 0}}
          range={1000}
        />
      </APIProviderContext.Provider>
    );

    expect(screen.getByTestId('map-3d')).toBeInTheDocument();

    // Wait for async state updates to complete
    await waitFor(() => {
      expect(createMap3DSpy).toHaveBeenCalled();
    });
  });

  test('applies id prop to container', async () => {
    render(
      <APIProviderContext.Provider value={createMockContextValue()}>
        <Map3D
          id="my-map"
          mode="SATELLITE"
          center={{lat: 37.7749, lng: -122.4194, altitude: 0}}
          range={1000}
        />
      </APIProviderContext.Provider>
    );

    expect(screen.getByTestId('map-3d')).toHaveAttribute('id', 'my-map');

    // Wait for async state updates to complete
    await waitFor(() => {
      expect(createMap3DSpy).toHaveBeenCalled();
    });
  });

  test('applies className prop to container', async () => {
    render(
      <APIProviderContext.Provider value={createMockContextValue()}>
        <Map3D
          className="custom-class"
          mode="SATELLITE"
          center={{lat: 37.7749, lng: -122.4194, altitude: 0}}
          range={1000}
        />
      </APIProviderContext.Provider>
    );

    expect(screen.getByTestId('map-3d')).toHaveClass('custom-class');

    // Wait for async state updates to complete
    await waitFor(() => {
      expect(createMap3DSpy).toHaveBeenCalled();
    });
  });

  test('applies style prop to container', async () => {
    render(
      <APIProviderContext.Provider value={createMockContextValue()}>
        <Map3D
          style={{border: '1px solid red'}}
          mode="SATELLITE"
          center={{lat: 37.7749, lng: -122.4194, altitude: 0}}
          range={1000}
        />
      </APIProviderContext.Provider>
    );

    const container = screen.getByTestId('map-3d');
    // Should have both default and custom styles
    expect(container).toHaveStyle({border: '1px solid red'});

    // Wait for async state updates to complete
    await waitFor(() => {
      expect(createMap3DSpy).toHaveBeenCalled();
    });
  });

  test('renders children after map element is ready', async () => {
    render(
      <APIProviderContext.Provider value={createMockContextValue()}>
        <Map3D
          mode="SATELLITE"
          center={{lat: 37.7749, lng: -122.4194, altitude: 0}}
          range={1000}>
          <div data-testid="child-element">Child content</div>
        </Map3D>
      </APIProviderContext.Provider>
    );

    // Wait for map to be ready and children to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });

    // Verify children have access to the map3d element via context
    expect(createMap3DSpy).toHaveBeenCalled();
  });
});
