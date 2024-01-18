import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import '@testing-library/jest-dom';

import {Map as GoogleMap} from '../map';
import {APIProviderContext, APIProviderContextValue} from '../api-provider';
import {APILoadingStatus} from '../../libraries/api-loading-status';

jest.mock('../../libraries/google-maps-api-loader');

let wrapper: ({children}: {children: React.ReactNode}) => JSX.Element | null;
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

  wrapper = ({children}: {children: React.ReactNode}) => (
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
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

test('map instance is created after api is loaded', async () => {
  mockContextValue.status = APILoadingStatus.LOADING;

  const {rerender} = render(<GoogleMap />, {wrapper});
  expect(createMapSpy).not.toHaveBeenCalled();

  // rerender after loading completes
  mockContextValue.status = APILoadingStatus.LOADED;
  rerender(<GoogleMap />);
  expect(createMapSpy).toHaveBeenCalled();
});

test("map is registered as 'default' when no id is specified", () => {
  render(<GoogleMap />, {wrapper});

  expect(mockContextValue.addMapInstance).toHaveBeenCalledWith(
    mockInstances.get(google.maps.Map).at(-1),
    undefined
  );
});

test('throws an exception when rendering outside API provider', () => {
  // mute react error-message in test output
  jest.spyOn(console, 'error').mockImplementation(() => {});

  // render without wrapper
  expect(() => render(<GoogleMap />)).toThrowErrorMatchingSnapshot();
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
    expect(actualEl).toBe(screen.getByTestId('map'));
    expect(actualOptions).toMatchObject({
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
});

describe('map events and event-props', () => {
  test.todo('events dispatched by the map are received via event-props');
});

describe('camera updates', () => {
  test.todo('initial camera state is passed via mapOptions, not moveCamera');
  test.todo('updated camera state is passed to moveCamera');
  test.todo("re-renders with unchanged camera state don't trigger moveCamera");
  test.todo(
    "re-renders with props received via events don't trigger moveCamera"
  );
});
