import React from 'react';
import {cleanup, queryByTestId, render} from '@testing-library/react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom';

import {InfoWindow} from '../info-window';
import {useMap} from '../../hooks/use-map';
import {useMapsLibrary} from '../../hooks/use-maps-library';

jest.mock('../../hooks/use-map');
jest.mock('../../hooks/use-maps-library');

let createInfowindowSpy: jest.Mock;
let useMapMock: jest.MockedFn<typeof useMap>;
let useMapsLibraryMock: jest.MockedFn<typeof useMapsLibrary>;

let mapsLib: google.maps.MapsLibrary;
let map: google.maps.Map;

beforeEach(async () => {
  initialize();
  jest.clearAllMocks();

  mapsLib = (await google.maps.importLibrary(
    'maps'
  )) as google.maps.MapsLibrary;
  map = new google.maps.Map(document.createElement('div'));

  useMapMock = jest.mocked(useMap);
  useMapsLibraryMock = jest.mocked(useMapsLibrary);

  useMapMock.mockReturnValue(map);
  useMapsLibraryMock.mockImplementation(name => {
    expect(name).toEqual('maps');
    return mapsLib;
  });

  createInfowindowSpy = jest.fn().mockName('InfoWindow.new');
  const InfoWindowImpl = class extends google.maps.InfoWindow {
    constructor(o?: google.maps.InfoWindowOptions) {
      createInfowindowSpy(o);
      super(o);
    }
  };
  google.maps.InfoWindow = mapsLib.InfoWindow = InfoWindowImpl;
});

afterEach(() => {
  cleanup();
});

describe('<InfoWindow> basic functionality', () => {
  test('Infowindow is created once mapsLibrary is ready', async () => {
    useMapsLibraryMock.mockReturnValue(null);
    useMapMock.mockReturnValue(null);

    const {rerender} = render(<InfoWindow></InfoWindow>);

    expect(useMapsLibraryMock).toHaveBeenCalledWith('maps');
    expect(createInfowindowSpy).not.toHaveBeenCalled();

    // now return the mapsLib so the infowindow can be created
    useMapsLibraryMock.mockReturnValue(mapsLib);
    rerender(<InfoWindow></InfoWindow>);

    expect(createInfowindowSpy).toHaveBeenCalled();
    // infoWindow.open will only be called once the map is available
    const [iw] = mockInstances.get(google.maps.InfoWindow);
    expect(iw.open).not.toHaveBeenCalled();

    // rerendering with map present preserves the infowindow instance and opens it
    useMapMock.mockReturnValue(map);
    rerender(<InfoWindow></InfoWindow>);

    expect(iw.open).toHaveBeenCalled();
  });

  test('props get forwarded to constructor on initial creation', async () => {
    render(
      <InfoWindow
        ariaLabel={'ariaLabel'}
        position={{lat: 1, lng: 2}}
        minWidth={200}
        maxWidth={300}
        zIndex={99}
        pixelOffset={[5, 6]}
        headerDisabled={true}
        disableAutoPan></InfoWindow>
    );

    expect(createInfowindowSpy).toHaveBeenCalled();
    const [actualOptions] = createInfowindowSpy.mock.lastCall;
    expect(actualOptions).toMatchObject({
      ariaLabel: 'ariaLabel',
      position: {lat: 1, lng: 2},
      minWidth: 200,
      maxWidth: 300,
      zIndex: 99,
      disableAutoPan: true,
      headerDisabled: true
    });

    expect(actualOptions.pixelOffset).toBeInstanceOf(google.maps.Size);
    expect(actualOptions.pixelOffset.width).toBe(5);
    expect(actualOptions.pixelOffset.height).toBe(6);
  });

  test('changing options get passed to setOptions()', async () => {
    const position = {lat: 1, lng: 2};
    const {rerender} = render(<InfoWindow position={position}></InfoWindow>);

    expect(createInfowindowSpy).toHaveBeenCalled();
    const [initialOptions] = createInfowindowSpy.mock.lastCall;
    expect(initialOptions).toEqual({position: {lat: 1, lng: 2}});

    rerender(
      <InfoWindow
        position={position}
        minWidth={200}
        maxWidth={300}></InfoWindow>
    );

    const [iw] = jest.mocked(mockInstances.get(google.maps.InfoWindow));

    expect(iw.setOptions).toHaveBeenCalled();
    const [updatedOptions] = iw.setOptions.mock.lastCall as [unknown];
    expect(updatedOptions).toMatchObject({
      minWidth: 200,
      maxWidth: 300,
      position: {lat: 1, lng: 2}
    });
  });

  test('props get forwarded to openOptions', async () => {
    const marker = new google.maps.marker.AdvancedMarkerElement();

    render(<InfoWindow anchor={marker} shouldFocus={false}></InfoWindow>);

    const [iw] = jest.mocked(mockInstances.get(google.maps.InfoWindow));
    expect(iw.open).toHaveBeenCalled();

    const [openOptions] = iw.open.mock.lastCall as [unknown];

    expect(openOptions).toEqual({anchor: marker, map, shouldFocus: false});
  });
});

describe('<InfoWindow> content rendering', () => {
  test('InfoWindow should render content into portal node', async () => {
    render(
      <InfoWindow
        className={'infowindow-content'}
        style={{backgroundColor: 'red', padding: 8}}>
        <span data-testid={'content'}>Hello World!</span>
      </InfoWindow>
    );

    expect(createInfowindowSpy).toHaveBeenCalled();
    const [infoWindow] = jest.mocked(mockInstances.get(google.maps.InfoWindow));

    // assert setContent was called with the content element
    expect(infoWindow.setContent).toHaveBeenCalledTimes(1);
    const [contentEl] = infoWindow.setContent.mock.lastCall as [HTMLElement];
    expect(contentEl).toBeInstanceOf(HTMLElement);

    // style and className should be applied to the content element
    expect(contentEl).toHaveClass('infowindow-content');
    expect(contentEl).toHaveStyle({backgroundColor: 'red', padding: '8px'});

    // child nodes should have been rendered into contentEl
    expect(queryByTestId(contentEl, 'content')).toHaveTextContent(
      'Hello World!'
    );
  });
});

describe('<InfoWindow> headerContent rendering', () => {
  test('passes headerContent to options when its a string', async () => {
    render(<InfoWindow headerContent={'Infowindow Header'}></InfoWindow>);

    expect(createInfowindowSpy).toHaveBeenCalled();
    const [options] = createInfowindowSpy.mock.lastCall;
    expect(options).toEqual({headerContent: 'Infowindow Header'});
  });

  test('creates a dom-element when passing a ReactNode', async () => {
    render(<InfoWindow headerContent={<h3>Infowindow Header</h3>} />);

    expect(createInfowindowSpy).toHaveBeenCalled();
    const [options] = createInfowindowSpy.mock.lastCall;
    expect(options.headerContent).toBeInstanceOf(HTMLElement);
    expect(options.headerContent).toContainHTML('<h3>Infowindow Header</h3>');
  });

  test('updates html-content when content props changes', async () => {
    const {rerender} = render(
      <InfoWindow headerContent={<h3>Infowindow Header</h3>}></InfoWindow>
    );

    rerender(
      <InfoWindow headerContent={<h3>New Infowindow Header</h3>}></InfoWindow>
    );
    const [iw] = jest.mocked(mockInstances.get(google.maps.InfoWindow));

    expect(iw.setOptions).toHaveBeenCalled();
    const [updatedOptions] = iw.setOptions.mock.lastCall as [
      google.maps.InfoWindowOptions
    ];
    expect(updatedOptions.headerContent).toBeInstanceOf(HTMLElement);
    expect(updatedOptions.headerContent).toContainHTML(
      '<h3>New Infowindow Header</h3>'
    );
  });

  test('changes from text- to html-content', async () => {
    const {rerender} = render(<InfoWindow headerContent="abcd"></InfoWindow>);

    rerender(
      <InfoWindow headerContent={<h3>New Infowindow Header</h3>}></InfoWindow>
    );
    const [iw] = jest.mocked(mockInstances.get(google.maps.InfoWindow));

    expect(iw.setOptions).toHaveBeenCalled();
    const [updatedOptions] = iw.setOptions.mock.lastCall as [
      google.maps.InfoWindowOptions
    ];
    expect(updatedOptions.headerContent).toBeInstanceOf(HTMLElement);
    expect(updatedOptions.headerContent).toContainHTML(
      '<h3>New Infowindow Header</h3>'
    );
  });

  test('changes from html-content to no content', async () => {
    const {rerender} = render(
      <InfoWindow headerContent={<h3>New Infowindow Header</h3>}></InfoWindow>
    );

    rerender(<InfoWindow></InfoWindow>);

    const [iw] = jest.mocked(mockInstances.get(google.maps.InfoWindow));

    expect(iw.setOptions).toHaveBeenCalled();
    const [updatedOptions] = iw.setOptions.mock.lastCall as [
      google.maps.InfoWindowOptions
    ];
    expect(updatedOptions.headerContent).toBeNull();
  });
});

describe('<InfoWindow> cleanup', () => {
  test('infowindow is closed when unmounted', () => {
    const marker = new google.maps.marker.AdvancedMarkerElement();
    const {rerender} = render(
      <>
        <InfoWindow anchor={marker} />
      </>
    );

    expect(createInfowindowSpy).toHaveBeenCalled();
    const [infoWindow] = jest.mocked(mockInstances.get(google.maps.InfoWindow));
    expect(infoWindow.open).toHaveBeenCalled();

    rerender(<></>);

    expect(infoWindow.close).toHaveBeenCalled();
  });
});

describe('<InfoWindow> events', () => {
  test('triggers onClose and onCloseClick handlers on event', async () => {
    const onCloseSpy = jest.fn();
    const onCloseClickSpy = jest.fn();

    const gme = jest.mocked(google.maps.event);
    gme.addListener.mockImplementation(() => ({remove: jest.fn()}));

    render(<InfoWindow onClose={onCloseSpy} onCloseClick={onCloseClickSpy} />);

    expect(createInfowindowSpy).toHaveBeenCalled();
    const [infoWindow] = jest.mocked(mockInstances.get(google.maps.InfoWindow));

    expect(gme.addListener).toHaveBeenCalledWith(
      infoWindow,
      'close',
      onCloseSpy
    );
    expect(gme.addListener).toHaveBeenCalledWith(
      infoWindow,
      'closeclick',
      onCloseClickSpy
    );
  });

  test('removes handlers on unmount', async () => {
    const listeners = {
      close: {remove: jest.fn()},
      closeclick: {remove: jest.fn()}
    };
    const gme = jest.mocked(google.maps.event);
    gme.addListener.mockImplementation(
      (_, name) => listeners[name as keyof typeof listeners]
    );

    const {rerender} = render(
      <>
        <InfoWindow onClose={jest.fn()} onCloseClick={jest.fn()} />
      </>
    );

    rerender(<></>);

    expect(listeners.close.remove).toHaveBeenCalled();
    expect(listeners.closeclick.remove).toHaveBeenCalled();
  });
});
