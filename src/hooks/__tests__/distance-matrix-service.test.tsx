import React from 'react';
import {renderHook, waitFor} from '@testing-library/react';
import {initialize, DistanceMatrixService} from '@googlemaps/jest-mocks';

import {APIProvider} from '../../components/api-provider';
import {useDistanceMatrixService} from '../distance-matrix-service';
import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;

beforeEach(() => {
  initialize();

  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>{children}</APIProvider>
  );
});

test('distance matrix service hook is rendered', async () => {
  const {result} = renderHook(() => useDistanceMatrixService(), {
    wrapper
  });

  const service = await waitForMockInstance(DistanceMatrixService);

  expect(service).toBeDefined();
  expect(result.current).toBe(service);
  expect(service).toBeInstanceOf(google.maps.DistanceMatrixService);
});

test('it throws an error if the distance matrix service library is missing', async () => {
  // pretend the distance matrix service library wasn't loaded
  // @ts-expect-error - testing error case
  delete google.maps.DistanceMatrixService;

  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  const {result} = renderHook(() => useDistanceMatrixService(), {wrapper});

  await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalled());

  expect(result.current).toBe(null);
  expect(consoleErrorSpy.mock.lastCall).toMatchSnapshot();
});
