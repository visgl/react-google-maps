import '@testing-library/jest-dom';

import React from 'react';
import {initialize} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {ControlPosition, MapControl} from '../map-control';
import {useMap} from '../../hooks/use-map';

jest.mock('../../hooks/use-map');

let useMapMock: jest.MockedFn<typeof useMap>;
let mapInstance: google.maps.Map;

beforeEach(() => {
  initialize();
  jest.clearAllMocks();

  useMapMock = jest.mocked(useMap);
  mapInstance = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mapInstance);
});

afterEach(() => {
  cleanup();
});

test('control is added to the map', () => {
  render(
    <MapControl position={ControlPosition.BOTTOM_CENTER}>
      <button>control button</button>
    </MapControl>
  );

  const controlsArray = mapInstance.controls[ControlPosition.BOTTOM_CENTER];

  expect(controlsArray.push).toHaveBeenCalled();

  const [controlEl] = (controlsArray.push as jest.Mock).mock.calls[0];
  expect(controlEl).toHaveTextContent('control button');
});
