import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {initialize, InfoWindow} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom';

import {Map as GoogleMap} from '../map';
import {APIProvider} from '../api-provider';
import {InfoWindow as InfoWindowComponent} from '../info-window';

import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;

beforeEach(() => {
  // initialize the google maps mock
  initialize();

  // Create wrapper component
  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>
      <GoogleMap zoom={10} center={{lat: 0, lng: 0}}>
        {children}
      </GoogleMap>
    </APIProvider>
  );
});

afterEach(() => {
  cleanup();
});

test('info window should be initialized', async () => {
  render(
    <InfoWindowComponent position={{lat: 0, lng: 0}}>Hi</InfoWindowComponent>,
    {
      wrapper
    }
  );

  const infoWindow = await waitForMockInstance(InfoWindow);

  expect(infoWindow).toBeDefined();
});

test.todo('info window should have a position');
test.todo('info window gets position from marker');
test.todo('info window should have content');
