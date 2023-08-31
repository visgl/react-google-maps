import React from 'react';
import {renderHook} from '@testing-library/react';
import {initialize, DirectionsService} from '@googlemaps/jest-mocks';

import {APIProvider} from '../../components/api-provider';
import {useDirectionsService} from '../directions-service';

import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;

beforeEach(() => {
  initialize();

  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>{children}</APIProvider>
  );
});

test('directions service is initialized', async () => {
  const {result} = renderHook(() => useDirectionsService(), {wrapper});

  const service = await waitForMockInstance(DirectionsService);

  expect(service).toBeDefined();
  expect(result.current.directionsService).toBe(service);
  expect(service).toBeInstanceOf(google.maps.DirectionsService);
});
