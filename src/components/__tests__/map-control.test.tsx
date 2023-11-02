import '@testing-library/jest-dom';

import React, {ReactElement} from 'react';
import {initialize} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {APIProvider} from '../api-provider';
import {Map} from '../map';
import {ControlPosition, MapControl} from '../map-control';
import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => ReactElement | null;

beforeEach(() => {
  initialize();

  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>
      <Map zoom={10} center={{lat: 0, lng: 0}}>
        {children}
      </Map>
    </APIProvider>
  );
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

test('control is added to the map', async () => {
  render(
    <MapControl position={ControlPosition.BOTTOM_CENTER}>
      <button>control button</button>
    </MapControl>,
    {wrapper}
  );

  const map = await waitForMockInstance(google.maps.Map);
  const controlsArray = map.controls[ControlPosition.BOTTOM_CENTER];

  expect(controlsArray.push).toHaveBeenCalled();

  const [controlEl] = (controlsArray.push as jest.Mock).mock.calls[0];
  expect(controlEl).toHaveTextContent('control button');
});
