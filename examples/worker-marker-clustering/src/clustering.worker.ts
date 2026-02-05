/**
 * Supercluster Web Worker
 *
 * This worker runs all clustering computations off the main thread,
 * enabling smooth map interactions even with 100k+ markers.
 *
 * Message Protocol:
 * - init: Initialize Supercluster with options
 * - load: Load GeoJSON features (CPU-intensive)
 * - getClusters: Get clusters for a viewport
 * - getLeaves: Get all points in a cluster
 * - getChildren: Get immediate children of a cluster
 * - getClusterExpansionZoom: Get zoom at which cluster expands
 */

import Supercluster from 'supercluster';
import type {Feature, Point, GeoJsonProperties} from 'geojson';
import type {ClusterProperties} from 'supercluster';

// Type definitions for messages
type SuperclusterOptions = {
  minZoom?: number;
  maxZoom?: number;
  minPoints?: number;
  radius?: number;
  extent?: number;
  generateId?: boolean;
};

type WorkerMessage =
  | {type: 'init'; options: SuperclusterOptions}
  | {type: 'load'; features: Feature<Point, GeoJsonProperties>[]}
  | {
      type: 'getClusters';
      bbox: [number, number, number, number];
      zoom: number;
      requestId: number;
    }
  | {type: 'getLeaves'; clusterId: number; requestId: number; limit?: number}
  | {type: 'getChildren'; clusterId: number; requestId: number}
  | {type: 'getClusterExpansionZoom'; clusterId: number; requestId: number};

// Clusterer instance
let clusterer: Supercluster<GeoJsonProperties, ClusterProperties> | null = null;

// Handle messages from main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  try {
    switch (message.type) {
      case 'init': {
        clusterer = new Supercluster(message.options);
        self.postMessage({type: 'ready'});
        break;
      }

      case 'load': {
        if (!clusterer) {
          self.postMessage({
            type: 'error',
            message: 'Clusterer not initialized'
          });
          return;
        }

        // This is the CPU-intensive operation that would block the main thread
        const startTime = performance.now();
        clusterer.load(message.features);
        const loadTime = performance.now() - startTime;

        self.postMessage({
          type: 'loaded',
          count: message.features.length,
          loadTime: Math.round(loadTime)
        });
        break;
      }

      case 'getClusters': {
        if (!clusterer) {
          self.postMessage({
            type: 'error',
            message: 'Clusterer not initialized',
            requestId: message.requestId
          });
          return;
        }

        const clusters = clusterer.getClusters(message.bbox, message.zoom);
        self.postMessage({
          type: 'clusters',
          clusters,
          requestId: message.requestId
        });
        break;
      }

      case 'getLeaves': {
        if (!clusterer) {
          self.postMessage({
            type: 'error',
            message: 'Clusterer not initialized',
            requestId: message.requestId
          });
          return;
        }

        const limit = message.limit ?? Infinity;
        const leaves = clusterer.getLeaves(message.clusterId, limit);
        self.postMessage({
          type: 'leaves',
          leaves,
          requestId: message.requestId
        });
        break;
      }

      case 'getChildren': {
        if (!clusterer) {
          self.postMessage({
            type: 'error',
            message: 'Clusterer not initialized',
            requestId: message.requestId
          });
          return;
        }

        const children = clusterer.getChildren(message.clusterId);
        self.postMessage({
          type: 'children',
          children,
          requestId: message.requestId
        });
        break;
      }

      case 'getClusterExpansionZoom': {
        if (!clusterer) {
          self.postMessage({
            type: 'error',
            message: 'Clusterer not initialized',
            requestId: message.requestId
          });
          return;
        }

        const zoom = clusterer.getClusterExpansionZoom(message.clusterId);
        self.postMessage({
          type: 'expansionZoom',
          zoom,
          requestId: message.requestId
        });
        break;
      }
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      requestId: 'requestId' in message ? message.requestId : undefined
    });
  }
};
