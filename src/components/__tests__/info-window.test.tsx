import React from 'react';
import {cleanup, queryByTestId, render} from '@testing-library/react';
import {initialize} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom';

import {InfoWindow as InfoWindowComponent} from '../info-window';
import {useMap} from '../../hooks/use-map';
import {useMapsLibrary} from '../../hooks/use-maps-library';

import {waitForMockInstance} from './__utils__/wait-for-mock-instance';

jest.mock('../../hooks/use-map');
jest.mock('../../hooks/use-maps-library');

let createInfowindowSpy: jest.Mock;
let useMapMock: jest.MockedFn<typeof useMap>;
let useMapsLibraryMock: jest.MockedFn<typeof useMapsLibrary>;

beforeEach(async () => {
  initialize();
  jest.clearAllMocks();

  useMapMock = jest.mocked(useMap);
  useMapsLibraryMock = jest.mocked(useMapsLibrary);

  createInfowindowSpy = jest.fn().mockName('InfoWindow.constructor');
  google.maps.InfoWindow = class extends google.maps.InfoWindow {
    constructor(o?: google.maps.InfoWindowOptions) {
      createInfowindowSpy(o);
      super(o);
    }
  };
});

afterEach(() => {
  cleanup();
});

test('InfoWindow creates a InfoWindow instance and passes options', async () => {
  useMapsLibraryMock.mockReturnValue(null);
  useMapMock.mockReturnValue(null);

  const {rerender} = render(
    <InfoWindowComponent
      ariaLabel={'ariaLabel'}
      position={{lat: 1, lng: 2}}
      minWidth={200}
      maxWidth={300}
      zIndex={99}
      pixelOffset={[5, 6]}
      disableAutoPan></InfoWindowComponent>
  );

  expect(useMapsLibraryMock).toHaveBeenCalledWith('maps');
  expect(createInfowindowSpy).not.toHaveBeenCalled();

  const mapsLib = google.maps;
  useMapsLibraryMock.mockReturnValue(mapsLib);

  rerender(
    <InfoWindowComponent
      ariaLabel={'ariaLabel'}
      position={{lat: 1, lng: 2}}
      minWidth={200}
      maxWidth={300}
      zIndex={99}
      pixelOffset={[5, 6]}
      disableAutoPan></InfoWindowComponent>
  );

  expect(createInfowindowSpy).toHaveBeenCalled();

  const [actualOptions] = createInfowindowSpy.mock.calls[0];
  expect(actualOptions).toMatchObject({
    ariaLabel: 'ariaLabel',
    position: {lat: 1, lng: 2},
    minWidth: 200,
    maxWidth: 300,
    zIndex: 99,
    disableAutoPan: true
  });

  expect(actualOptions.pixelOffset).toBeInstanceOf(google.maps.Size);
  expect(actualOptions.pixelOffset.width).toBe(5);
  expect(actualOptions.pixelOffset.height).toBe(6);

  const infoWindow = jest.mocked(
    await waitForMockInstance(google.maps.InfoWindow)
  );

  expect(infoWindow).toBeDefined();
  expect(infoWindow.setOptions).not.toHaveBeenCalled();
});

test('InfoWindow should render content into detached node', async () => {
  const mapsLib = google.maps;
  useMapsLibraryMock.mockReturnValue(mapsLib);

  const mockMap = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mockMap);

  const marker = new google.maps.marker.AdvancedMarkerElement();

  render(
    <InfoWindowComponent
      anchor={marker}
      shouldFocus={false}
      className={'infowindow-content'}
      style={{backgroundColor: 'red', padding: 8}}>
      <span data-testid={'content'}>Hello World!</span>
    </InfoWindowComponent>
  );

  const infoWindow = jest.mocked(
    await waitForMockInstance(google.maps.InfoWindow)
  );

  // assert .open() was called with correct options
  expect(infoWindow.open).toHaveBeenCalled();
  const [openOptions] = infoWindow.open.mock.calls[0] as [
    google.maps.InfoWindowOpenOptions
  ];
  expect(openOptions.map).toBe(mockMap);
  expect(openOptions.anchor).toBe(marker);
  expect(openOptions.shouldFocus).toBe(false);

  // assert setContent was called with the content element
  expect(infoWindow.setContent).toHaveBeenCalledTimes(1);
  const [contentEl] = infoWindow.setContent.mock.calls[0] as [HTMLElement];
  expect(contentEl).toBeInstanceOf(HTMLElement);

  // style and className should be applied to the content element
  expect(contentEl).toHaveClass('infowindow-content');
  expect(contentEl).toHaveStyle({backgroundColor: 'red', padding: '8px'});

  // child nodes should have been rendered
  expect(queryByTestId(contentEl, 'content')).toBeTruthy();
  expect(queryByTestId(contentEl, 'content')).toHaveTextContent('Hello World!');

  expect(infoWindow.open).toHaveBeenCalled();
});

test.todo('InfoWindow updates options and content correctly');
test.todo('InfoWindow cleanup');
test.todo('InfoWindow events');
