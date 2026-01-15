import React from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {Marker as GoogleMapsMarker} from '../marker';
import {useMap} from '../../hooks/use-map';
import MockedFunction = jest.MockedFunction;

jest.mock('../../hooks/use-map');

let useMapMock: jest.MockedFn<typeof useMap>;
let mapInstance: google.maps.Map;
let createMarkerSpy: jest.Mock;

beforeEach(() => {
  initialize();
  jest.clearAllMocks();

  useMapMock = jest.mocked(useMap);
  mapInstance = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mapInstance);

  // overwrite marker mock so we can spy on the constructor
  createMarkerSpy = jest.fn();
  google.maps.Marker = class extends google.maps.Marker {
    constructor(opts?: google.maps.MarkerOptions | null) {
      createMarkerSpy(opts);
      super(opts);
    }
  };
});

afterEach(() => {
  cleanup();
});

test('marker should be initialized', () => {
  render(<GoogleMapsMarker position={{lat: 1, lng: 2}} />);

  expect(createMarkerSpy).toHaveBeenCalled();

  const markers = mockInstances.get(google.maps.Marker);
  expect(markers).toHaveLength(1);

  // it would be a lot better to test the final results here instead of the
  // setPosition and constructor-calls, since the parameters can be passed in
  // different ways, but that would require a somewhat working (or at least
  // stateful) maps-API instead of mocks.
  const [marker] = markers;
  expect(marker.setPosition).toHaveBeenCalledWith({lat: 1, lng: 2});

  expect(marker.setMap).toHaveBeenCalled();
  const setMapMock = marker.setMap as MockedFunction<typeof marker.setMap>;
  const [map] = setMapMock.mock.calls[0];
  expect(map).toBeInstanceOf(google.maps.Map);
});

test('marker position should update when re-rendering', () => {
  const {rerender} = render(<GoogleMapsMarker position={{lat: 1, lng: 2}} />);

  expect(createMarkerSpy).toHaveBeenCalled();

  const markers = mockInstances.get(google.maps.Marker);
  expect(markers).not.toHaveLength(0);

  const marker = markers[0];
  expect(marker.setPosition).toHaveBeenCalledWith({lat: 1, lng: 2});

  rerender(<GoogleMapsMarker position={{lat: 2, lng: 3}} />);
  expect(marker.setPosition).toHaveBeenCalledWith({lat: 2, lng: 3});
});

test('marker should have a click listener', () => {
  const handleClick = jest.fn();

  render(
    <GoogleMapsMarker position={{lat: 0, lng: 0}} onClick={handleClick} />
  );

  expect(createMarkerSpy).toHaveBeenCalled();

  const markerMocks = mockInstances.get(google.maps.Marker);
  const markerMock = markerMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    markerMock,
    'click',
    handleClick
  );
});
