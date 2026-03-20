import React from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {Rectangle} from '../rectangle';
import {useMap} from '../../hooks/use-map';
import MockedFunction = jest.MockedFunction;

jest.mock('../../hooks/use-map');

let useMapMock: jest.MockedFn<typeof useMap>;
let mapInstance: google.maps.Map;
let createRectangleSpy: jest.Mock;

beforeEach(() => {
  initialize();
  jest.clearAllMocks();

  useMapMock = jest.mocked(useMap);
  mapInstance = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mapInstance);

  createRectangleSpy = jest.fn();
  google.maps.Rectangle = class extends google.maps.Rectangle {
    constructor(opts?: google.maps.RectangleOptions | null) {
      createRectangleSpy(opts);
      super(opts);
    }
  };
});

afterEach(() => {
  cleanup();
});

test('rectangle should be initialized', () => {
  render(<Rectangle bounds={{north: 2, south: 1, east: 3, west: 0}} />);

  expect(createRectangleSpy).toHaveBeenCalled();

  const rectangles = mockInstances.get(google.maps.Rectangle);
  expect(rectangles).toHaveLength(1);

  const [rectangle] = rectangles;
  expect(rectangle.setMap).toHaveBeenCalled();
  const setMapMock = rectangle.setMap as MockedFunction<
    typeof rectangle.setMap
  >;
  const [map] = setMapMock.mock.calls[0];
  expect(map).toBeInstanceOf(google.maps.Map);
});

test('rectangle should have a click listener', () => {
  const handleClick = jest.fn();

  render(
    <Rectangle
      bounds={{north: 2, south: 1, east: 3, west: 0}}
      onClick={handleClick}
    />
  );

  expect(createRectangleSpy).toHaveBeenCalled();

  const rectangleMocks = mockInstances.get(google.maps.Rectangle);
  const rectangleMock = rectangleMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    rectangleMock,
    'click',
    expect.any(Function)
  );
});

test('rectangle should update options on rerender', () => {
  const {rerender} = render(
    <Rectangle
      bounds={{north: 2, south: 1, east: 3, west: 0}}
      fillColor="#ff0000"
    />
  );

  expect(createRectangleSpy).toHaveBeenCalled();

  const rectangles = mockInstances.get(google.maps.Rectangle);
  const rectangle = rectangles[0];

  rerender(
    <Rectangle
      bounds={{north: 2, south: 1, east: 3, west: 0}}
      fillColor="#00ff00"
    />
  );

  expect(rectangle.setOptions).toHaveBeenCalledWith(
    expect.objectContaining({fillColor: '#00ff00'})
  );
});

test('rectangle should be removed from map on unmount', () => {
  const {unmount} = render(
    <Rectangle bounds={{north: 2, south: 1, east: 3, west: 0}} />
  );

  const rectangles = mockInstances.get(google.maps.Rectangle);
  const rectangle = rectangles[0];

  unmount();

  expect(rectangle.setMap).toHaveBeenCalledWith(null);
});

test('rectangle should use defaultBounds for initial value', () => {
  const defaultBounds = {north: 2, south: 1, east: 3, west: 0};
  render(<Rectangle defaultBounds={defaultBounds} />);

  expect(createRectangleSpy).toHaveBeenCalledWith(
    expect.objectContaining({bounds: defaultBounds})
  );
});

test('rectangle bounds prop should take precedence over defaultBounds', () => {
  const bounds = {north: 4, south: 2, east: 5, west: 1};
  const defaultBounds = {north: 2, south: 1, east: 3, west: 0};
  render(<Rectangle bounds={bounds} defaultBounds={defaultBounds} />);

  expect(createRectangleSpy).toHaveBeenCalledWith(
    expect.objectContaining({bounds})
  );
});

test('rectangle should call onBoundsChanged on bounds_changed', () => {
  const handleBoundsChanged = jest.fn();

  render(
    <Rectangle
      bounds={{north: 2, south: 1, east: 3, west: 0}}
      onBoundsChanged={handleBoundsChanged}
    />
  );

  const rectangleMocks = mockInstances.get(google.maps.Rectangle);
  const rectangleMock = rectangleMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    rectangleMock,
    'bounds_changed',
    expect.any(Function)
  );
});
