import React from 'react';
import {renderHook} from '@testing-library/react';
import {initialize, MaxZoomService} from '@googlemaps/jest-mocks';

import {APIProvider} from '../../components/api-provider';
import {useMaxZoomService} from '../max-zoom-service';
import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;

beforeEach(() => {
  initialize();

  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>{children}</APIProvider>
  );
});

test('it should initialize a max zoom service instance', async () => {
  const {result} = renderHook(() => useMaxZoomService(), {wrapper});

  const service = await waitForMockInstance(MaxZoomService);

  expect(result.current).toBe(service);
  expect(service).toBeInstanceOf(google.maps.MaxZoomService);
});
