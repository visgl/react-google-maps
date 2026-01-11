/**
 * Worker-based Marker Clustering Example
 *
 * This example demonstrates how to use Web Workers for clustering
 * large datasets (10k-100k+ markers) without blocking the main thread.
 *
 * Key features:
 * - Clustering runs in a Web Worker
 * - Main thread stays responsive during data loading
 * - Loading indicator while clustering
 * - Performance metrics display
 */

import React, {useEffect, useState, useCallback} from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  InfoWindow,
  useSuperclusterWorker,
  useMapViewport,
  type ClusterFeature,
  type ClusterProperties
} from '@vis.gl/react-google-maps';

import {ControlPanel} from './control-panel';
import {generateRandomPoints} from './generate-points';
import type {FeatureCollection, Point} from 'geojson';

// Worker URL - Vite will handle bundling this
const workerUrl = new URL('./clustering.worker.ts', import.meta.url);

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;

// Supercluster options
const CLUSTER_OPTIONS = {
  radius: 80,
  maxZoom: 16,
  minPoints: 2
};

// Initial map center (San Francisco)
const INITIAL_CENTER = {lat: 37.7749, lng: -122.4194};
const INITIAL_ZOOM = 10;

type PointProperties = {
  id: string;
  name: string;
};

const App = () => {
  const [pointCount, setPointCount] = useState(10000);
  const [geojson, setGeojson] = useState<FeatureCollection<
    Point,
    PointProperties
  > | null>(null);
  const [selectedFeature, setSelectedFeature] =
    useState<ClusterFeature<PointProperties> | null>(null);
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  // Generate random points
  useEffect(() => {
    console.log(`Generating ${pointCount.toLocaleString()} random points...`);
    const data = generateRandomPoints(pointCount, INITIAL_CENTER, 0.5);
    setGeojson(data);
  }, [pointCount]);

  return (
    <APIProvider apiKey={API_KEY!}>
      <Map
        mapId="worker-clustering-demo"
        defaultCenter={INITIAL_CENTER}
        defaultZoom={INITIAL_ZOOM}
        gestureHandling="greedy"
        disableDefaultUI>
        {geojson && (
          <ClusteredMarkers
            geojson={geojson}
            onFeatureClick={(feature, marker) => {
              setSelectedFeature(feature);
              setSelectedMarker(marker);
            }}
          />
        )}

        {selectedFeature && selectedMarker && (
          <InfoWindow
            anchor={selectedMarker}
            onCloseClick={() => {
              setSelectedFeature(null);
              setSelectedMarker(null);
            }}>
            <FeatureInfo feature={selectedFeature} />
          </InfoWindow>
        )}
      </Map>

      <ControlPanel
        pointCount={pointCount}
        onPointCountChange={setPointCount}
      />
    </APIProvider>
  );
};

type ClusteredMarkersProps = {
  geojson: FeatureCollection<Point, PointProperties>;
  onFeatureClick: (
    feature: ClusterFeature<PointProperties>,
    marker: google.maps.marker.AdvancedMarkerElement
  ) => void;
};

const ClusteredMarkers = ({geojson, onFeatureClick}: ClusteredMarkersProps) => {
  const map = useMap();
  const viewport = useMapViewport({padding: 100});

  const {clusters, isLoading, error} = useSuperclusterWorker<PointProperties>(
    geojson,
    CLUSTER_OPTIONS,
    viewport,
    workerUrl
  );

  // Log performance info
  useEffect(() => {
    if (!isLoading && clusters.length > 0) {
      console.log(`Rendered ${clusters.length} clusters/markers`);
    }
  }, [isLoading, clusters.length]);

  const handleMarkerClick = useCallback(
    (
      feature: ClusterFeature<PointProperties>,
      marker: google.maps.marker.AdvancedMarkerElement
    ) => {
      const props = feature.properties as ClusterProperties | PointProperties;

      // If it's a cluster, zoom in
      if ('cluster' in props && props.cluster) {
        const [lng, lat] = feature.geometry.coordinates;
        map?.setCenter({lat, lng});
        map?.setZoom((map.getZoom() || 10) + 2);
        return;
      }

      // Otherwise, show info
      onFeatureClick(feature, marker);
    },
    [map, onFeatureClick]
  );

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <div>
            Clustering {geojson.features.length.toLocaleString()} points...
          </div>
        </div>
      )}

      {clusters.map(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const props = feature.properties;
        const isCluster = 'cluster' in props && props.cluster;

        return (
          <AdvancedMarker
            key={feature.id ?? `${lat}-${lng}`}
            position={{lat, lng}}
            onClick={e => {
              const marker =
                e.target as unknown as google.maps.marker.AdvancedMarkerElement;
              handleMarkerClick(feature, marker);
            }}>
            {isCluster ? (
              <ClusterMarker count={(props as ClusterProperties).point_count} />
            ) : (
              <PointMarker />
            )}
          </AdvancedMarker>
        );
      })}
    </>
  );
};

const ClusterMarker = ({count}: {count: number}) => {
  const size = Math.min(60, 30 + Math.log10(count) * 15);

  return (
    <div
      className="cluster-marker"
      style={{
        width: size,
        height: size,
        fontSize: size / 3
      }}>
      {count >= 1000 ? `${Math.round(count / 1000)}k` : count}
    </div>
  );
};

const PointMarker = () => {
  return <div className="point-marker" />;
};

const FeatureInfo = ({feature}: {feature: ClusterFeature<PointProperties>}) => {
  const props = feature.properties;

  if ('cluster' in props && props.cluster) {
    return (
      <div>
        <strong>Cluster</strong>
        <p>{props.point_count} points</p>
      </div>
    );
  }

  return (
    <div>
      <strong>{(props as PointProperties).name}</strong>
      <p>ID: {(props as PointProperties).id}</p>
    </div>
  );
};

const root = createRoot(document.getElementById('app')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
