import {FeatureCollection, Point} from 'geojson';

export type EarthquakeProps = {
  id: string;
  mag: number;
  time: number;
  felt: number | null;
  tsunami: 0 | 1;
};

export type EarthquakesGeojson = FeatureCollection<Point, EarthquakeProps>;

export async function loadEarthquakeGeojson(): Promise<EarthquakesGeojson> {
  const url = new URL('../data/earthquakes.json', import.meta.url);

  return await fetch(url).then(res => res.json());
}
