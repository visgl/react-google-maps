import React from 'react';

import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, queryByTestId, render} from '@testing-library/react';
import '@testing-library/jest-dom';

import {AdvancedMarker} from '../advanced-marker';
import {useMap} from '../../hooks/use-map';
import {useMapsLibrary} from '../../hooks/use-maps-library';

import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../hooks/use-map');
jest.mock('../../hooks/use-maps-library');

let createMarkerSpy: jest.Mock;
let useMapMock: jest.MockedFn<typeof useMap>;
let useMapsLibraryMock: jest.MockedFn<typeof useMapsLibrary>;

let markerLib: google.maps.MarkerLibrary;
let mapInstance: google.maps.Map;

beforeEach(async () => {
  initialize();
  jest.clearAllMocks();

  // mocked versions of the useMap and useMapsLibrary functions
  useMapMock = jest.mocked(useMap);
  useMapsLibraryMock = jest.mocked(useMapsLibrary);

  // load the marker-lib that can be returned from the useMapsLibrary mock
  markerLib = (await google.maps.importLibrary(
    'marker'
  )) as google.maps.MarkerLibrary;

  // custom implementation of the AdvancedMarkerElement that has a properly
  // initialized content and an observeable constructor.
  createMarkerSpy = jest.fn();
  const AdvancedMarkerElement = class extends google.maps.marker
    .AdvancedMarkerElement {
    constructor(o?: google.maps.marker.AdvancedMarkerElementOptions) {
      createMarkerSpy(o);
      super(o);

      // @googlemaps/js-jest-mocks doesn't initialize the .content property
      // as the real implementation does (this would normally be a pin-element,
      // but for our purposes a div should suffice)
      this.content = document.createElement('div');
    }
  };

  // the element has to be registered for this override to work, but since we
  // can neither unregister nor re-register an element, a randomized name is
  // used for the element.
  customElements.define(
    `gmp-advanced-marker-${Math.random().toString(36).slice(2)}`,
    AdvancedMarkerElement
  );

  google.maps.marker.AdvancedMarkerElement = markerLib.AdvancedMarkerElement =
    AdvancedMarkerElement;
});

afterEach(() => {
  cleanup();
});

test('creates marker instance once map is ready', async () => {
  useMapsLibraryMock.mockReturnValue(null);
  useMapMock.mockReturnValue(null);

  const {rerender} = render(<AdvancedMarker position={{lat: 0, lng: 0}} />);

  expect(useMapsLibraryMock).toHaveBeenCalledWith('marker');
  expect(createMarkerSpy).not.toHaveBeenCalled();

  useMapsLibraryMock.mockImplementation(name => {
    expect(name).toEqual('marker');
    return markerLib;
  });
  const mockMap = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mockMap);

  rerender(<AdvancedMarker position={{lat: 1, lng: 2}} />);

  expect(createMarkerSpy).toHaveBeenCalled();
});

describe('map and marker-library loaded', () => {
  beforeEach(() => {
    useMapsLibraryMock.mockImplementation(name => {
      expect(name).toEqual('marker');
      return markerLib;
    });

    mapInstance = new google.maps.Map(document.createElement('div'));
    useMapMock.mockReturnValue(mapInstance);
  });

  test('marker should be initialized', async () => {
    render(<AdvancedMarker position={{lat: 0, lng: 0}} />);

    expect(createMarkerSpy).toHaveBeenCalledTimes(1);
    expect(
      mockInstances.get(google.maps.marker.AdvancedMarkerElement)
    ).toHaveLength(1);
  });

  test('marker should have and update its position', async () => {
    const {rerender} = render(<AdvancedMarker position={{lat: 1, lng: 0}} />);
    const marker = await waitForMockInstance(
      google.maps.marker.AdvancedMarkerElement
    );

    expect(marker.position).toEqual({lat: 1, lng: 0});

    rerender(<AdvancedMarker position={{lat: 2, lng: 2}} />);

    expect(marker.position).toEqual({lat: 2, lng: 2});
  });

  test('marker class is set correctly without html content', async () => {
    render(
      <AdvancedMarker
        position={{lat: 1, lng: 2}}
        className={'classname-test'}
      />
    );

    const marker = mockInstances
      .get(google.maps.marker.AdvancedMarkerElement)
      .at(0) as google.maps.marker.AdvancedMarkerElement;

    expect(marker.content).toHaveClass('classname-test');
  });

  test('marker class and style are set correctly with html content', async () => {
    render(
      <AdvancedMarker
        position={{lat: 1, lng: 2}}
        className={'classname-test'}
        style={{width: 200}}>
        <div data-testid={'marker-content'}>Marker Content!</div>
      </AdvancedMarker>
    );

    const marker = mockInstances
      .get(google.maps.marker.AdvancedMarkerElement)
      .at(0) as google.maps.marker.AdvancedMarkerElement;

    expect(marker.content).toHaveClass('classname-test');
    expect(marker.content).toHaveStyle('width: 200px');
    expect(
      queryByTestId(marker.content as HTMLElement, 'marker-content')
    ).toBeTruthy();
  });

  test.todo('marker should work with options');
  test.todo('marker should have a click listener');
});
