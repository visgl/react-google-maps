import React from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {Polygon} from '../polygon';
import {useMap} from '../../hooks/use-map';
import MockedFunction = jest.MockedFunction;

jest.mock('../../hooks/use-map');

let useMapMock: jest.MockedFn<typeof useMap>;
let mapInstance: google.maps.Map;
let createPolygonSpy: jest.Mock;

beforeEach(() => {
  initialize();
  jest.clearAllMocks();

  useMapMock = jest.mocked(useMap);
  mapInstance = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mapInstance);

  // overwrite polygon mock so we can spy on the constructor
  createPolygonSpy = jest.fn();
  google.maps.Polygon = class extends google.maps.Polygon {
    constructor(opts?: google.maps.PolygonOptions | null) {
      createPolygonSpy(opts);
      super(opts);
    }
  };
});

afterEach(() => {
  cleanup();
});

test('polygon should be initialized', () => {
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];
  render(<Polygon paths={paths} />);

  expect(createPolygonSpy).toHaveBeenCalled();

  const polygons = mockInstances.get(google.maps.Polygon);
  expect(polygons).toHaveLength(1);

  const [polygon] = polygons;
  expect(polygon.setMap).toHaveBeenCalled();
  const setMapMock = polygon.setMap as MockedFunction<typeof polygon.setMap>;
  const [map] = setMapMock.mock.calls[0];
  expect(map).toBeInstanceOf(google.maps.Map);
});

test('polygon should have a click listener', () => {
  const handleClick = jest.fn();
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];

  render(<Polygon paths={paths} onClick={handleClick} />);

  expect(createPolygonSpy).toHaveBeenCalled();

  const polygonMocks = mockInstances.get(google.maps.Polygon);
  const polygonMock = polygonMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    polygonMock,
    'click',
    expect.any(Function)
  );
});

test('polygon should update options on rerender', () => {
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];

  const {rerender} = render(<Polygon paths={paths} fillColor="#ff0000" />);

  expect(createPolygonSpy).toHaveBeenCalled();

  const polygons = mockInstances.get(google.maps.Polygon);
  const polygon = polygons[0];

  rerender(<Polygon paths={paths} fillColor="#00ff00" />);

  expect(polygon.setOptions).toHaveBeenCalledWith(
    expect.objectContaining({fillColor: '#00ff00'})
  );
});

test('polygon should be removed from map on unmount', () => {
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];
  const {unmount} = render(<Polygon paths={paths} />);

  const polygons = mockInstances.get(google.maps.Polygon);
  const polygon = polygons[0];

  unmount();

  expect(polygon.setMap).toHaveBeenCalledWith(null);
});
