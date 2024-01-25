import React from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render, waitFor} from '@testing-library/react';

import {APIProvider} from '../api-provider';
import {Map as GoogleMap} from '../map';
import {Polygon as GoogleMapsPolygon} from '../geometry/polygon';
import MockedFunction = jest.MockedFunction;

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;
let createPolygonSpy: jest.Mock;

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
  jest.restoreAllMocks();
});

test('polygon should be initialized', async () => {
  render(
    <GoogleMapsPolygon
      paths={[
        {lat: 25.774, lng: -80.19},
        {lat: 18.466, lng: -66.118},
        {lat: 32.321, lng: -64.757}
      ]}
    />,
    {wrapper}
  );

  // wait for Google Maps API to load and the polygon to be created
  await waitFor(() => expect(createPolygonSpy).toHaveBeenCalled());

  const polygons = mockInstances.get(google.maps.Polygon);
  expect(polygons).not.toHaveLength(0);

  // it would be a lot better to test the final results here instead of the
  // setOptions and constructor-calls, since the parameters can be passed in
  // different ways, but that would require a somewhat working (or at least
  // stateful) maps-API instead of mocks.
  const [polygon] = polygons;
  expect(polygon.setOptions).toHaveBeenCalledWith({
    paths: [
      {lat: 25.774, lng: -80.19},
      {lat: 18.466, lng: -66.118},
      {lat: 32.321, lng: -64.757}
    ]
  });

  expect(polygon.setMap).toHaveBeenCalled();
  const setMapMock = polygon.setMap as MockedFunction<typeof polygon.setMap>;
  const [map] = setMapMock.mock.calls[0];
  expect(map).toBeInstanceOf(google.maps.Map);
});

test('polygon path should update when re-rendering', async () => {
  const {rerender} = render(
    <GoogleMapsPolygon
      paths={[
        {lat: 25.774, lng: -80.19},
        {lat: 18.466, lng: -66.118},
        {lat: 32.321, lng: -64.757}
      ]}
    />,
    {wrapper}
  );

  // wait for (mock) Google Maps API to load and the polygon to be created
  await waitFor(() => expect(createPolygonSpy).toHaveBeenCalled());

  const polygons = mockInstances.get(google.maps.Polygon);
  expect(polygons).not.toHaveLength(0);

  const polygon = polygons[0];
  expect(polygon.setOptions).toHaveBeenCalledWith({
    paths: [
      {lat: 25.774, lng: -80.19},
      {lat: 18.466, lng: -66.118},
      {lat: 32.321, lng: -64.757}
    ]
  });

  rerender(
    <GoogleMapsPolygon
      paths={[
        {lat: 25, lng: -80},
        {lat: 18, lng: -66},
        {lat: 32, lng: -64}
      ]}
    />
  );
  expect(polygon.setOptions).toHaveBeenCalledWith({
    paths: [
      {lat: 25, lng: -80},
      {lat: 18, lng: -66},
      {lat: 32, lng: -64}
    ]
  });
});
