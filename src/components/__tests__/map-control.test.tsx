import '@testing-library/jest-dom';

import React from 'react';
import {initialize} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {ControlPosition, MapControl} from '../map-control';
import {useMap} from '../../hooks/use-map';

import type {CSSProperties} from 'react';

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

test('style prop is applied to the control container', () => {
  render(
    <MapControl
      position={ControlPosition.BOTTOM_CENTER}
      style={{width: '100%', zIndex: 5}}>
      <button>control button</button>
    </MapControl>
  );

  const controlsArray = mapInstance.controls[ControlPosition.BOTTOM_CENTER];
  const [controlEl] = (controlsArray.push as jest.Mock).mock.calls[0];

  expect(controlEl.style.width).toBe('100%');
  expect(controlEl.style.zIndex).toBe('5');
});

test('style prop updates are reflected on the control container', () => {
  const {rerender} = render(
    <MapControl
      position={ControlPosition.BOTTOM_CENTER}
      style={{width: '100%', zIndex: 5}}>
      <button>control button</button>
    </MapControl>
  );

  const controlsArray = mapInstance.controls[ControlPosition.BOTTOM_CENTER];
  const [controlEl] = (controlsArray.push as jest.Mock).mock.calls[0];

  expect(controlEl.style.width).toBe('100%');
  expect(controlEl.style.zIndex).toBe('5');

  // properties dropped between renders have to be removed from the element,
  // not just overwritten
  rerender(
    <MapControl position={ControlPosition.BOTTOM_CENTER} style={{width: '50%'}}>
      <button>control button</button>
    </MapControl>
  );

  expect(controlEl.style.width).toBe('50%');
  expect(controlEl.style.zIndex).toBe('');

  rerender(
    <MapControl position={ControlPosition.BOTTOM_CENTER}>
      <button>control button</button>
    </MapControl>
  );

  expect(controlEl.style.width).toBe('');
  expect(controlEl.style.zIndex).toBe('');
});

test('style prop applies react style semantics for numbers', () => {
  render(
    <MapControl
      position={ControlPosition.BOTTOM_CENTER}
      style={{width: 100, zIndex: 5}}>
      <button>control button</button>
    </MapControl>
  );

  const controlsArray = mapInstance.controls[ControlPosition.BOTTOM_CENTER];
  const [controlEl] = (controlsArray.push as jest.Mock).mock.calls[0];

  // numbers get an implicit px suffix, except for unitless properties
  expect(controlEl.style.width).toBe('100px');
  expect(controlEl.style.zIndex).toBe('5');
});

test('style prop supports css custom properties', () => {
  render(
    <MapControl
      position={ControlPosition.BOTTOM_CENTER}
      style={{'--control-bg': 'red'} as CSSProperties}>
      <button>control button</button>
    </MapControl>
  );

  const controlsArray = mapInstance.controls[ControlPosition.BOTTOM_CENTER];
  const [controlEl] = (controlsArray.push as jest.Mock).mock.calls[0];

  expect(controlEl.style.getPropertyValue('--control-bg')).toBe('red');
});

test('style prop updates leave unrelated inline styles intact', () => {
  const {rerender} = render(
    <MapControl
      position={ControlPosition.BOTTOM_CENTER}
      style={{width: '100%'}}>
      <button>control button</button>
    </MapControl>
  );

  const controlsArray = mapInstance.controls[ControlPosition.BOTTOM_CENTER];
  const [controlEl] = (controlsArray.push as jest.Mock).mock.calls[0];

  // the maps api positions the control container once it has been pushed, so
  // updating the style prop must not discard properties it did not set
  controlEl.style.position = 'absolute';

  rerender(
    <MapControl position={ControlPosition.BOTTOM_CENTER} style={{width: '50%'}}>
      <button>control button</button>
    </MapControl>
  );

  expect(controlEl.style.width).toBe('50%');
  expect(controlEl.style.position).toBe('absolute');
});
