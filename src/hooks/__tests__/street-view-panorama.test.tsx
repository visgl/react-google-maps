import React from 'react';
import {renderHook} from '@testing-library/react';
import {initialize, StreetViewPanorama} from '@googlemaps/jest-mocks';

import {APIProvider} from '../../components/api-provider';
import {useStreetViewPanorama} from '../street-view-panorama';

import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;
let divElement: HTMLDivElement;

beforeEach(() => {
  initialize();

  divElement = document.createElement('div');

  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'}>{children}</APIProvider>
  );
});

test('it should initialize a street view panorama', async () => {
  const {result} = renderHook(() => useStreetViewPanorama({divElement}), {
    wrapper
  });

  const service = await waitForMockInstance(StreetViewPanorama);

  expect(result.current).toBe(service);
  expect(service).toBeInstanceOf(google.maps.StreetViewPanorama);
});
