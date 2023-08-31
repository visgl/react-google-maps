import React from 'react';
import {renderHook} from '@testing-library/react';
import {initialize, Geocoder} from '@googlemaps/jest-mocks';

import {useGeocodingService} from '../geocoding-service';
import {APIProvider} from '../../components/api-provider';
import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;

beforeEach(() => {
  initialize();

  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>{children}</APIProvider>
  );
});

test('it should initialize a geocoder instance', async () => {
  const {result} = renderHook(() => useGeocodingService(), {wrapper});

  const service = await waitForMockInstance(Geocoder);

  expect(result.current).toBe(service);
  expect(service).toBeInstanceOf(google.maps.Geocoder);
});
