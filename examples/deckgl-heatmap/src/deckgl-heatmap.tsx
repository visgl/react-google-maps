import React, {useMemo} from 'react';

import {HeatmapLayer} from '@deck.gl/aggregation-layers';

import {DeckGlOverlay} from './deckgl-overlay';
import {EarthquakesGeojson} from './earthquakes';

type HeatmapProps = {
  geojson: EarthquakesGeojson;
  radius: number;
  opacity: number;
};

type EarthquakeFeature = EarthquakesGeojson['features'][number];

const DeckGlHeatmap = ({geojson, radius, opacity}: HeatmapProps) => {
  const layers = useMemo(
    () => [
      new HeatmapLayer({
        id: 'earthquake-heatmap',
        data: geojson.features,
        radiusPixels: radius,
        opacity,
        getPosition: (feature: EarthquakeFeature) =>
          feature.geometry.coordinates,
        getWeight: (feature: EarthquakeFeature) => feature.properties?.mag ?? 0
      })
    ],
    [geojson, opacity, radius]
  );

  return <DeckGlOverlay layers={layers} />;
};

export default DeckGlHeatmap;
