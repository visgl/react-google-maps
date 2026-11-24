import React from 'react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';
import {cleanup, render} from '@testing-library/react';

import {Polygon} from '../polygon';
import {useMap} from '../../hooks/use-map';
import {useMapsLibrary} from '../../hooks/use-maps-library';
import MockedFunction = jest.MockedFunction;

jest.mock('../../hooks/use-map');
jest.mock('../../hooks/use-maps-library');

let useMapMock: jest.MockedFn<typeof useMap>;
let mapInstance: google.maps.Map;
let createPolygonSpy: jest.Mock;

beforeEach(() => {
  initialize();
  jest.clearAllMocks();

  useMapMock = jest.mocked(useMap);
  mapInstance = new google.maps.Map(document.createElement('div'));
  useMapMock.mockReturnValue(mapInstance);
  jest.mocked(useMapsLibrary).mockReturnValue(null);

  // overwrite polygon mock so we can spy on the constructor
  createPolygonSpy = jest.fn();
  google.maps.Polygon = class extends google.maps.Polygon {
    constructor(opts?: google.maps.PolygonOptions | null) {
      createPolygonSpy(opts);
      super(opts);
    }
  };
});

afterEach(() => {
  cleanup();
});

test('polygon should be initialized', () => {
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];
  render(<Polygon paths={paths} />);

  expect(createPolygonSpy).toHaveBeenCalled();

  const polygons = mockInstances.get(google.maps.Polygon);
  expect(polygons).toHaveLength(1);

  const [polygon] = polygons;
  expect(polygon.setMap).toHaveBeenCalled();
  const setMapMock = polygon.setMap as MockedFunction<typeof polygon.setMap>;
  const [map] = setMapMock.mock.calls[0];
  expect(map).toBeInstanceOf(google.maps.Map);
});

test('polygon should have a click listener', () => {
  const handleClick = jest.fn();
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];

  render(<Polygon paths={paths} onClick={handleClick} />);

  expect(createPolygonSpy).toHaveBeenCalled();

  const polygonMocks = mockInstances.get(google.maps.Polygon);
  const polygonMock = polygonMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    polygonMock,
    'click',
    expect.any(Function)
  );
});

test('polygon should update options on rerender', () => {
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];

  const {rerender} = render(<Polygon paths={paths} fillColor="#ff0000" />);

  expect(createPolygonSpy).toHaveBeenCalled();

  const polygons = mockInstances.get(google.maps.Polygon);
  const polygon = polygons[0];

  rerender(<Polygon paths={paths} fillColor="#00ff00" />);

  expect(polygon.setOptions).toHaveBeenCalledWith(
    expect.objectContaining({fillColor: '#00ff00'})
  );
});

test('polygon should not re-apply the options it was constructed with', () => {
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];

  render(<Polygon paths={paths} fillOpacity={0.2} />);

  const polygons = mockInstances.get(google.maps.Polygon);
  const polygon = polygons[0];

  // the constructor already received the full option set, so writing it again
  // would rebuild the vertex handles for nothing
  expect(polygon.setOptions).not.toHaveBeenCalled();
});

test('polygon should not re-apply options to an external instance', () => {
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4}
  ];

  const external = new google.maps.Polygon();

  render(<Polygon polygon={external} paths={paths} fillOpacity={0.2} />);

  // the creation effect applies them once; the hook must not repeat it
  expect(external.setOptions).toHaveBeenCalledTimes(1);
});

test('polygon should only send the options that changed', () => {
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];

  const {rerender} = render(<Polygon paths={paths} fillOpacity={0.2} />);

  const polygons = mockInstances.get(google.maps.Polygon);
  const polygon = polygons[0];

  (polygon.setOptions as jest.Mock).mockClear();

  rerender(<Polygon paths={paths} fillOpacity={0.5} />);

  // re-applying `editable` or `draggable` makes the maps api rebuild the
  // vertex handles, so unchanged values must not be sent again
  expect(polygon.setOptions).toHaveBeenCalledTimes(1);
  // assert the keys: toHaveBeenCalledWith ignores undefined-valued ones,
  // so it would also accept an extra `editable: undefined`
  const [sent] = (polygon.setOptions as jest.Mock).mock.calls[0];
  expect(Object.keys(sent)).toEqual(['fillOpacity']);
  expect(sent.fillOpacity).toBe(0.5);
});

test('polygon should not touch options when nothing changed', () => {
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];

  const {rerender} = render(<Polygon paths={paths} fillOpacity={0.2} />);

  const polygons = mockInstances.get(google.maps.Polygon);
  const polygon = polygons[0];

  (polygon.setOptions as jest.Mock).mockClear();

  rerender(<Polygon paths={paths} fillOpacity={0.2} />);

  expect(polygon.setOptions).not.toHaveBeenCalled();
});

test('polygon should be removed from map on unmount', () => {
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];
  const {unmount} = render(<Polygon paths={paths} />);

  const polygons = mockInstances.get(google.maps.Polygon);
  const polygon = polygons[0];

  unmount();

  expect(polygon.setMap).toHaveBeenCalledWith(null);
});

test('polygon should use defaultPaths for initial value', () => {
  const defaultPaths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];
  render(<Polygon defaultPaths={defaultPaths} />);

  expect(createPolygonSpy).toHaveBeenCalledWith(
    expect.objectContaining({paths: defaultPaths})
  );
});

test('polygon paths prop should take precedence over defaultPaths', () => {
  const paths = [
    {lat: 7, lng: 8},
    {lat: 9, lng: 10},
    {lat: 11, lng: 12}
  ];
  const defaultPaths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];
  render(<Polygon paths={paths} defaultPaths={defaultPaths} />);

  expect(createPolygonSpy).toHaveBeenCalledWith(
    expect.objectContaining({paths})
  );
});

test('polygon should call onPathsChanged on dragend', () => {
  const handlePathsChanged = jest.fn();
  const paths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];

  render(
    <Polygon paths={paths} draggable onPathsChanged={handlePathsChanged} />
  );

  const polygonMocks = mockInstances.get(google.maps.Polygon);
  const polygonMock = polygonMocks[0];

  expect(google.maps.event.addListener).toHaveBeenCalledWith(
    polygonMock,
    'dragend',
    expect.any(Function)
  );
});

type FakeMvcArray<T> = {
  getLength: () => number;
  getAt: (index: number) => T;
  getArray: () => T[];
};

function createFakeMvcArray<T>(items: T[]): FakeMvcArray<T> {
  return {
    getLength: () => items.length,
    getAt: (index: number) => items[index],
    getArray: () => items
  };
}

function createFakeMvcPaths(paths: google.maps.LatLngLiteral[][]) {
  return createFakeMvcArray(paths.map(path => createFakeMvcArray(path)));
}

function trackPolygonPaths(initialPaths: google.maps.LatLngLiteral[][]) {
  const state = {current: createFakeMvcPaths(initialPaths)};

  google.maps.Polygon = class extends google.maps.Polygon {
    constructor(opts?: google.maps.PolygonOptions | null) {
      super(opts);
      this.getPaths = jest.fn(
        () =>
          state.current as unknown as google.maps.MVCArray<
            google.maps.MVCArray<google.maps.LatLng>
          >
      );
      this.setPaths = jest.fn(newPaths => {
        state.current = createFakeMvcPaths(
          newPaths as google.maps.LatLngLiteral[][]
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

test('polygon should listen to the paths set by a controlled paths update', () => {
  const handlePathsChanged = jest.fn();
  const initialPaths = [
    [
      {lat: 1, lng: 2},
      {lat: 3, lng: 4},
      {lat: 5, lng: 6}
    ]
  ];
  const updatedPaths = [
    [
      {lat: 7, lng: 8},
      {lat: 9, lng: 10},
      {lat: 11, lng: 12}
    ]
  ];
  const state = trackPolygonPaths(initialPaths);

  const {rerender} = render(
    <Polygon
      paths={initialPaths}
      editable
      onPathsChanged={handlePathsChanged}
    />
  );

  rerender(
    <Polygon
      paths={updatedPaths}
      editable
      onPathsChanged={handlePathsChanged}
    />
  );

  const [polygon] = mockInstances.get(google.maps.Polygon);
  expect(polygon.setPaths).toHaveBeenCalledWith(updatedPaths);

  const listener = getListener(state.current.getAt(0), 'set_at');
  expect(listener).toBeDefined();

  listener!();
  expect(handlePathsChanged).toHaveBeenCalledWith([updatedPaths[0]]);
});

test('polygon should listen to the paths decoded once the geometry library loads', () => {
  const handlePathsChanged = jest.fn();
  const decodedPaths = [
    {lat: 1, lng: 2},
    {lat: 3, lng: 4},
    {lat: 5, lng: 6}
  ];
  const encodedPaths = ['encoded'];
  const state = trackPolygonPaths([]);

  const {rerender} = render(
    <Polygon
      encodedPaths={encodedPaths}
      editable
      onPathsChanged={handlePathsChanged}
    />
  );

  jest.mocked(useMapsLibrary).mockReturnValue({
    encoding: {decodePath: jest.fn(() => decodedPaths)}
  } as unknown as google.maps.GeometryLibrary);

  rerender(
    <Polygon
      encodedPaths={encodedPaths}
      editable
      onPathsChanged={handlePathsChanged}
    />
  );

  const [polygon] = mockInstances.get(google.maps.Polygon);
  expect(polygon.setPaths).toHaveBeenCalledWith([decodedPaths]);

  const listener = getListener(state.current.getAt(0), 'set_at');
  expect(listener).toBeDefined();

  listener!();
  expect(handlePathsChanged).toHaveBeenCalledWith([decodedPaths]);
});
