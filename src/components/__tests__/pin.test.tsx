import React from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {AdvancedMarker} from '../advanced-marker';
import {Pin, PinProps} from '../pin';
import {useMap} from '../../hooks/use-map';
import {useMapsLibrary} from '../../hooks/use-maps-library';

import {waitForSpy} from './__utils__/wait-for-spy';

jest.mock('../../hooks/use-map');
jest.mock('../../hooks/use-maps-library');

let useMapMock: jest.MockedFn<typeof useMap>;
let useMapsLibraryMock: jest.MockedFn<typeof useMapsLibrary>;
let mapInstance: google.maps.Map;
let markerLib: google.maps.MarkerLibrary;

let createMarkerSpy: jest.Mock<
  void,
  [google.maps.marker.AdvancedMarkerElementOptions]
>;
let createPinElementSpy: jest.Mock<
  void,
  [google.maps.marker.PinElementOptions]
>;

beforeEach(async () => {
  initialize();
  jest.clearAllMocks();

  useMapMock = jest.mocked(useMap);
  useMapsLibraryMock = jest.mocked(useMapsLibrary);

  mapInstance = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mapInstance);

  markerLib = (await google.maps.importLibrary(
    'marker'
  )) as google.maps.MarkerLibrary;
  useMapsLibraryMock.mockReturnValue(markerLib);

  createMarkerSpy = jest.fn();

  const AdvancedMarkerElement = class extends google.maps.marker
    .AdvancedMarkerElement {
    constructor(options: google.maps.marker.AdvancedMarkerElementOptions) {
      createMarkerSpy(options);
      super(options);
      this.content = document.createElement('div');
    }
  };

  customElements.define(
    `gmp-advanced-marker-${Math.random().toString(36).slice(2)}`,
    AdvancedMarkerElement
  );

  google.maps.marker.AdvancedMarkerElement = markerLib.AdvancedMarkerElement =
    AdvancedMarkerElement;

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
});

test('pin view logs an error when used outside of AdvancedMarker', async () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(<Pin />);

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
    </AdvancedMarker>
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
