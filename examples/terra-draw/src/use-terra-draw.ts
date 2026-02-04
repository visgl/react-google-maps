import {useEffect, useRef, useState} from 'react';
import {useMap} from '@vis.gl/react-google-maps';
import {TerraDraw} from 'terra-draw';
import {TerraDrawGoogleMapsAdapter} from 'terra-draw-google-maps-adapter';

import {createTerraDrawModes} from './terra-draw-config';

export const useTerraDraw = () => {
  const map = useMap();
  const drawRef = useRef<TerraDraw | null>(null);
  const [draw, setDraw] = useState<TerraDraw | null>(null);

  useEffect(() => {
    // Only initialize once per map instance.
    if (!map || drawRef.current) return;

    let isCancelled = false;
    let listener: google.maps.MapsEventListener | null = null;

    const initialize = () => {
      if (drawRef.current || isCancelled) return;

      const instance = new TerraDraw({
        adapter: new TerraDrawGoogleMapsAdapter({
          map,
          lib: google.maps,
          coordinatePrecision: 9
        }),
        modes: createTerraDrawModes()
      });

      instance.start();
      drawRef.current = instance;
      setDraw(instance);
    };

    if (map.getProjection()) {
      initialize();
    } else {
      // TerraDraw needs the projection to be ready before it can attach.
      listener = map.addListener('projection_changed', () => {
        if (!map.getProjection()) return;
        listener?.remove();
        initialize();
      });
    }

    return () => {
      isCancelled = true;
      listener?.remove();
      if (drawRef.current) {
        drawRef.current.stop();
        drawRef.current = null;
      }
      setDraw(null);
    };
  }, [map]);

  return draw;
};
