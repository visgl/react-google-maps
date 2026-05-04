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

import React, {useMemo, useState, useCallback} from 'react';
import {createRoot} from 'react-dom/client';

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

import {useMapViewport} from './hooks/use-map-viewport';
import {
  useSuperclusterWorker,
  type ClusterFeature,
  type ClusterProperties,
  type GeoFeatureCollection
} from './hooks/use-supercluster-worker';

import {ControlPanel} from './control-panel';
import {generateRandomPoints} from './generate-points';

// Worker URL - Vite will handle bundling this
const workerUrl = new URL('./clustering.worker.ts', import.meta.url);

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY;

// Supercluster options
// Increased radius from 80 to 120 to reduce the number of markers rendered
const CLUSTER_OPTIONS = {
  radius: 120,
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
  const [selectedFeature, setSelectedFeature] =
    useState<ClusterFeature<PointProperties> | null>(null);
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const geojson = useMemo(
    () => generateRandomPoints(pointCount, INITIAL_CENTER, 0.5),
    [pointCount]
  );

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
  geojson: GeoFeatureCollection<PointProperties>;
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

        return (
          <ClusteredFeatureMarker
            key={feature.id ?? `${lat}-${lng}`}
            feature={feature}
            onMarkerClick={handleMarkerClick}
          />
        );
      })}
    </>
  );
};

type ClusteredFeatureMarkerProps = {
  feature: ClusterFeature<PointProperties>;
  onMarkerClick: (
    feature: ClusterFeature<PointProperties>,
    marker: google.maps.marker.AdvancedMarkerElement
  ) => void;
};

const ClusteredFeatureMarker = ({
  feature,
  onMarkerClick
}: ClusteredFeatureMarkerProps) => {
  const [lng, lat] = feature.geometry.coordinates;
  const props = feature.properties;
  const isCluster = 'cluster' in props && props.cluster;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{lat, lng}}
      onClick={() => {
        if (!marker) return;
        onMarkerClick(feature, marker);
      }}>
      {isCluster ? (
        <ClusterMarker count={(props as ClusterProperties).point_count} />
      ) : (
        <PointMarker />
      )}
    </AdvancedMarker>
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
