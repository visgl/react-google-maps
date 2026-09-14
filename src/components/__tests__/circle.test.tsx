import React, {useEffect, useState} from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {Circle} from '../circle';
import {useMap} from '../../hooks/use-map';
import MockedFunction = jest.MockedFunction;

jest.mock('../../hooks/use-map');

let useMapMock: jest.MockedFn<typeof useMap>;
let mapInstance: google.maps.Map;
let createCircleSpy: jest.Mock;

beforeEach(() => {
  initialize();
  jest.clearAllMocks();

  useMapMock = jest.mocked(useMap);
  mapInstance = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mapInstance);

  // overwrite circle mock so we can spy on the constructor
  createCircleSpy = jest.fn();
  google.maps.Circle = class extends google.maps.Circle {
    constructor(opts?: google.maps.CircleOptions | null) {
      createCircleSpy(opts);
      super(opts);
    }
  };
});

afterEach(() => {
  cleanup();
});

test('circle should be initialized', () => {
  render(<Circle center={{lat: 1, lng: 2}} radius={1000} />);

  expect(createCircleSpy).toHaveBeenCalled();

  const circles = mockInstances.get(google.maps.Circle);
  expect(circles).toHaveLength(1);

  const [circle] = circles;
  expect(circle.setMap).toHaveBeenCalled();
  const setMapMock = circle.setMap as MockedFunction<typeof circle.setMap>;
  const [map] = setMapMock.mock.calls[0];
  expect(map).toBeInstanceOf(google.maps.Map);
});

test('circle should have a click listener', () => {
  const handleClick = jest.fn();

  render(
    <Circle center={{lat: 0, lng: 0}} radius={1000} onClick={handleClick} />
  );

  expect(createCircleSpy).toHaveBeenCalled();

  const circleMocks = mockInstances.get(google.maps.Circle);
  const circleMock = circleMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    circleMock,
    'click',
    expect.any(Function)
  );
});

test('circle should apply an option changed in the commit that creates it', () => {
  // parent effects run after child effects, so this setState batches with the
  // creation effect's setCircle: the constructor gets the old value and the
  // hook first sees the new one. assuming the new one was applied loses it
  const Parent = () => {
    const [fillColor, setFillColor] = useState('#ff0000');
    useEffect(() => setFillColor('#00ff00'), []);

    return (
      <Circle center={{lat: 1, lng: 2}} radius={1000} fillColor={fillColor} />
    );
  };

  render(<Parent />);

  const circles = mockInstances.get(google.maps.Circle);
  const circle = circles[0];

  expect(circle.setOptions).toHaveBeenCalledWith(
    expect.objectContaining({fillColor: '#00ff00'})
  );
});

test('circle should only send the options that changed', () => {
  const {rerender} = render(
    <Circle center={{lat: 1, lng: 2}} radius={1000} fillOpacity={0.2} />
  );

  const circles = mockInstances.get(google.maps.Circle);
  const circle = circles[0];

  (circle.setOptions as jest.Mock).mockClear();

  rerender(
    <Circle center={{lat: 1, lng: 2}} radius={1000} fillOpacity={0.5} />
  );

  expect(circle.setOptions).toHaveBeenCalledTimes(1);
  // assert the keys: toHaveBeenCalledWith ignores undefined-valued ones,
  // so it would also accept an extra `editable: undefined`
  const [sent] = (circle.setOptions as jest.Mock).mock.calls[0];
  expect(Object.keys(sent)).toEqual(['fillOpacity']);
  expect(sent.fillOpacity).toBe(0.5);
});

test('circle should update options on rerender', () => {
  const {rerender} = render(
    <Circle center={{lat: 1, lng: 2}} radius={1000} fillColor="#ff0000" />
  );

  expect(createCircleSpy).toHaveBeenCalled();

  const circles = mockInstances.get(google.maps.Circle);
  const circle = circles[0];

  rerender(
    <Circle center={{lat: 1, lng: 2}} radius={1000} fillColor="#00ff00" />
  );

  expect(circle.setOptions).toHaveBeenCalledWith(
    expect.objectContaining({fillColor: '#00ff00'})
  );
});

test('circle should be removed from map on unmount', () => {
  const {unmount} = render(<Circle center={{lat: 1, lng: 2}} radius={1000} />);

  const circles = mockInstances.get(google.maps.Circle);
  const circle = circles[0];

  unmount();

  expect(circle.setMap).toHaveBeenCalledWith(null);
});
