import React from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render, waitFor} from '@testing-library/react';

import {APIProvider} from '../api-provider';
import {Map as GoogleMap} from '../map';
import {Circle as GoogleMapsCircle} from '../geometry/circle';
import MockedFunction = jest.MockedFunction;

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;
let createCircleSpy: jest.Mock;

beforeEach(() => {
  // initialize the Google Maps mock
  initialize();

  // Create wrapper component
  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>
      <GoogleMap zoom={10} center={{lat: 0, lng: 0}}>
        {children}
      </GoogleMap>
    </APIProvider>
  );

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
  jest.restoreAllMocks();
});

test('circle should be initialized', async () => {
  render(<GoogleMapsCircle radius={15000} center={{lat: 1, lng: 2}} />, {
    wrapper
  });

  // wait for Google Maps API to load and the circle to be created
  await waitFor(() => expect(createCircleSpy).toHaveBeenCalled());

  const circles = mockInstances.get(google.maps.Circle);
  expect(circles).toHaveLength(1);

  // it would be a lot better to test the final results here instead of the
  // setOptions and constructor-calls, since the parameters can be passed in
  // different ways, but that would require a somewhat working (or at least
  // stateful) maps-API instead of mocks.
  const [circle] = circles;
  expect(circle.setCenter).toHaveBeenCalledWith({lat: 1, lng: 2});
  expect(circle.setRadius).toHaveBeenCalledWith(15000);

  expect(circle.setMap).toHaveBeenCalled();
  const setMapMock = circle.setMap as MockedFunction<typeof circle.setMap>;
  const [map] = setMapMock.mock.calls[0];
  expect(map).toBeInstanceOf(google.maps.Map);
});

test('circle center and radius should update when re-rendering', async () => {
  const {rerender} = render(
    <GoogleMapsCircle radius={15000} center={{lat: 1, lng: 2}} />,
    {
      wrapper
    }
  );

  // wait for (mock) Google Maps API to load and the circle to be created
  await waitFor(() => expect(createCircleSpy).toHaveBeenCalled());

  const circles = mockInstances.get(google.maps.Circle);
  expect(circles).not.toHaveLength(0);

  const circle = circles[0];
  expect(circle.setCenter).toHaveBeenCalledWith({lat: 1, lng: 2});
  expect(circle.setRadius).toHaveBeenCalledWith(15000);

  rerender(<GoogleMapsCircle radius={16000} center={{lat: 2, lng: 3}} />);
  expect(circle.setCenter).toHaveBeenCalledWith({lat: 2, lng: 3});
  expect(circle.setRadius).toHaveBeenCalledWith(16000);
});
