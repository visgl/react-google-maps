import React from 'react';
import {renderHook, waitFor} from '@testing-library/react';
import {Autocomplete, initialize} from '@googlemaps/jest-mocks';

import {APIProvider} from '../../components/api-provider';
import {useAutocomplete} from '../autocomplete';

import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;
let onPlaceChanged: jest.Mock;
let inputField: HTMLInputElement;

beforeEach(() => {
  initialize();

  onPlaceChanged = jest.fn();
  inputField = document.createElement('input');

  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>{children}</APIProvider>
  );
});

test('it should initialize an autocomplete instance', async () => {
  const {result} = renderHook(
    () => useAutocomplete({inputField, onPlaceChanged}),
    {wrapper}
  );

  const service = await waitForMockInstance(Autocomplete);

  expect(result.current).toBe(service);
  expect(service).toBeInstanceOf(google.maps.places.Autocomplete);
});

test('it throws an error if the places library is missing', async () => {
  // pretend the places library wasn't loaded
  // @ts-expect-error - testing error case
  delete google.maps.places;

  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  const {result} = renderHook(
    () => useAutocomplete({inputField, onPlaceChanged}),
    {wrapper}
  );

  await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalled());

  expect(result.current).toBe(null);
  expect(consoleErrorSpy.mock.lastCall).toMatchSnapshot();
});

test('it adds place_changed listener to autocomplete', async () => {
  const {result} = renderHook(
    () => useAutocomplete({inputField, onPlaceChanged}),
    {wrapper}
  );

  const service = await waitForMockInstance(Autocomplete);

  expect(result.current).toBe(service);
  expect(service.addListener).toHaveBeenCalled();
});
