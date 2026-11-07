import React, {FunctionComponent, PropsWithChildren} from 'react';
import {cleanup, render, waitFor} from '@testing-library/react';
import {initialize, mockInstances} from '@googlemaps/jest-mocks';

import {Map as GoogleMap} from '../map';
import {AdvancedMarker} from '../advanced-marker';
import {APIProviderContext, APIProviderContextValue} from '../api-provider';
import {APILoadingStatus} from '../../libraries/api-loading-status';
import {MARKER_DRAG_CLICK_SUPPRESSION_MS} from '../../libraries/marker-drag-click-guard';

let wrapper: FunctionComponent<PropsWithChildren>;
let listeners: Array<{
  target: object;
  name: string;
  handler: (event?: unknown) => void;
}>;

beforeEach(async () => {
  initialize();
  jest.clearAllMocks();

  const markerLibrary = (await google.maps.importLibrary(
    'marker'
  )) as google.maps.MarkerLibrary;
  const contextValue: APIProviderContextValue = {
    importLibrary: jest.fn(),
    loadedLibraries: {marker: markerLibrary},
    status: APILoadingStatus.LOADED,
    mapInstances: {},
    addMapInstance: jest.fn(),
    removeMapInstance: jest.fn(),
    clearMapInstances: jest.fn(),
    map3dInstances: {},
    addMap3DInstance: jest.fn(),
    removeMap3DInstance: jest.fn(),
    clearMap3DInstances: jest.fn(),
    internalUsageAttributionIds: null
  };
  wrapper = ({children}) => (
    <APIProviderContext.Provider value={contextValue}>
      {children}
    </APIProviderContext.Provider>
  );

  google.maps.Map = class extends google.maps.Map {
    constructor(...args: ConstructorParameters<typeof google.maps.Map>) {
      super(...args);
      this.getDiv = jest.fn().mockImplementation(() => args[0]);
    }
  };

  listeners = [];
  google.maps.event.addListener = jest.fn((target, name, handler) => {
    const listener = {
      target,
      name,
      handler: handler as (event?: unknown) => void
    };
    listeners.push(listener);
    return {
      remove: jest.fn(() => {
        listeners = listeners.filter(entry => entry !== listener);
      })
    };
  });
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

test.each([true, false])(
  'filters only the trailing map click after a marker drag (onDragEnd: %s)',
  async withDragEndHandler => {
    const onDragEnd = jest.fn();
    const onClick = jest.fn();
    const onOtherMapClick = jest.fn();
    const onMapDragEnd = jest.fn();
    const now = jest.spyOn(Date, 'now').mockReturnValue(1000);

    render(
      <>
        <GoogleMap
          id="a"
          mapId="test"
          defaultZoom={8}
          defaultCenter={{lat: 1, lng: 2}}
          onClick={onClick}
          onDragend={onMapDragEnd}>
          <AdvancedMarker
            draggable
            position={{lat: 1, lng: 2}}
            onDragEnd={withDragEndHandler ? onDragEnd : undefined}
          />
        </GoogleMap>
        <GoogleMap
          id="b"
          defaultZoom={8}
          defaultCenter={{lat: 1, lng: 2}}
          onClick={onOtherMapClick}
        />
      </>,
      {wrapper}
    );

    const marker = mockInstances.get(
      google.maps.marker.AdvancedMarkerElement
    )[0];
    const [map, otherMap] = mockInstances.get(google.maps.Map);
    await waitFor(() => {
      expect(listeners).toEqual(
        expect.arrayContaining([
          expect.objectContaining({target: marker, name: 'dragend'}),
          expect.objectContaining({target: map, name: 'click'}),
          expect.objectContaining({target: otherMap, name: 'click'})
        ])
      );
    });
    const dragEnd = listeners.find(
      entry => entry.target === marker && entry.name === 'dragend'
    )!.handler;
    const click = listeners.find(
      entry => entry.target === map && entry.name === 'click'
    )!.handler;
    const otherClick = listeners.find(
      entry => entry.target === otherMap && entry.name === 'click'
    )!.handler;
    const mapDragEnd = listeners.find(
      entry => entry.target === map && entry.name === 'dragend'
    )!.handler;
    const event = {latLng: {toJSON: () => ({lat: 1, lng: 2})}, stop() {}};

    click(event);
    expect(onClick).toHaveBeenCalledTimes(1);
    onClick.mockClear();

    dragEnd(event);
    expect(onDragEnd).toHaveBeenCalledTimes(withDragEndHandler ? 1 : 0);
    now.mockReturnValue(1000 + MARKER_DRAG_CLICK_SUPPRESSION_MS / 2);
    otherClick(event);
    expect(onOtherMapClick).toHaveBeenCalledTimes(1);
    click(event);
    expect(onClick).not.toHaveBeenCalled();
    click(event);
    expect(onClick).toHaveBeenCalledTimes(1);

    mapDragEnd();
    expect(onMapDragEnd).toHaveBeenCalledTimes(1);
    click(event);
    expect(onClick).toHaveBeenCalledTimes(2);

    now.mockReturnValue(2000);
    dragEnd(event);
    now.mockReturnValue(2000 + MARKER_DRAG_CLICK_SUPPRESSION_MS);
    click(event);
    expect(onClick).toHaveBeenCalledTimes(2);

    now.mockReturnValue(3000);
    dragEnd(event);
    now.mockReturnValue(3000 + MARKER_DRAG_CLICK_SUPPRESSION_MS + 1);
    click(event);
    click(event);
    expect(onClick).toHaveBeenCalledTimes(4);
  }
);
