import {render, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import {
  CirclePath,
  Flattener,
  Marker,
  Model3D,
  Polygon3D,
  Polyline3D
} from '../../../3d';

import {
  CirclePathElement,
  FlattenerElement,
  MarkerElement,
  MarkerInteractiveElement,
  Model3DInteractiveElement,
  Polygon3DInteractiveElement,
  Polyline3DElement,
  register3DWebComponentMocks
} from '../../../components/__tests__/__utils__/map-3d-mocks';

beforeAll(() => {
  register3DWebComponentMocks();
});

describe('/3d components', () => {
  test('Marker uses gmp-marker without click handling', async () => {
    const refCallback = jest.fn();

    const {container} = render(
      <Marker
        ref={refCallback}
        position={{lat: 37.7749, lng: -122.4194}}
        title="San Francisco">
        <div data-testid="marker-content">Content</div>
      </Marker>
    );

    const marker = container.querySelector('gmp-marker') as MarkerElement;

    expect(marker).toBeInstanceOf(MarkerElement);
    expect(marker).not.toBeInstanceOf(MarkerInteractiveElement);
    expect(marker).toContainHTML('Content');

    await waitFor(() => {
      expect(marker.position).toEqual({lat: 37.7749, lng: -122.4194});
      expect(marker.title).toBe('San Francisco');
      expect(refCallback).toHaveBeenCalledWith(marker);
    });
  });

  test('Marker uses gmp-marker-interactive when onClick is provided', async () => {
    const onClick = jest.fn();
    const {container} = render(
      <Marker position={{lat: 37.7749, lng: -122.4194}} onClick={onClick} />
    );

    const marker = container.querySelector(
      'gmp-marker-interactive'
    ) as MarkerInteractiveElement;

    expect(marker).toBeInstanceOf(MarkerInteractiveElement);

    marker.dispatchEvent(new Event('gmp-click'));

    await waitFor(() => {
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  test('Model3D switches to the interactive element and syncs props', async () => {
    const onClick = jest.fn();
    const {container, rerender} = render(
      <Model3D
        src="/model.glb"
        position={{lat: 37.7749, lng: -122.4194, altitude: 100}}
        scale={1}
        onClick={onClick}
      />
    );

    const model = container.querySelector(
      'gmp-model-3d-interactive'
    ) as Model3DInteractiveElement;

    expect(model).toBeInstanceOf(Model3DInteractiveElement);

    await waitFor(() => {
      expect(model.src).toBe('/model.glb');
      expect(model.scale).toBe(1);
    });

    rerender(
      <Model3D
        src="/updated.glb"
        position={{lat: 37.7749, lng: -122.4194, altitude: 100}}
        scale={2}
        onClick={onClick}
      />
    );

    await waitFor(() => {
      expect(model.src).toBe('/updated.glb');
      expect(model.scale).toBe(2);
    });
  });

  test('Polyline3D syncs path and stroke props', async () => {
    const path = [
      {lat: 37.7749, lng: -122.4194},
      {lat: 40.7128, lng: -74.006}
    ];

    const {container} = render(
      <Polyline3D path={path} strokeColor="#ff0000" strokeWidth={4} />
    );

    const polyline = container.querySelector(
      'gmp-polyline-3d'
    ) as Polyline3DElement;

    expect(polyline).toBeInstanceOf(Polyline3DElement);

    await waitFor(() => {
      expect(polyline.path).toBe(path);
      expect(polyline.strokeColor).toBe('#ff0000');
      expect(polyline.strokeWidth).toBe(4);
    });
  });

  test('Polygon3D uses gmp-polygon-3d-interactive when onClick is provided', async () => {
    const onClick = jest.fn();
    const path = [
      {lat: 37.7749, lng: -122.4194},
      {lat: 40.7128, lng: -74.006},
      {lat: 34.0522, lng: -118.2437}
    ];

    const {container} = render(
      <Polygon3D path={path} fillColor="#00ff00" onClick={onClick} />
    );

    const polygon = container.querySelector(
      'gmp-polygon-3d-interactive'
    ) as Polygon3DInteractiveElement;

    expect(polygon).toBeInstanceOf(Polygon3DInteractiveElement);

    await waitFor(() => {
      expect(polygon.path).toBe(path);
      expect(polygon.fillColor).toBe('#00ff00');
    });
  });

  test('Flattener syncs path prop', async () => {
    const path = [
      {lat: 37.7749, lng: -122.4194},
      {lat: 40.7128, lng: -74.006},
      {lat: 34.0522, lng: -118.2437}
    ];

    const {container} = render(<Flattener path={path} />);
    const flattener = container.querySelector(
      'gmp-flattener'
    ) as FlattenerElement;

    expect(flattener).toBeInstanceOf(FlattenerElement);

    await waitFor(() => {
      expect(flattener.path).toBe(path);
    });
  });

  test('CirclePath syncs center and radius props', async () => {
    const center = {lat: 37.7749, lng: -122.4194};

    const {container} = render(<CirclePath center={center} radius={500} />);
    const circlePath = container.querySelector(
      'gmp-circle-path'
    ) as CirclePathElement;

    expect(circlePath).toBeInstanceOf(CirclePathElement);

    await waitFor(() => {
      expect(circlePath.center).toBe(center);
      expect(circlePath.radius).toBe(500);
    });
  });
});
