import {initialize} from '@googlemaps/jest-mocks';
import {render, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import {Popover3D} from '../popover-3d';
import {useMap3D} from '../../hooks/use-map-3d';
import {useMapsLibrary} from '../../hooks/use-maps-library';

jest.mock('../../hooks/use-map-3d');
jest.mock('../../hooks/use-maps-library');

let useMap3DMock: jest.MockedFn<typeof useMap3D>;
let useMapsLibraryMock: jest.MockedFn<typeof useMapsLibrary>;
let createPopoverSpy: jest.Mock;
let mockMap3D: {appendChild: jest.Mock; removeChild: jest.Mock};
let PopoverElement: unknown;

beforeEach(() => {
  initialize();

  createPopoverSpy = jest.fn();

  mockMap3D = {
    appendChild: jest.fn(),
    removeChild: jest.fn()
  };

  // Create mock PopoverElement
  PopoverElement = class extends HTMLElement {
    open = false;
    positionAnchor: unknown = null;
    altitudeMode: string | null = null;
    lightDismissDisabled = false;

    constructor() {
      super();
      createPopoverSpy(this);
    }
  };

  // Register with random name
  customElements.define(
    `gmp-popover-${Math.random().toString(36).slice(2)}`,
    PopoverElement as CustomElementConstructor
  );

  useMap3DMock = jest.mocked(useMap3D);
  useMapsLibraryMock = jest.mocked(useMapsLibrary);

  useMap3DMock.mockReturnValue(
    mockMap3D as unknown as google.maps.maps3d.Map3DElement
  );
  useMapsLibraryMock.mockReturnValue({
    PopoverElement
  } as unknown as google.maps.Maps3DLibrary);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Popover3D', () => {
  test('creates PopoverElement after map and library ready', async () => {
    render(
      <Popover3D position={{lat: 37.7749, lng: -122.4194}} open>
        <div>Content</div>
      </Popover3D>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    expect(mockMap3D.appendChild).toHaveBeenCalled();
  });

  test('does not render when map is not ready', () => {
    useMap3DMock.mockReturnValue(null);

    render(
      <Popover3D position={{lat: 37.7749, lng: -122.4194}} open>
        <div>Content</div>
      </Popover3D>
    );

    expect(createPopoverSpy).not.toHaveBeenCalled();
  });

  test('does not render when library is not ready', () => {
    useMapsLibraryMock.mockReturnValue(null);

    render(
      <Popover3D position={{lat: 37.7749, lng: -122.4194}} open>
        <div>Content</div>
      </Popover3D>
    );

    expect(createPopoverSpy).not.toHaveBeenCalled();
  });

  test('syncs open prop', async () => {
    const {rerender} = render(
      <Popover3D position={{lat: 37.7749, lng: -122.4194}} open={false}>
        <div>Content</div>
      </Popover3D>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    const popover = createPopoverSpy.mock.calls[0][0];
    expect(popover.open).toBe(false);

    rerender(
      <Popover3D position={{lat: 37.7749, lng: -122.4194}} open={true}>
        <div>Content</div>
      </Popover3D>
    );

    await waitFor(() => {
      expect(popover.open).toBe(true);
    });
  });

  test('syncs position as positionAnchor', async () => {
    render(
      <Popover3D position={{lat: 37.7749, lng: -122.4194}} open>
        <div>Content</div>
      </Popover3D>
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
      <Popover3D anchor={mockMarker} open>
        <div>Content</div>
      </Popover3D>
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
      <Popover3D
        position={{lat: 37.7749, lng: -122.4194}}
        open
        lightDismissDisabled={false}>
        <div>Content</div>
      </Popover3D>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    const popover = createPopoverSpy.mock.calls[0][0];

    rerender(
      <Popover3D
        position={{lat: 37.7749, lng: -122.4194}}
        open
        lightDismissDisabled={true}>
        <div>Content</div>
      </Popover3D>
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
      <Popover3D position={{lat: 37.7749, lng: -122.4194}} open>
        <div data-testid="popover-content">Hello World</div>
      </Popover3D>
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
      <Popover3D position={{lat: 37.7749, lng: -122.4194}} open>
        <div>Content</div>
      </Popover3D>
    );

    await waitFor(() => {
      expect(createPopoverSpy).toHaveBeenCalled();
    });

    unmount();

    // Verify popover was removed
    const popover = createPopoverSpy.mock.calls[0][0];
    expect(popover.parentElement).toBeNull();
  });
});
