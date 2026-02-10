/**
 * useMapViewport - Hook to track map viewport bounds and zoom level
 *
 * Returns the current bounding box and zoom level of the map, updating
 * whenever the map becomes idle after panning or zooming.
 *
 * @example
 * ```tsx
 * const { bbox, zoom } = useMapViewport({ padding: 100 });
 * const { clusters } = useSuperclusterWorker(geojson, options, { bbox, zoom }, workerUrl);
 * ```
 */

import {useEffect, useState} from 'react';
import {useMap} from './use-map';

/** Bounding box [west, south, east, north] */
export type ViewportBBox = [number, number, number, number];

export interface MapViewportOptions {
  /**
   * Padding in pixels to extend the bounding box beyond the visible viewport.
   * Useful for pre-loading markers that are just outside the view.
   * @default 0
   */
  padding?: number;
}

export interface MapViewport {
  /** Bounding box [west, south, east, north] */
  bbox: ViewportBBox;
  /** Current zoom level */
  zoom: number;
}

/**
 * Calculates degrees per pixel at a given zoom level.
 * Used to convert pixel padding to geographic distance.
 */
function degreesPerPixel(zoomLevel: number): number {
  // 360° divided by the number of pixels at the zoom-level
  return 360 / (Math.pow(2, zoomLevel) * 256);
}

/**
 * Hook to track map viewport (bounding box and zoom)
 *
 * @param options - Configuration options
 * @returns Current viewport with bbox and zoom
 */
export function useMapViewport(options: MapViewportOptions = {}): MapViewport {
  const {padding = 0} = options;
  const map = useMap();
  const [bbox, setBbox] = useState<ViewportBBox>([-180, -90, 180, 90]);
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    if (!map) return;

    const updateViewport = () => {
      const bounds = map.getBounds();
      const currentZoom = map.getZoom();
      const projection = map.getProjection();

      if (!bounds || currentZoom === undefined || !projection) return;

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const paddingDegrees = degreesPerPixel(currentZoom) * padding;

      const n = Math.min(90, ne.lat() + paddingDegrees);
      const s = Math.max(-90, sw.lat() - paddingDegrees);

      const w = sw.lng() - paddingDegrees;
      const e = ne.lng() + paddingDegrees;

      setBbox([w, s, e, n]);
      setZoom(currentZoom);
    };

    // Update on map idle (after pan/zoom completes)
    const listener = map.addListener('idle', updateViewport);

    // Initial update
    updateViewport();

    return () => listener.remove();
  }, [map, padding]);

  return {bbox, zoom};
}
