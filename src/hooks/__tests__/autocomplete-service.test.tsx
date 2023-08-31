import React from 'react';
import {renderHook, waitFor} from '@testing-library/react';
import {AutocompleteService, initialize} from '@googlemaps/jest-mocks';

import {APIProvider} from '../../components/api-provider';
import {useAutocompleteService} from '../autocomplete-service';

import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;

beforeEach(() => {
  initialize();

  // Wrap components with APIProvider
  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'} libraries={['places']}>
      {children}
    </APIProvider>
  );
});

test('it should initialize an autocomplete instance', async () => {
  const {result} = renderHook(() => useAutocompleteService(), {wrapper});

  const service = await waitForMockInstance(AutocompleteService);

  expect(result.current).toBe(service);
  expect(service).toBeInstanceOf(google.maps.places.AutocompleteService);
});

test('it throws an error if the places library is missing', async () => {
  // pretend the places library wasn't loaded
  // @ts-expect-error - testing error case
  delete google.maps.places;

  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  const {result} = renderHook(() => useAutocompleteService(), {wrapper});

  await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalled());
  expect(result.current).toBe(null);
  expect(consoleErrorSpy.mock.lastCall).toMatchSnapshot();
});
