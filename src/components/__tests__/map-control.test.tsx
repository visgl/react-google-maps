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

test('className prop is applied to the control container', () => {
  render(
    <MapControl
      position={ControlPosition.BOTTOM_CENTER}
      className="custom-control">
      <button>control button</button>
    </MapControl>
  );

  const controlsArray = mapInstance.controls[ControlPosition.BOTTOM_CENTER];
  const [controlEl] = (controlsArray.push as jest.Mock).mock.calls[0];

  expect(controlEl).toHaveClass('custom-control');
});

test('className prop updates are reflected on the control container', () => {
  const {rerender} = render(
    <MapControl
      position={ControlPosition.BOTTOM_CENTER}
      className="initial-class">
      <button>control button</button>
    </MapControl>
  );

  const controlsArray = mapInstance.controls[ControlPosition.BOTTOM_CENTER];
  const [controlEl] = (controlsArray.push as jest.Mock).mock.calls[0];

  expect(controlEl).toHaveClass('initial-class');

  rerender(
    <MapControl
      position={ControlPosition.BOTTOM_CENTER}
      className="updated-class">
      <button>control button</button>
    </MapControl>
  );

  expect(controlEl).toHaveClass('updated-class');
  expect(controlEl).not.toHaveClass('initial-class');

  rerender(
    <MapControl position={ControlPosition.BOTTOM_CENTER}>
      <button>control button</button>
    </MapControl>
  );

  expect(controlEl).not.toHaveClass('updated-class');
  expect(controlEl).not.toHaveClass('initial-class');
});
