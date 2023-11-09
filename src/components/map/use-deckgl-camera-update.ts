import {useLayoutEffect} from 'react';

/**
 * Internal hook that updates the camera when deck.gl viewState changes.
 * @internal
 */
export function useDeckGLCameraUpdate(
  map: google.maps.Map | null,
  viewState: Record<string, unknown> | undefined
) {
  useLayoutEffect(() => {
    if (!map || !viewState) {
      return;
    }

    // FIXME: this should probably be extracted into a seperate hook that only
    //  runs once when first seeing a deck.gl viewState update and resets
    //  again. Maybe even use a seperate prop (`<Map controlled />`) instead.
    map.setOptions({
      gestureHandling: 'none',
      keyboardShortcuts: false,
      disableDefaultUI: true
    });

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
}
