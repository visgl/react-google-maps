import {initialize} from '@googlemaps/jest-mocks';
import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import {Popover} from '../popover';
import {useMap3D} from '../../hooks/use-map-3d';
import {useMapsLibrary} from '../../hooks/use-maps-library';
import {PopoverElement} from './__utils__/map-3d-mocks';

jest.mock('../../hooks/use-map-3d');
jest.mock('../../hooks/use-maps-library');

// ============================================================================
// Type declarations for test-specific global factory functions
// ============================================================================

declare global {
  var __popoverFactory: ((instance: PopoverElement) => void) | undefined;
}

let useMap3DMock: jest.MockedFn<typeof useMap3D>;
let useMapsLibraryMock: jest.MockedFn<typeof useMapsLibrary>;
let createPopoverSpy: jest.Mock;
let mockMap3D: {appendChild: jest.Mock; removeChild: jest.Mock};

// ============================================================================
// Module-level: Register custom elements ONCE per test file
// ============================================================================

// Extend mock class to add spy functionality via factory pattern
class SpyPopoverElement extends PopoverElement {
  constructor(options?: google.maps.maps3d.PopoverElementOptions) {
    super(options);
    if (typeof globalThis.__popoverFactory === 'function') {
      globalThis.__popoverFactory(this);
    }
  }
}

// Register spy-enabled version of the mock component
if (!customElements.get('gmp-popover')) {
  customElements.define('gmp-popover', SpyPopoverElement);
}

// ============================================================================
// Test-level: Create fresh spies for each test
// ============================================================================

beforeEach(() => {
  initialize();

  // Create fresh spy for this test
  createPopoverSpy = jest.fn();

  // Attach spy to the custom element constructor via factory function
  globalThis.__popoverFactory = (instance: PopoverElement) => {
    createPopoverSpy(instance);
  };

  // Mock map3d element
  mockMap3D = {
    appendChild: jest.fn(),
    removeChild: jest.fn()
  };

  // Setup hook mocks
  useMap3DMock = jest.mocked(useMap3D);
  useMapsLibraryMock = jest.mocked(useMapsLibrary);

  // Return mock map3d (library is no longer used in web component approach)
  useMap3DMock.mockReturnValue(
    mockMap3D as unknown as google.maps.maps3d.Map3DElement
  );
  useMapsLibraryMock.mockReturnValue(
    {} as unknown as google.maps.Maps3DLibrary
  );
});

afterEach(() => {
  jest.clearAllMocks();

  // Clean up factory function
  delete globalThis.__popoverFactory;
});

describe('Popover', () => {
  test('creates gmp-popover element when rendered', async () => {
    render(
      <Popover position={{lat: 37.7749, lng: -122.4194}} open>
        <div>Content</div>
      </Popover>
    );

    // Wait for the custom element to be instantiated
    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    // Verify we got the popover instance
    const popoverInstance = createPopoverSpy.mock.calls[0][0];
    expect(popoverInstance).toBeInstanceOf(PopoverElement);
    expect(popoverInstance.tagName.toLowerCase()).toBe('gmp-popover');
  });

  test('syncs open prop', async () => {
    const {rerender} = render(
      <Popover position={{lat: 37.7749, lng: -122.4194}} open={false}>
        <div>Content</div>
      </Popover>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    const popover = createPopoverSpy.mock.calls[0][0];
    expect(popover.open).toBe(false);

    rerender(
      <Popover position={{lat: 37.7749, lng: -122.4194}} open={true}>
        <div>Content</div>
      </Popover>
    );

    await waitFor(() => {
      expect(popover.open).toBe(true);
    });
  });

  test('syncs position as positionAnchor', async () => {
    render(
      <Popover position={{lat: 37.7749, lng: -122.4194}} open>
        <div>Content</div>
      </Popover>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    const popover = createPopoverSpy.mock.calls[0][0];

    await waitFor(() => {
      expect(popover.positionAnchor).toEqual({lat: 37.7749, lng: -122.4194});
    });
  });

  test('syncs anchor element as positionAnchor', async () => {
    const mockMarker = {} as google.maps.maps3d.Marker3DInteractiveElement;

    render(
      <Popover anchor={mockMarker} open>
        <div>Content</div>
      </Popover>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    const popover = createPopoverSpy.mock.calls[0][0];

    await waitFor(() => {
      expect(popover.positionAnchor).toBe(mockMarker);
    });
  });

  test('syncs lightDismissDisabled prop', async () => {
    const {rerender} = render(
      <Popover
        position={{lat: 37.7749, lng: -122.4194}}
        open
        lightDismissDisabled={false}>
        <div>Content</div>
      </Popover>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    const popover = createPopoverSpy.mock.calls[0][0];

    rerender(
      <Popover
        position={{lat: 37.7749, lng: -122.4194}}
        open
        lightDismissDisabled={true}>
        <div>Content</div>
      </Popover>
    );

    await waitFor(() => {
      expect(popover.lightDismissDisabled).toBe(true);
    });
  });

  test('renders children content into the popover', async () => {
    // Use a real appendChild so we can check the content
    const appendedElements: HTMLElement[] = [];
    mockMap3D.appendChild.mockImplementation((el: HTMLElement) => {
      document.body.appendChild(el);
      appendedElements.push(el);
    });

    render(
      <Popover position={{lat: 37.7749, lng: -122.4194}} open>
        <div data-testid="popover-content">Hello World</div>
      </Popover>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    // Content should be rendered (via portal into popover)
    await waitFor(() => {
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    expect(screen.getByTestId('popover-content').textContent).toBe(
      'Hello World'
    );
  });

  test('cleans up on unmount', async () => {
    const {unmount} = render(
      <Popover position={{lat: 37.7749, lng: -122.4194}} open>
        <div>Content</div>
      </Popover>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    unmount();

    // Verify popover was removed
    const popover = createPopoverSpy.mock.calls[0][0];
    expect(popover.parentElement).toBeNull();
  });

  test('exposes popover element via ref', async () => {
    const refCallback = jest.fn();

    render(
      <Popover position={{lat: 37.7749, lng: -122.4194}} open ref={refCallback}>
        <div>Content</div>
      </Popover>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(refCallback).toHaveBeenCalled();
    });

    // Verify the ref received the popover element
    const popover = createPopoverSpy.mock.calls[0][0];
    expect(refCallback).toHaveBeenCalledWith(popover);
  });
});
