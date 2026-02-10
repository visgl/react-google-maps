import React from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {Polyline} from '../polyline';
import {useMap} from '../../hooks/use-map';
import MockedFunction = jest.MockedFunction;

jest.mock('../../hooks/use-map');

let useMapMock: jest.MockedFn<typeof useMap>;
let mapInstance: google.maps.Map;
let createPolylineSpy: jest.Mock;

beforeEach(() => {
  initialize();
  jest.clearAllMocks();

  useMapMock = jest.mocked(useMap);
  mapInstance = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mapInstance);

  // overwrite polyline mock so we can spy on the constructor
  createPolylineSpy = jest.fn();
  google.maps.Polyline = class extends google.maps.Polyline {
    constructor(opts?: google.maps.PolylineOptions | null) {
      createPolylineSpy(opts);
      super(opts);
    }
  };
});

afterEach(() => {
  cleanup();
});

test('polyline should be initialized', () => {
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];
  render(<Polyline path={path} />);

  expect(createPolylineSpy).toHaveBeenCalled();

  const polylines = mockInstances.get(google.maps.Polyline);
  expect(polylines).toHaveLength(1);

  const [polyline] = polylines;
  expect(polyline.setMap).toHaveBeenCalled();
  const setMapMock = polyline.setMap as MockedFunction<typeof polyline.setMap>;
  const [map] = setMapMock.mock.calls[0];
  expect(map).toBeInstanceOf(google.maps.Map);
});

test('polyline should have a click listener', () => {
  const handleClick = jest.fn();
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];

  render(<Polyline path={path} onClick={handleClick} />);

  expect(createPolylineSpy).toHaveBeenCalled();

  const polylineMocks = mockInstances.get(google.maps.Polyline);
  const polylineMock = polylineMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    polylineMock,
    'click',
    handleClick
  );
});

test('polyline should update options on rerender', () => {
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];

  const {rerender} = render(<Polyline path={path} strokeColor="#ff0000" />);

  expect(createPolylineSpy).toHaveBeenCalled();

  const polylines = mockInstances.get(google.maps.Polyline);
  const polyline = polylines[0];

  rerender(<Polyline path={path} strokeColor="#00ff00" />);

  expect(polyline.setOptions).toHaveBeenCalledWith(
    expect.objectContaining({strokeColor: '#00ff00'})
  );
});

test('polyline should be removed from map on unmount', () => {
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];
  const {unmount} = render(<Polyline path={path} />);

  const polylines = mockInstances.get(google.maps.Polyline);
  const polyline = polylines[0];

  unmount();

  expect(polyline.setMap).toHaveBeenCalledWith(null);
});
