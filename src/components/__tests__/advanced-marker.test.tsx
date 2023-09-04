import React, {JSX} from 'react';

import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {APIProvider} from '../api-provider';
import {Map as GoogleMap} from '../map';
import {AdvancedMarker as GoogleMapsMarker} from '../advanced-marker';
import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;
let createMarkerSpy: jest.Mock;

beforeEach(() => {
  initialize();

  google.maps.importLibrary = jest.fn(() => Promise.resolve()) as never;

  // Create wrapper component
  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>
      <GoogleMap zoom={10} center={{lat: 0, lng: 0}}>
        {children}
      </GoogleMap>
    </APIProvider>
  );

  createMarkerSpy = jest.fn();
  google.maps.marker.AdvancedMarkerElement = class extends (
    google.maps.marker.AdvancedMarkerElement
  ) {
    constructor(o?: google.maps.marker.AdvancedMarkerElementOptions) {
      createMarkerSpy(o);
      super(o);
    }
  };

  // the element has to be registered for this to work, but since we can
  // neither unregister nor re-register an element, a randomized name is
  // used for the element.
  customElements.define(
    `gmp-advanced-marker-${Math.random().toString(36).slice(2)}`,
    google.maps.marker.AdvancedMarkerElement
  );
});

afterEach(() => {
  cleanup();
});

test('marker should be initialized', async () => {
  render(<GoogleMapsMarker position={{lat: 0, lng: 0}} />, {
    wrapper
  });
  const marker = await waitForMockInstance(
    google.maps.marker.AdvancedMarkerElement
  );

  expect(createMarkerSpy).toHaveBeenCalledTimes(1);
  expect(marker).toBeDefined();
});

test('multiple markers should be initialized', async () => {
  render(
    <>
      <GoogleMapsMarker position={{lat: 0, lng: 0}} />
      <GoogleMapsMarker position={{lat: 0, lng: 0}} />
    </>,
    {
      wrapper
    }
  );

  await waitForMockInstance(google.maps.marker.AdvancedMarkerElement);

  const markers = mockInstances.get(google.maps.marker.AdvancedMarkerElement);

  expect(markers).toHaveLength(2);
});

test('marker should have a position', async () => {
  const {rerender} = render(<GoogleMapsMarker position={{lat: 1, lng: 0}} />, {
    wrapper
  });

  const marker = await waitForMockInstance(
    google.maps.marker.AdvancedMarkerElement
  );

  expect(marker.position).toEqual({lat: 1, lng: 0});

  rerender(<GoogleMapsMarker position={{lat: 2, lng: 2}} />);

  expect(marker.position).toEqual({lat: 2, lng: 2});
});

test.todo('marker should work with options');
test.todo('marker should have a click listener');
