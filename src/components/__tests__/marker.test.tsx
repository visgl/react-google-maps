import React, {FunctionComponent, PropsWithChildren} from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render, waitFor} from '@testing-library/react';

import {APIProvider} from '../api-provider';
import {Map as GoogleMap} from '../map';
import {Marker as GoogleMapsMarker} from '../marker';
import MockedFunction = jest.MockedFunction;

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: FunctionComponent<PropsWithChildren>;
let createMarkerSpy: jest.Mock;

beforeEach(() => {
  // initialize the Maps JavaScript API mocks
  initialize();

  // Create wrapper component
  wrapper = ({children}) => (
    <APIProvider apiKey={'apikey'}>
      <GoogleMap zoom={10} center={{lat: 0, lng: 0}}>
        {children}
      </GoogleMap>
    </APIProvider>
  );

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
  jest.restoreAllMocks();
});

test('marker should be initialized', async () => {
  render(<GoogleMapsMarker position={{lat: 1, lng: 2}} />, {wrapper});

  // wait for Maps JavaScript API to load and the marker to be created
  await waitFor(() => expect(createMarkerSpy).toHaveBeenCalled());

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

test('marker position should update when re-rendering', async () => {
  const {rerender} = render(<GoogleMapsMarker position={{lat: 1, lng: 2}} />, {
    wrapper
  });

  // wait for (mock) Maps JavaScript API to load and the marker to be created
  await waitFor(() => expect(createMarkerSpy).toHaveBeenCalled());

  const markers = mockInstances.get(google.maps.Marker);
  expect(markers).not.toHaveLength(0);

  const marker = markers[0];
  expect(marker.setPosition).toHaveBeenCalledWith({lat: 1, lng: 2});

  rerender(<GoogleMapsMarker position={{lat: 2, lng: 3}} />);
  expect(marker.setPosition).toHaveBeenCalledWith({lat: 2, lng: 3});
});

test('marker should have a click listener', async () => {
  const handleClick = jest.fn();

  render(
    <GoogleMapsMarker position={{lat: 0, lng: 0}} onClick={handleClick} />,
    {wrapper}
  );

  // wait for (mock) Maps JavaScript API to load and the marker to be created
  await waitFor(() => expect(createMarkerSpy).toHaveBeenCalled());

  const markerMocks = mockInstances.get(google.maps.Marker);
  const markerMock = markerMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    markerMock,
    'click',
    handleClick
  );
});
