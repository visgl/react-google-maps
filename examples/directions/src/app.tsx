import React, {useEffect, useRef} from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => (
  <APIProvider apiKey={API_KEY}>
    <Map
      mapId={'bf51a910020fa25a'}
      defaultCenter={{lat: -23.588363, lng: -46.658475}}
      defaultZoom={15}
      gestureHandling={'greedy'}
      fullscreenControl={false}>
      <Directions
        origin="R. Dr. Diogo de Faria, 946, São Paulo"
        destination="R. Domingos Fernandes, 588, São Paulo"
        travelMode="DRIVING"
      />
    </Map>
    <ControlPanel />
  </APIProvider>
);

interface DirectionsProps {
  origin: string;
  destination: string;
  travelMode?: google.maps.TravelModeString;
}

export function Directions({
  origin,
  destination,
  travelMode = 'DRIVING'
}: DirectionsProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');

  // refs for the polylines and markers created with the Routes API
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;

    // cancel async operations on unmount (no AbortSignal support in Routes API)
    let isCancelled = false;

    // Clean up previous polylines & markers
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    markersRef.current.forEach(m => {
      m.map = null;
    });
    markersRef.current = [];

    const request: google.maps.routes.ComputeRoutesRequest = {
      origin,
      destination,
      travelMode,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs']
    };

    routesLib.Route.computeRoutes(request)
      .then(async ({routes}) => {
        if (isCancelled) return;
        if (!routes || routes.length === 0) return;

        const route = routes[0];

        // Render and append polylines
        const newPolylines = route.createPolylines();
        newPolylines.forEach(polyline => {
          polyline.setOptions({
            strokeColor: '#3b82f6',
            strokeOpacity: 0.85,
            strokeWeight: 6
          });
          polyline.setMap(map);
        });
        polylinesRef.current = newPolylines;

        // Render waypoint advanced markers
        const newMarkers = await route.createWaypointAdvancedMarkers();

        if (isCancelled) return;

        newMarkers.forEach(marker => {
          marker.map = map;
        });
        markersRef.current = newMarkers;

        if (route.viewport) map.fitBounds(route.viewport);
      })
      .catch(err => {
        if (isCancelled) return;
        console.error('Error computing routes:', err);
      });

    return () => {
      isCancelled = true;

      // clear polylines and markers
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];

      markersRef.current.forEach(marker => {
        marker.map = null;
      });
      markersRef.current = [];
    };
  }, [routesLib, map, origin, destination, travelMode]);

  return null;
}

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
