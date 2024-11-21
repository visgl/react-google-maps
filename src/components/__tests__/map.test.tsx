import React, {FunctionComponent, PropsWithChildren} from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom';

import {Map as GoogleMap, MapProps} from '../map';
import {APIProviderContext, APIProviderContextValue} from '../api-provider';
import {APILoadingStatus} from '../../libraries/api-loading-status';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: FunctionComponent<PropsWithChildren>;
let mockContextValue: jest.MockedObject<APIProviderContextValue>;
let createMapSpy: jest.Mock<
  void,
  ConstructorParameters<typeof google.maps.Map>
>;

beforeEach(() => {
  initialize();

  mockContextValue = {
    importLibrary: jest.fn(),
    loadedLibraries: {},
    status: APILoadingStatus.LOADED,
    mapInstances: {},
    addMapInstance: jest.fn(),
    removeMapInstance: jest.fn(),
    clearMapInstances: jest.fn()
  };

  wrapper = ({children}) => (
    <APIProviderContext.Provider value={mockContextValue}>
      {children}
    </APIProviderContext.Provider>
  );

  createMapSpy = jest.fn();
  google.maps.Map = class extends google.maps.Map {
    constructor(...args: ConstructorParameters<typeof google.maps.Map>) {
      createMapSpy(...args);
      super(...args);
    }
  };

  // no idea why the implementation in @googlemaps/jest-mocks doesn't work as it is,
  // but this helps:
  google.maps.event.addListener = jest.fn(() => ({remove: jest.fn()}));
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

test('map instance is created after api is loaded', async () => {
  mockContextValue.status = APILoadingStatus.LOADING;

  const {rerender} = render(
    <GoogleMap zoom={8} center={{lat: 53.55, lng: 10.05}} />,
    {wrapper}
  );

  expect(createMapSpy).not.toHaveBeenCalled();

  // rerender after loading completes
  mockContextValue.status = APILoadingStatus.LOADED;
  rerender(<GoogleMap zoom={8} center={{lat: 53.55, lng: 10.05}} />);
  expect(createMapSpy).toHaveBeenCalled();
});

test("map is registered as 'default' when no id is specified", () => {
  render(<GoogleMap zoom={8} center={{lat: 53.55, lng: 10.05}} />, {wrapper});

  expect(mockContextValue.addMapInstance).toHaveBeenCalledWith(
    mockInstances.get(google.maps.Map).at(-1),
    undefined
  );
});

test('throws an exception when rendering outside API provider', () => {
  // mute react error-message in test output
  jest.spyOn(console, 'error').mockImplementation(() => {});

  // render without wrapper
  expect(() =>
    render(<GoogleMap zoom={8} center={{lat: 53.55, lng: 10.05}} />)
  ).toThrowErrorMatchingSnapshot();
});

describe('creating and updating map instance', () => {
  let rerender: (ui: React.ReactElement) => void;

  const center = {lat: 53.55, lng: 10.05};

  beforeEach(async () => {
    const view = render(
      <GoogleMap id={'mymap'} mapId={'mymapid'} center={center} zoom={12} />,
      {wrapper}
    );

    rerender = view.rerender;

    await waitFor(() => expect(screen.getByTestId('map')).toBeInTheDocument());
  });

  test('should create map instance', async () => {
    // should create a google.maps.Map instance with mapOptions
    expect(createMapSpy).toHaveBeenCalled();

    const [actualEl, actualOptions] = createMapSpy.mock.lastCall!;
    expect(screen.getByTestId('map')).toContainElement(actualEl);
    expect(actualOptions).toStrictEqual({
      center: {lat: 53.55, lng: 10.05},
      zoom: 12,
      mapId: 'mymapid'
    });

    // should register the map-instance in the context
    expect(mockContextValue.addMapInstance).toHaveBeenCalledWith(
      mockInstances.get(google.maps.Map).at(-1),
      'mymap'
    );
  });

  test("doesn't recreate the map instance when changing options", () => {
    createMapSpy.mockReset();
    rerender(
      <GoogleMap
        id={'mymap'}
        mapId={'mymapid'}
        center={center}
        zoom={14}
        backgroundColor={'red'}
      />
    );

    // check that no further constructor-calls happened
    expect(createMapSpy).not.toHaveBeenCalled();

    const map = mockInstances.get(google.maps.Map).at(-1)!;
    const [lastOptions] = jest.mocked(map.setOptions).mock.lastCall!;

    // note that changes to center, zoom, heading and tilt will not be forwarded
    expect(lastOptions).toMatchObject({backgroundColor: 'red'});
  });

  test('recreates the map when the mapId is changed', () => {
    createMapSpy.mockReset();
    rerender(
      <GoogleMap id={'mymap'} mapId={'othermapid'} center={center} zoom={14} />
    );

    expect(createMapSpy).toHaveBeenCalled();

    const [, options] = createMapSpy.mock.lastCall!;
    expect(options).toMatchObject({mapId: 'othermapid'});
  });

  test('recreates the map when the colorScheme is changed', () => {
    createMapSpy.mockReset();
    rerender(
      <GoogleMap
        id={'mymap'}
        mapId={'mymapid'}
        center={center}
        zoom={14}
        colorScheme={'DARK'}
      />
    );

    expect(createMapSpy).toHaveBeenCalled();

    const [, options] = createMapSpy.mock.lastCall!;
    expect(options).toMatchObject({colorScheme: 'DARK'});
  });

  test('recreates the map when the renderingType is changed', () => {
    createMapSpy.mockReset();
    rerender(
      <GoogleMap
        id={'mymap'}
        mapId={'mymapid'}
        center={center}
        zoom={14}
        renderingType={'VECTOR'}
      />
    );

    expect(createMapSpy).toHaveBeenCalled();

    const [, options] = createMapSpy.mock.lastCall!;
    expect(options).toMatchObject({renderingType: 'VECTOR'});
  });
});

describe('map instance caching', () => {
  test.todo(
    "map isn't recreated when unmounting and remounting with the same props"
  );
  test.todo(
    'map is recreated when unmounting and remounting with changed mapId'
  );
  test.todo(
    "map isn't recreated when unmounting and remounting with regular changed options"
  );
  test.todo('removed options are handled correctly');
});

describe('camera configuration', () => {
  test.each([
    [{}, true],
    [{center: {lat: 0, lng: 0}}, true],
    [{defaultCenter: {lat: 0, lng: 0}}, true],
    [{zoom: 1}, true],
    [{defaultZoom: 1}, true],
    [{defaultBounds: {north: 1, east: 2, south: 3, west: 4}}, false],
    [
      {
        defaultBounds: {
          north: 1,
          east: 2,
          south: 3,
          west: 4,
          padding: {
            left: 50
          }
        }
      },
      false
    ],
    [{defaultCenter: {lat: 0, lng: 0}, zoom: 0}, false],
    [{center: {lat: 0, lng: 0}, zoom: 0}, false],
    [{center: {lat: 0, lng: 0}, defaultZoom: 0}, false]
  ])(
    'logs a warning message when missing configuration',
    (props: MapProps, expectWarningMessage: boolean) => {
      // mute warning in test output
      const consoleWarn = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      render(<GoogleMap {...props} />, {wrapper});

      if (expectWarningMessage)
        expect(consoleWarn.mock.lastCall).toMatchSnapshot();
      else expect(consoleWarn).not.toHaveBeenCalled();
    }
  );

  test('makes sure that map renders without viewport configuration', async () => {
    // mute warning in test output
    console.warn = jest.fn();

    render(<GoogleMap />, {wrapper});
    await waitFor(() => expect(screen.getByTestId('map')).toBeInTheDocument());

    expect(createMapSpy).toHaveBeenCalled();

    const mapInstance = jest.mocked(mockInstances.get(google.maps.Map).at(0)!);
    expect(mapInstance.fitBounds).toHaveBeenCalledWith({
      east: 180,
      north: 90,
      south: -90,
      west: -180
    });
  });

  test.todo('initial camera state is passed via mapOptions, not moveCamera');
  test.todo('updated camera state is passed to moveCamera');
  test.todo("re-renders with unchanged camera state don't trigger moveCamera");
  test.todo(
    "re-renders with props received via events don't trigger moveCamera"
  );
});

describe('map events and event-props', () => {
  test.todo('events dispatched by the map are received via event-props');
});
