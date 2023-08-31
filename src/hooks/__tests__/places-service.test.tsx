import React from 'react';
import {renderHook, waitFor} from '@testing-library/react';
import {initialize, PlacesService} from '@googlemaps/jest-mocks';

import {APIProvider} from '../../components/api-provider';
import {usePlacesService} from '../places-service';

import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;
let divElement: HTMLDivElement;

beforeEach(() => {
  initialize();

  divElement = document.createElement('div');

  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'} libraries={['places']}>
      {children}
    </APIProvider>
  );
});

test('it should initialize a places service instance', async () => {
  const {result} = renderHook(
    () => usePlacesService({attributionContainer: divElement}),
    {wrapper}
  );

  const service = await waitForMockInstance(PlacesService);

  expect(result.current).toBe(service);
  expect(service).toBeInstanceOf(google.maps.places.PlacesService);
});

test('it throws an error if the places library is missing', async () => {
  // pretend the places library wasn't loaded
  // @ts-expect-error - testing error case
  delete google.maps.places;

  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  const {result} = renderHook(
    () => usePlacesService({attributionContainer: divElement}),
    {wrapper}
  );

  await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalled());
  expect(result.current).toBe(null);
  expect(consoleErrorSpy.mock.lastCall).toMatchSnapshot();
});
