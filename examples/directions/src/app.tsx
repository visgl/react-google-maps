import React, { useEffect, useState, useRef } from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
  AdvancedMarker
} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const App = () => (
  <APIProvider apiKey={API_KEY}>
    <Map
      defaultCenter={{ lat: -23.588363, lng: -46.658475 }}
      defaultZoom={15}
      gestureHandling={'greedy'}
      fullscreenControl={false}>
      <RouteDisplay
        origin="R. Dr. Diogo de Faria, 946, São Paulo"
        destination="R. Domingos Fernandes, 588, São Paulo"
        travelMode="DRIVING"
      />
    </Map>
    <ControlPanel />
  </APIProvider>
);

interface RouteDisplayProps {
  origin: string;
  destination: string;
  travelMode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TWO_WHEELER' | 'TRANSIT';
}

interface RouteDetails {
  distanceMeters: number;
  durationMillis: number;
  startCoords?: google.maps.LatLngLiteral;
  endCoords?: google.maps.LatLngLiteral;
  steps: Array<{
    instructions: string;
    distanceMeters: number;
    durationMillis: number;
    maneuver?: string;
  }>;
}

export function RouteDisplay({
  origin,
  destination,
  travelMode,
}: RouteDisplayProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;

    // Clean up previous route lines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    setError(null);
    setLoading(true);

    const request = {
      origin: origin,
      destination: destination,
      travelMode: travelMode,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs'],
    };

    // Access the modern client-side Route.computeRoutes class service
    (routesLib.Route as any).computeRoutes(request)
      .then(({ routes }: { routes: any[] }) => {
        setLoading(false);
        if (!routes || routes.length === 0) {
          setError('No route found.');
          return;
        }

        const primaryRoute = routes[0];

        // Render polylines dynamically using modern Route.createPolylines()
        const newPolylines = primaryRoute.createPolylines();
        newPolylines.forEach((polyline: google.maps.Polyline) => {
          polyline.setOptions({
            strokeColor: '#3b82f6', // Stunning visual Tailwind Blue 500
            strokeOpacity: 0.85,
            strokeWeight: 6,
          });
          polyline.setMap(map);
        });
        polylinesRef.current = newPolylines;

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport);
        }

        const details: RouteDetails = {
          distanceMeters: primaryRoute.distanceMeters ?? 0,
          durationMillis: primaryRoute.durationMillis ?? 0,
          steps: [],
        };
        setRouteDetails(details);
      })
      .catch((err: any) => {
        setLoading(false);
        console.error('Error computing routes:', err);
        setError(err.message || 'Failed to compute route.');
      });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, origin, destination, travelMode]);

  if (loading) return <div className="route-panel">Calculating route...</div>;
  if (error) return <div className="route-panel error">{error}</div>;
  if (!routeDetails) return null;

  return (
    <div className="route-panel">
      <h2>Toronto Route Summary</h2>
      <p>Distance: {(routeDetails.distanceMeters / 1000).toFixed(2)} km</p>
      <p>Duration: {(routeDetails.durationMillis / 60000).toFixed(0)} mins</p>
    </div>
  );
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
