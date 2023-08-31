import React, {JSX} from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {APIProvider} from '../api-provider';
import {Map as GoogleMap} from '../map';
import {AdvancedMarker} from '../advanced-marker';
import {Pin, PinProps} from '../pin';

import {waitForSpy} from './__utils__/wait-for-spy';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;

let createMarkerSpy: jest.Mock<
  void,
  [google.maps.marker.AdvancedMarkerElementOptions]
>;
let createPinElementSpy: jest.Mock<
  void,
  [google.maps.marker.PinElementOptions]
>;

beforeEach(() => {
  initialize();

  // Create wrapper component
  wrapper = ({children}: {children: React.ReactNode}) => (
    <APIProvider apiKey={'apikey'} libraries={['places']}>
      <GoogleMap zoom={10} center={{lat: 0, lng: 0}}>
        {children}
      </GoogleMap>
    </APIProvider>
  );

  createMarkerSpy = jest.fn();

  google.maps.marker.AdvancedMarkerElement = class extends (
    google.maps.marker.AdvancedMarkerElement
  ) {
    constructor(options: google.maps.marker.AdvancedMarkerElementOptions) {
      createMarkerSpy(options);
      super(options);
    }
  };

  createPinElementSpy = jest.fn();

  google.maps.marker.PinElement = class extends google.maps.marker.PinElement {
    __options: google.maps.marker.PinElementOptions;
    constructor(options: google.maps.marker.PinElementOptions) {
      super(options);
      this.__options = options;
      createPinElementSpy(options);
    }
  };
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

test('pin view logs an error when used outside of AdvancedMarker', async () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(<Pin />, {
    wrapper
  });

  // expect an error-message to be written to console
  const errorArgs = await waitForSpy(errorSpy);

  expect(errorArgs).toMatchSnapshot();

  // assert that no instance was created
  expect(mockInstances.get(google.maps.marker.PinElement)).toHaveLength(0);
});

// skipped due to a broken implementation of Pin in @googlemaps/jest-mocks
xtest('props are passed to Pin instance', async () => {
  const pinViewProps: PinProps = {
    background: 'yellow',
    borderColor: 'green'
  };

  const {rerender} = render(
    <AdvancedMarker>
      <Pin {...pinViewProps} />
    </AdvancedMarker>,
    {
      wrapper
    }
  );

  await waitForSpy(createPinElementSpy);

  expect(createMarkerSpy).toHaveBeenCalled();

  expect(createPinElementSpy).toHaveBeenCalled();
  expect(createPinElementSpy.mock.lastCall![0]).toEqual(pinViewProps);

  rerender(
    <AdvancedMarker>
      <Pin background={'blue'} borderColor={'black'} scale={1.2} />
    </AdvancedMarker>
  );

  const [lastOptions] = createPinElementSpy.mock.lastCall!;

  expect(lastOptions.background).toEqual('blue');
  expect(lastOptions.borderColor).toEqual('black');
  expect(lastOptions.scale).toEqual(1.2);
});
