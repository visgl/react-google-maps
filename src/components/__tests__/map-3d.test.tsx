import {initialize} from '@googlemaps/jest-mocks';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import {Map3D} from '../map-3d';
import {useMapsLibrary} from '../../hooks/use-maps-library';
import {APIProviderContext} from '../api-provider';
import {APILoadingStatus} from '../../libraries/api-loading-status';

jest.mock('../../hooks/use-maps-library');

let useMapsLibraryMock: jest.MockedFn<typeof useMapsLibrary>;

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

beforeEach(() => {
  initialize();

  useMapsLibraryMock = jest.mocked(useMapsLibrary);
  // Return null to prevent element creation (library not loaded)
  useMapsLibraryMock.mockReturnValue(null);

  // Mock customElements.whenDefined to never resolve
  jest.spyOn(customElements, 'whenDefined').mockImplementation(
    () => new Promise(() => {}) // Never resolves
  );
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('Map3D', () => {
  test('renders container div with data-testid', () => {
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
  });

  test('applies id prop to container', () => {
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
  });

  test('applies className prop to container', () => {
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
  });

  test('applies style prop to container', () => {
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
  });

  test('does not render children when map is not ready', () => {
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

    // Children should NOT be rendered when map3d element isn't available
    // (they need the Map3D context which requires the element)
    expect(screen.queryByTestId('child-element')).not.toBeInTheDocument();
  });
});
