import {useEffect, useState, useRef} from 'react';
import {useMap} from '@vis.gl/react-google-maps';
import {BBox} from 'geojson';

type MapViewportOptions = {
  padding?: number;
};

function degreesPerPixel(zoomLevel: number) {
  // 360° divided by the number of pixels at the zoom-level
  return 360 / (Math.pow(2, zoomLevel) * 256);
}

export function useMapViewport({padding = 0}: MapViewportOptions = {}) {
  const map = useMap();
  const [bbox, setBbox] = useState<BBox>([-180, -90, 180, 90]);
  const [zoom, setZoom] = useState(0);

  // Add debouncing to prevent performance issues during rapid zooming
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);

  // observe the map to get current bounds
  useEffect(() => {
    if (!map) return;

    const handleBoundsChanged = () => {
      // Prevent multiple rapid updates during zooming
      if (isUpdatingRef.current) return;
      
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        isUpdatingRef.current = true;
        
        try {
          const bounds = map.getBounds();
          const zoom = map.getZoom();
          const projection = map.getProjection();

          if (!bounds || !zoom || !projection) return;

          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();

          const paddingDegrees = degreesPerPixel(zoom) * padding;

          const n = Math.min(90, ne.lat() + paddingDegrees);
          const s = Math.max(-90, sw.lat() - paddingDegrees);

          const w = sw.lng() - paddingDegrees;
          const e = ne.lng() + paddingDegrees;

          setBbox([w, s, e, n]);
          setZoom(zoom);
        } finally {
          isUpdatingRef.current = false;
        }
      }, 16); // ~60fps debouncing
    };

    const listener = map.addListener('bounds_changed', handleBoundsChanged);

    return () => {
      listener.remove();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [map, padding]);

  return {bbox, zoom};
}
