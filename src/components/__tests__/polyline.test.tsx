import React from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {Polyline} from '../polyline';
import {useMap} from '../../hooks/use-map';
import {useMapsLibrary} from '../../hooks/use-maps-library';
import MockedFunction = jest.MockedFunction;

jest.mock('../../hooks/use-map');
jest.mock('../../hooks/use-maps-library');

let useMapMock: jest.MockedFn<typeof useMap>;
let mapInstance: google.maps.Map;
let createPolylineSpy: jest.Mock;

beforeEach(() => {
  initialize();
  jest.clearAllMocks();

  useMapMock = jest.mocked(useMap);
  mapInstance = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mapInstance);
  jest.mocked(useMapsLibrary).mockReturnValue(null);

  // overwrite polyline mock so we can spy on the constructor
  createPolylineSpy = jest.fn();
  google.maps.Polyline = class extends google.maps.Polyline {
    constructor(opts?: google.maps.PolylineOptions | null) {
      createPolylineSpy(opts);
      super(opts);
    }
  };
});

afterEach(() => {
  cleanup();
});

test('polyline should be initialized', () => {
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];
  render(<Polyline path={path} />);

  expect(createPolylineSpy).toHaveBeenCalled();

  const polylines = mockInstances.get(google.maps.Polyline);
  expect(polylines).toHaveLength(1);

  const [polyline] = polylines;
  expect(polyline.setMap).toHaveBeenCalled();
  const setMapMock = polyline.setMap as MockedFunction<typeof polyline.setMap>;
  const [map] = setMapMock.mock.calls[0];
  expect(map).toBeInstanceOf(google.maps.Map);
});

test('polyline should have a click listener', () => {
  const handleClick = jest.fn();
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];

  render(<Polyline path={path} onClick={handleClick} />);

  expect(createPolylineSpy).toHaveBeenCalled();

  const polylineMocks = mockInstances.get(google.maps.Polyline);
  const polylineMock = polylineMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    polylineMock,
    'click',
    expect.any(Function)
  );
});

test('polyline should send a nested option mutated in place', () => {
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];
  const icons = [{offset: '50%'}];

  const {rerender} = render(
    <Polyline path={path} icons={icons} strokeColor="#ff0000" />
  );

  const polyline = mockInstances.get(google.maps.Polyline)[0];
  (polyline.setOptions as jest.Mock).mockClear();

  // mutating in place keeps the same reference, so a shallow copy of the
  // tracked options would compare the array against itself and drop the change
  icons[0].offset = '75%';

  rerender(<Polyline path={path} icons={icons} strokeColor="#00ff00" />);

  const [sent] = (polyline.setOptions as jest.Mock).mock.calls[0];
  expect(Object.keys(sent).sort()).toEqual(['icons', 'strokeColor']);
  expect(sent.icons).toEqual([{offset: '75%'}]);
});

test('polyline should only send the options that changed', () => {
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];

  const {rerender} = render(<Polyline path={path} strokeOpacity={0.2} />);

  const polylines = mockInstances.get(google.maps.Polyline);
  const polyline = polylines[0];

  (polyline.setOptions as jest.Mock).mockClear();

  rerender(<Polyline path={path} strokeOpacity={0.5} />);

  expect(polyline.setOptions).toHaveBeenCalledTimes(1);
  // assert the keys: toHaveBeenCalledWith ignores undefined-valued ones,
  // so it would also accept an extra `editable: undefined`
  const [sent] = (polyline.setOptions as jest.Mock).mock.calls[0];
  expect(Object.keys(sent)).toEqual(['strokeOpacity']);
  expect(sent.strokeOpacity).toBe(0.5);
});

test('polyline should update options on rerender', () => {
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];

  const {rerender} = render(<Polyline path={path} strokeColor="#ff0000" />);

  expect(createPolylineSpy).toHaveBeenCalled();

  const polylines = mockInstances.get(google.maps.Polyline);
  const polyline = polylines[0];

  rerender(<Polyline path={path} strokeColor="#00ff00" />);

  expect(polyline.setOptions).toHaveBeenCalledWith(
    expect.objectContaining({strokeColor: '#00ff00'})
  );
});

test('polyline should be removed from map on unmount', () => {
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];
  const {unmount} = render(<Polyline path={path} />);

  const polylines = mockInstances.get(google.maps.Polyline);
  const polyline = polylines[0];

  unmount();

  expect(polyline.setMap).toHaveBeenCalledWith(null);
});

test('polyline should use defaultPath for initial value', () => {
  const defaultPath = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];
  render(<Polyline defaultPath={defaultPath} />);

  expect(createPolylineSpy).toHaveBeenCalledWith(
    expect.objectContaining({path: defaultPath})
  );
});

test('polyline path prop should take precedence over defaultPath', () => {
  const path = [
    {lat: 5, lng: 6},
    {lat: 7, lng: 8}
  ];
  const defaultPath = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];
  render(<Polyline path={path} defaultPath={defaultPath} />);

  expect(createPolylineSpy).toHaveBeenCalledWith(
    expect.objectContaining({path})
  );
});

test('polyline should call onPathChanged on dragend', () => {
  const handlePathChanged = jest.fn();
  const path = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];

  render(<Polyline path={path} draggable onPathChanged={handlePathChanged} />);

  const polylineMocks = mockInstances.get(google.maps.Polyline);
  const polylineMock = polylineMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    polylineMock,
    'dragend',
    expect.any(Function)
  );
});

function createFakeMvcPath(path: google.maps.LatLngLiteral[]) {
  return {
    getLength: () => path.length,
    getAt: (index: number) => path[index],
    getArray: () => path
  };
}

function trackPolylinePath(initialPath: google.maps.LatLngLiteral[]) {
  const state = {current: createFakeMvcPath(initialPath)};

  google.maps.Polyline = class extends google.maps.Polyline {
    constructor(opts?: google.maps.PolylineOptions | null) {
      super(opts);
      this.getPath = jest.fn(
        () =>
          state.current as unknown as google.maps.MVCArray<google.maps.LatLng>
      );
      this.setPath = jest.fn(newPath => {
        state.current = createFakeMvcPath(
          newPath as google.maps.LatLngLiteral[]
        );
      });
    }
  };

  return state;
}

function getListener(target: unknown, eventName: string) {
  const addListenerMock = jest.mocked(google.maps.event.addListener);
  const call = addListenerMock.mock.calls
    .filter(([t, name]) => t === target && name === eventName)
    .at(-1);

  return call?.[2] as (() => void) | undefined;
}

test('polyline should listen to the path set by a controlled path update', () => {
  const handlePathChanged = jest.fn();
  const initialPath = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];
  const updatedPath = [
    {lat: 5, lng: 6},
    {lat: 7, lng: 8}
  ];
  const state = trackPolylinePath(initialPath);

  const {rerender} = render(
    <Polyline path={initialPath} editable onPathChanged={handlePathChanged} />
  );

  rerender(
    <Polyline path={updatedPath} editable onPathChanged={handlePathChanged} />
  );

  const [polyline] = mockInstances.get(google.maps.Polyline);
  expect(polyline.setPath).toHaveBeenCalledWith(updatedPath);

  const listener = getListener(state.current, 'set_at');
  expect(listener).toBeDefined();

  listener!();
  expect(handlePathChanged).toHaveBeenCalledWith(updatedPath);
});

test('polyline should listen to the path decoded once the geometry library loads', () => {
  const handlePathChanged = jest.fn();
  const decodedPath = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];
  const state = trackPolylinePath([]);

  const {rerender} = render(
    <Polyline
      encodedPath="encoded"
      editable
      onPathChanged={handlePathChanged}
    />
  );

  jest.mocked(useMapsLibrary).mockReturnValue({
    encoding: {decodePath: jest.fn(() => decodedPath)}
  } as unknown as google.maps.GeometryLibrary);

  rerender(
    <Polyline
      encodedPath="encoded"
      editable
      onPathChanged={handlePathChanged}
    />
  );

  const [polyline] = mockInstances.get(google.maps.Polyline);
  expect(polyline.setPath).toHaveBeenCalledWith(decodedPath);

  const listener = getListener(state.current, 'set_at');
  expect(listener).toBeDefined();

  listener!();
  expect(handlePathChanged).toHaveBeenCalledWith(decodedPath);
});
