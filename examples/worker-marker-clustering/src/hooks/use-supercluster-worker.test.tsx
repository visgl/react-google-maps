import {renderHook} from '@testing-library/react';

import type {
  GeoFeatureCollection,
  SuperclusterOptions,
  SuperclusterViewport
} from './use-supercluster-worker';

class MockWorker {
  static instances: MockWorker[] = [];

  onmessage: ((event: {data: unknown}) => void) | null = null;
  onerror: ((event: {message?: string}) => void) | null = null;
  postMessage = jest.fn();
  terminate = jest.fn();

  constructor(
    public url: string | URL,
    public workerOptions?: {type?: string}
  ) {
    MockWorker.instances.push(this);
  }
}

let useSuperclusterWorker: typeof import('./use-supercluster-worker').useSuperclusterWorker;

beforeAll(async () => {
  // the hook checks `typeof Worker !== 'undefined'` at module load time, so
  // the global has to be in place before the module is first imported.
  (global as unknown as {Worker: unknown}).Worker = MockWorker;
  ({useSuperclusterWorker} = await import('./use-supercluster-worker'));
});

beforeEach(() => {
  MockWorker.instances = [];
});

const geojson: GeoFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {type: 'Point', coordinates: [0, 0]},
      properties: {}
    }
  ]
};

const viewport: SuperclusterViewport = {
  bbox: [-180, -90, 180, 90],
  zoom: 4
};

test('sends the initial options to the worker on mount', () => {
  renderHook(() =>
    useSuperclusterWorker(
      geojson,
      {radius: 60},
      viewport,
      'clustering.worker.js'
    )
  );

  const worker = MockWorker.instances[0];
  expect(worker.postMessage).toHaveBeenCalledWith({
    type: 'init',
    options: {radius: 60}
  });
});

test('propagates changed options to an already-running worker', () => {
  const {rerender} = renderHook(
    ({options}) =>
      useSuperclusterWorker(geojson, options, viewport, 'clustering.worker.js'),
    {initialProps: {options: {radius: 60} as SuperclusterOptions}}
  );

  const worker = MockWorker.instances[0];
  worker.postMessage.mockClear();

  rerender({options: {radius: 120, maxZoom: 14}});

  expect(worker.postMessage).toHaveBeenCalledWith({
    type: 'init',
    options: {radius: 120, maxZoom: 14}
  });
});

test('reloads previously loaded data after an options change, since re-init discards it', () => {
  const {rerender} = renderHook(
    ({options}) =>
      useSuperclusterWorker(geojson, options, viewport, 'clustering.worker.js'),
    {initialProps: {options: {radius: 60} as SuperclusterOptions}}
  );

  const worker = MockWorker.instances[0];
  worker.postMessage.mockClear();

  rerender({options: {radius: 120}});

  expect(worker.postMessage).toHaveBeenCalledWith({
    type: 'load',
    features: geojson.features
  });
});

test('requests fresh clusters for the current viewport after an options change', () => {
  const {rerender} = renderHook(
    ({options}) =>
      useSuperclusterWorker(geojson, options, viewport, 'clustering.worker.js'),
    {initialProps: {options: {radius: 60} as SuperclusterOptions}}
  );

  const worker = MockWorker.instances[0];
  worker.postMessage.mockClear();

  rerender({options: {radius: 120}});

  expect(worker.postMessage).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'getClusters',
      bbox: viewport.bbox,
      zoom: Math.floor(viewport.zoom)
    })
  );
});

test('does not touch the worker when rerendering with the same options reference', () => {
  const options = {radius: 60};
  const {rerender} = renderHook(() =>
    useSuperclusterWorker(geojson, options, viewport, 'clustering.worker.js')
  );

  const worker = MockWorker.instances[0];
  worker.postMessage.mockClear();

  rerender();

  expect(worker.postMessage).not.toHaveBeenCalled();
});
