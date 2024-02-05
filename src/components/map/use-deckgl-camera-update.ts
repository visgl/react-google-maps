import {useLayoutEffect} from 'react';

export type DeckGlCompatProps = {
  /**
   * Viewport from deck.gl
   */
  viewport?: unknown;
  /**
   * View state from deck.gl
   */
  viewState?: Record<string, unknown>;
  /**
   * Initial View State from deck.gl
   */
  initialViewState?: Record<string, unknown>;
};

/**
 * Internal hook that updates the camera when deck.gl viewState changes.
 * @internal
 */
export function useDeckGLCameraUpdate(
  map: google.maps.Map | null,
  props: DeckGlCompatProps
) {
  const {viewport, viewState} = props;
  const isDeckGlControlled = !!viewport;

  useLayoutEffect(() => {
    if (!map || !viewState) return;

    const {
      latitude,
      longitude,
      bearing: heading,
      pitch: tilt,
      zoom
    } = viewState as Record<string, number>;

    map.moveCamera({
      center: {lat: latitude, lng: longitude},
      heading,
      tilt,
      zoom: zoom + 1
    });
  }, [map, viewState]);

  return isDeckGlControlled;
}
