import React from 'react';
import {ElevationService, initialize} from '@googlemaps/jest-mocks';
import {renderHook} from '@testing-library/react';

import {APIProvider} from '../../components/api-provider';
import {useElevationService} from '../elevation-service';

import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;

beforeEach(() => {
  initialize();

  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>{children}</APIProvider>
  );
});

test('elevation service hook is rendered', async () => {
  const {result} = renderHook(() => useElevationService(), {
    wrapper
  });

  const service = await waitForMockInstance(ElevationService);

  expect(service).toBeDefined();
  expect(result.current).toBe(service);
  expect(service).toBeInstanceOf(google.maps.ElevationService);
});
