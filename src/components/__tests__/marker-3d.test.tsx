import {initialize} from '@googlemaps/jest-mocks';
import {render, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import {Marker3D} from '../marker-3d';
import {useMap3D} from '../../hooks/use-map-3d';
import {useMapsLibrary} from '../../hooks/use-maps-library';
import {
  Marker3DElement,
  Marker3DInteractiveElement
} from './__utils__/map-3d-mocks';

jest.mock('../../hooks/use-map-3d');
jest.mock('../../hooks/use-maps-library');

// ============================================================================
// Type declarations for test-specific global factory functions
// ============================================================================

declare global {
  var __marker3dFactory: ((instance: Marker3DElement) => void) | undefined;
  var __marker3dInteractiveFactory:
    | ((instance: Marker3DInteractiveElement) => void)
    | undefined;
}

let useMap3DMock: jest.MockedFn<typeof useMap3D>;
let useMapsLibraryMock: jest.MockedFn<typeof useMapsLibrary>;
let createMarkerSpy: jest.Mock;
let createInteractiveMarkerSpy: jest.Mock;
let mockMap3D: {appendChild: jest.Mock; removeChild: jest.Mock};

// ============================================================================
// Module-level: Register custom elements ONCE per test file
// ============================================================================

// Extend mock classes to add spy functionality via factory pattern
class SpyMarker3DElement extends Marker3DElement {
  constructor(options?: google.maps.maps3d.Marker3DElementOptions) {
    super(options);
    if (typeof globalThis.__marker3dFactory === 'function') {
      globalThis.__marker3dFactory(this);
    }
  }
}

class SpyMarker3DInteractiveElement extends Marker3DInteractiveElement {
  constructor(options?: google.maps.maps3d.Marker3DInteractiveElementOptions) {
    super(options);
    if (typeof globalThis.__marker3dInteractiveFactory === 'function') {
      globalThis.__marker3dInteractiveFactory(this);
    }
  }
}

// Register spy-enabled versions of the mock components
if (!customElements.get('gmp-marker-3d')) {
  customElements.define('gmp-marker-3d', SpyMarker3DElement);
}

if (!customElements.get('gmp-marker-3d-interactive')) {
  customElements.define(
    'gmp-marker-3d-interactive',
    SpyMarker3DInteractiveElement
  );
}

// ============================================================================
// Test-level: Create fresh spies for each test
// ============================================================================

beforeEach(() => {
  initialize();

  // Create fresh spies for this test
  createMarkerSpy = jest.fn();
  createInteractiveMarkerSpy = jest.fn();

  // Attach spies to the custom element constructors via factory functions
  globalThis.__marker3dFactory = (instance: Marker3DElement) => {
    createMarkerSpy(instance);
  };

  globalThis.__marker3dInteractiveFactory = (
    instance: Marker3DInteractiveElement
  ) => {
    createInteractiveMarkerSpy(instance);
  };

  // Mock map3d element
  mockMap3D = {
    appendChild: jest.fn(),
    removeChild: jest.fn()
  };

  // Setup hook mocks
  useMap3DMock = jest.mocked(useMap3D);
  useMapsLibraryMock = jest.mocked(useMapsLibrary);

  // Return mock map3d and library (library is no longer used in web component approach)
  useMap3DMock.mockReturnValue(
    mockMap3D as unknown as google.maps.maps3d.Map3DElement
  );
  useMapsLibraryMock.mockReturnValue(
    {} as unknown as google.maps.Maps3DLibrary
  );
});

afterEach(() => {
  jest.clearAllMocks();

  // Clean up factory functions
  delete globalThis.__marker3dFactory;
  delete globalThis.__marker3dInteractiveFactory;
});

describe('Marker3D', () => {
  test('creates gmp-marker-3d element when rendered', async () => {
    render(<Marker3D position={{lat: 37.7749, lng: -122.4194}} label="Test" />);

    // Wait for the custom element to be instantiated
    await waitFor(() => {
      expect(createMarkerSpy).toHaveBeenCalled();
    });

    // Verify we got the marker instance
    const markerInstance = createMarkerSpy.mock.calls[0][0];
    expect(markerInstance).toBeInstanceOf(Marker3DElement);
    expect(markerInstance.tagName.toLowerCase()).toBe('gmp-marker-3d');
  });

  test('creates gmp-marker-3d-interactive when onClick provided', async () => {
    const onClick = jest.fn();

    render(
      <Marker3D position={{lat: 37.7749, lng: -122.4194}} onClick={onClick} />
    );

    // Wait for the interactive custom element to be instantiated
    await waitFor(() => {
      expect(createInteractiveMarkerSpy).toHaveBeenCalled();
    });

    // Verify we got the interactive marker instance
    const markerInstance = createInteractiveMarkerSpy.mock.calls[0][0];
    expect(markerInstance).toBeInstanceOf(Marker3DInteractiveElement);
    expect(markerInstance.tagName.toLowerCase()).toBe(
      'gmp-marker-3d-interactive'
    );

    // Verify regular marker was NOT created
    expect(createMarkerSpy).not.toHaveBeenCalled();
  });

  test('syncs position prop', async () => {
    const {rerender} = render(
      <Marker3D position={{lat: 37.7749, lng: -122.4194}} />
    );

    await waitFor(() => {
      expect(createMarkerSpy).toHaveBeenCalled();
    });

    const marker = createMarkerSpy.mock.calls[0][0];

    rerender(<Marker3D position={{lat: 40.7128, lng: -74.006}} />);

    await waitFor(() => {
      expect(marker.position).toEqual({lat: 40.7128, lng: -74.006});
    });
  });

  test('syncs label prop', async () => {
    const {rerender} = render(
      <Marker3D position={{lat: 37.7749, lng: -122.4194}} label="Initial" />
    );

    await waitFor(() => {
      expect(createMarkerSpy).toHaveBeenCalled();
    });

    const marker = createMarkerSpy.mock.calls[0][0];

    rerender(
      <Marker3D position={{lat: 37.7749, lng: -122.4194}} label="Updated" />
    );

    await waitFor(() => {
      expect(marker.label).toBe('Updated');
    });
  });

  test('exposes marker element via ref', async () => {
    const refCallback = jest.fn();

    render(
      <Marker3D
        position={{lat: 37.7749, lng: -122.4194}}
        onClick={() => {}}
        ref={refCallback}
      />
    );

    await waitFor(() => {
      expect(createInteractiveMarkerSpy).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(refCallback).toHaveBeenCalled();
    });
  });

  test('cleans up on unmount', async () => {
    const {unmount} = render(
      <Marker3D position={{lat: 37.7749, lng: -122.4194}} />
    );

    await waitFor(() => {
      expect(createMarkerSpy).toHaveBeenCalled();
    });

    unmount();

    // Marker should be removed from map
    const marker = createMarkerSpy.mock.calls[0][0];
    expect(marker.parentElement).toBeNull();
  });
});
