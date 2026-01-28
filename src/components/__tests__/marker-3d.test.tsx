import {initialize} from '@googlemaps/jest-mocks';
import {render, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import {Marker3D} from '../marker-3d';
import {useMap3D} from '../../hooks/use-map-3d';
import {useMapsLibrary} from '../../hooks/use-maps-library';

jest.mock('../../hooks/use-map-3d');
jest.mock('../../hooks/use-maps-library');

let useMap3DMock: jest.MockedFn<typeof useMap3D>;
let useMapsLibraryMock: jest.MockedFn<typeof useMapsLibrary>;
let createMarkerSpy: jest.Mock;
let createInteractiveMarkerSpy: jest.Mock;
let mockMap3D: {appendChild: jest.Mock; removeChild: jest.Mock};
let Marker3DElement: unknown;
let Marker3DInteractiveElement: unknown;

beforeEach(() => {
  initialize();

  createMarkerSpy = jest.fn();
  createInteractiveMarkerSpy = jest.fn();

  mockMap3D = {
    appendChild: jest.fn(),
    removeChild: jest.fn()
  };

  // Create mock Marker3DElement
  Marker3DElement = class extends HTMLElement {
    position: google.maps.LatLngLiteral | null = null;
    altitudeMode: string | null = null;
    label: string | null = null;
    collisionBehavior: string | null = null;
    drawsWhenOccluded = false;
    extruded = false;
    sizePreserved = false;
    zIndex: number | null = null;

    constructor() {
      super();
      createMarkerSpy(this);
    }
  };

  // Create mock Marker3DInteractiveElement
  Marker3DInteractiveElement = class extends HTMLElement {
    position: google.maps.LatLngLiteral | null = null;
    altitudeMode: string | null = null;
    label: string | null = null;
    override title = '';
    collisionBehavior: string | null = null;
    drawsWhenOccluded = false;
    extruded = false;
    sizePreserved = false;
    zIndex: number | null = null;

    constructor() {
      super();
      createInteractiveMarkerSpy(this);
    }
  };

  // Register with random names to avoid conflicts
  customElements.define(
    `gmp-marker-3d-${Math.random().toString(36).slice(2)}`,
    Marker3DElement as CustomElementConstructor
  );
  customElements.define(
    `gmp-marker-3d-interactive-${Math.random().toString(36).slice(2)}`,
    Marker3DInteractiveElement as CustomElementConstructor
  );

  useMap3DMock = jest.mocked(useMap3D);
  useMapsLibraryMock = jest.mocked(useMapsLibrary);

  useMap3DMock.mockReturnValue(
    mockMap3D as unknown as google.maps.maps3d.Map3DElement
  );
  useMapsLibraryMock.mockReturnValue({
    Marker3DElement,
    Marker3DInteractiveElement
  } as unknown as google.maps.Maps3DLibrary);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Marker3D', () => {
  test('creates Marker3DElement after map and library ready', async () => {
    render(<Marker3D position={{lat: 37.7749, lng: -122.4194}} label="Test" />);

    await waitFor(() => {
      expect(createMarkerSpy).toHaveBeenCalled();
    });

    expect(mockMap3D.appendChild).toHaveBeenCalled();
  });

  test('creates Marker3DInteractiveElement when onClick provided', async () => {
    const onClick = jest.fn();

    render(
      <Marker3D position={{lat: 37.7749, lng: -122.4194}} onClick={onClick} />
    );

    await waitFor(() => {
      expect(createInteractiveMarkerSpy).toHaveBeenCalled();
    });

    expect(createMarkerSpy).not.toHaveBeenCalled();
  });

  test('does not render when map is not ready', () => {
    useMap3DMock.mockReturnValue(null);

    render(<Marker3D position={{lat: 37.7749, lng: -122.4194}} />);

    expect(createMarkerSpy).not.toHaveBeenCalled();
  });

  test('does not render when library is not ready', () => {
    useMapsLibraryMock.mockReturnValue(null);

    render(<Marker3D position={{lat: 37.7749, lng: -122.4194}} />);

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
