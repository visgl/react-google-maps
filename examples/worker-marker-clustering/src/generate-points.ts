import type {FeatureCollection, Point} from 'geojson';

type PointProperties = {
  id: string;
  name: string;
};

/**
 * Generate random GeoJSON points around a center location
 */
export function generateRandomPoints(
  count: number,
  center: {lat: number; lng: number},
  spread: number = 1
): FeatureCollection<Point, PointProperties> {
  const features = [];

  for (let i = 0; i < count; i++) {
    // Generate random offset using normal distribution for more realistic clustering
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.abs(gaussianRandom() * spread);

    const lat = center.lat + distance * Math.cos(angle);
    const lng = center.lng + distance * Math.sin(angle);

    features.push({
      type: 'Feature' as const,
      id: `point-${i}`,
      geometry: {
        type: 'Point' as const,
        coordinates: [lng, lat] as [number, number]
      },
      properties: {
        id: `point-${i}`,
        name: `Location ${i + 1}`
      }
    });
  }

  return {
    type: 'FeatureCollection',
    features
  };
}

/**
 * Generate a random number with approximately normal distribution
 * Using Box-Muller transform
 */
function gaussianRandom(): number {
  let u = 0;
  let v = 0;

  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
