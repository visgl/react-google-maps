/**
 * useSuperclusterWorker - Web Worker-based clustering hook
 *
 * This hook provides an interface for running Supercluster in a Web Worker,
 * preventing main thread blocking when clustering large datasets (10k+ markers).
 *
 * @remarks
 * Usage requires:
 * 1. Install supercluster: `npm install supercluster @types/supercluster`
 * 2. Create a worker file in your app (see worker-marker-clustering example)
 * 3. Pass the worker URL to this hook
 *
 * @example
 * ```tsx
 * const workerUrl = new URL('./clustering.worker.ts', import.meta.url);
 * const { bbox, zoom } = useMapViewport({ padding: 100 });
 * const { clusters, isLoading } = useSuperclusterWorker(
 *   geojson,
 *   { radius: 80, maxZoom: 16 },
 *   { bbox, zoom },
 *   workerUrl
 * );
 * ```
 */

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

// ============================================================================
// GeoJSON Types (inline to avoid external dependency)
// ============================================================================

/** GeoJSON Bounding Box [west, south, east, north] */
export type BBox = [number, number, number, number];

/** GeoJSON Point geometry */
export interface PointGeometry {
  type: 'Point';
  coordinates: [number, number];
}

/** GeoJSON Feature */
export interface GeoFeature<P = Record<string, unknown>> {
  type: 'Feature';
  id?: string | number;
  geometry: PointGeometry;
  properties: P;
}

/** GeoJSON FeatureCollection */
export interface GeoFeatureCollection<P = Record<string, unknown>> {
  type: 'FeatureCollection';
  features: GeoFeature<P>[];
}

// ============================================================================
// Supercluster Types (inline to avoid external dependency)
// ============================================================================

/** Supercluster options */
export interface SuperclusterOptions {
  /** Min zoom level to generate clusters */
  minZoom?: number;
  /** Max zoom level to cluster points */
  maxZoom?: number;
  /** Minimum points to form a cluster */
  minPoints?: number;
  /** Cluster radius in pixels */
  radius?: number;
  /** Tile extent (radius is calculated relative to it) */
  extent?: number;
  /** Whether to generate numeric ids for clusters */
  generateId?: boolean;
}

/** Properties added to cluster features by Supercluster */
export interface ClusterProperties {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string | number;
}

/** A cluster or point feature returned by Supercluster */
export type ClusterFeature<P = Record<string, unknown>> =
  | GeoFeature<P>
  | GeoFeature<ClusterProperties>;

// ============================================================================
// Worker Message Types
// ============================================================================

type WorkerMessage =
  | {type: 'init'; options: SuperclusterOptions}
  | {type: 'load'; features: GeoFeature[]}
  | {type: 'getClusters'; bbox: BBox; zoom: number; requestId: number}
  | {type: 'getLeaves'; clusterId: number; requestId: number; limit?: number}
  | {type: 'getChildren'; clusterId: number; requestId: number}
  | {type: 'getClusterExpansionZoom'; clusterId: number; requestId: number};

type WorkerResponse =
  | {type: 'ready'}
  | {type: 'loaded'; count: number}
  | {type: 'clusters'; clusters: ClusterFeature[]; requestId: number}
  | {type: 'leaves'; leaves: GeoFeature[]; requestId: number}
  | {type: 'children'; children: ClusterFeature[]; requestId: number}
  | {type: 'expansionZoom'; zoom: number; requestId: number}
  | {type: 'error'; message: string; requestId?: number};

// ============================================================================
// Hook Types
// ============================================================================

export interface SuperclusterViewport {
  /** Bounding box [west, south, east, north] */
  bbox: BBox;
  /** Zoom level (will be floored to integer) */
  zoom: number;
}

export interface UseSuperclusterWorkerResult<P = Record<string, unknown>> {
  /** Current clusters/markers for the viewport */
  clusters: ClusterFeature<P>[];
  /** True while loading data or calculating clusters */
  isLoading: boolean;
  /** Error message if worker failed */
  error: string | null;
  /** Get all leaf features in a cluster */
  getLeaves: (clusterId: number, limit?: number) => Promise<GeoFeature<P>[]>;
  /** Get immediate children of a cluster */
  getChildren: (clusterId: number) => Promise<ClusterFeature<P>[]>;
  /** Get zoom level at which a cluster expands */
  getClusterExpansionZoom: (clusterId: number) => Promise<number>;
}

// ============================================================================
// Hook Implementation
// ============================================================================

// Check if Web Workers are supported
const supportsWorker = typeof Worker !== 'undefined';

/**
 * Hook for running Supercluster in a Web Worker
 *
 * @param geojson - GeoJSON FeatureCollection with Point features
 * @param options - Supercluster configuration options
 * @param viewport - Current map viewport (bbox and zoom)
 * @param workerUrl - URL to the clustering worker file
 * @returns Clustering results and utility functions
 */
export function useSuperclusterWorker<P = Record<string, unknown>>(
  geojson: GeoFeatureCollection<P> | null,
  options: SuperclusterOptions,
  viewport: SuperclusterViewport,
  workerUrl: URL | string
): UseSuperclusterWorkerResult<P> {
  // Initialize state with environment check
  const initialError = useMemo(
    () =>
      supportsWorker ? null : 'Web Workers not supported in this environment',
    []
  );

  const [clusters, setClusters] = useState<ClusterFeature<P>[]>([]);
  const [isLoading, setIsLoading] = useState(supportsWorker);
  const [error, setError] = useState<string | null>(initialError);

  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const pendingRequestsRef = useRef<
    Map<
      number,
      {resolve: (value: unknown) => void; reject: (error: Error) => void}
    >
  >(new Map());
  const isReadyRef = useRef(false);
  const dataLoadedRef = useRef(false);
  const optionsRef = useRef(options);
  const loadingDataRef = useRef(false);

  // Update options ref in effect to avoid accessing during render
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Initialize worker
  useEffect(() => {
    if (!supportsWorker) return;

    let worker: Worker;
    try {
      worker = new Worker(workerUrl, {type: 'module'});
    } catch (e) {
      // Worker creation can fail synchronously, we need to report this error
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(
        `Failed to create worker: ${e instanceof Error ? e.message : 'Unknown error'}`
      );
      setIsLoading(false);
      return;
    }

    workerRef.current = worker;

    // Capture ref values for cleanup
    const pendingRequests = pendingRequestsRef.current;

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;

      switch (response.type) {
        case 'ready':
          isReadyRef.current = true;
          break;

        case 'loaded':
          dataLoadedRef.current = true;
          loadingDataRef.current = false;
          break;

        case 'clusters':
          setClusters(response.clusters as ClusterFeature<P>[]);
          setIsLoading(false);
          break;

        case 'leaves':
        case 'children':
        case 'expansionZoom': {
          const pending = pendingRequests.get(response.requestId);
          if (pending) {
            pendingRequests.delete(response.requestId);
            if (response.type === 'leaves') {
              pending.resolve(response.leaves);
            } else if (response.type === 'children') {
              pending.resolve(response.children);
            } else {
              pending.resolve(response.zoom);
            }
          }
          break;
        }

        case 'error':
          setError(response.message);
          setIsLoading(false);
          if (response.requestId !== undefined) {
            const pending = pendingRequests.get(response.requestId);
            if (pending) {
              pendingRequests.delete(response.requestId);
              pending.reject(new Error(response.message));
            }
          }
          break;
      }
    };

    worker.onerror = err => {
      setError(err.message || 'Worker error');
      setIsLoading(false);
    };

    // Initialize with options
    const initMessage: WorkerMessage = {
      type: 'init',
      options: optionsRef.current
    };
    worker.postMessage(initMessage);

    return () => {
      worker.terminate();
      workerRef.current = null;
      isReadyRef.current = false;
      dataLoadedRef.current = false;
      pendingRequests.clear();
    };
  }, [workerUrl]);

  // Load data when geojson changes
  useEffect(() => {
    const worker = workerRef.current;
    if (!worker || !geojson) return;

    // Mark as loading via ref to avoid effect issues
    loadingDataRef.current = true;
    dataLoadedRef.current = false;

    const loadMessage: WorkerMessage = {
      type: 'load',
      features: geojson.features as GeoFeature[]
    };
    worker.postMessage(loadMessage);
  }, [geojson]);

  // Get clusters when viewport or data changes
  useEffect(() => {
    const worker = workerRef.current;
    if (!worker || !geojson) return;

    // Wait a tick to ensure data is loaded
    const timeoutId = setTimeout(() => {
      const requestId = ++requestIdRef.current;

      const message: WorkerMessage = {
        type: 'getClusters',
        bbox: viewport.bbox,
        zoom: Math.floor(viewport.zoom),
        requestId
      };
      worker.postMessage(message);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [viewport, geojson]);

  const getLeaves = useCallback(
    (clusterId: number, limit?: number): Promise<GeoFeature<P>[]> => {
      return new Promise((resolve, reject) => {
        const worker = workerRef.current;
        if (!worker) {
          reject(new Error('Worker not initialized'));
          return;
        }

        const requestId = ++requestIdRef.current;
        pendingRequestsRef.current.set(requestId, {
          resolve: resolve as (value: unknown) => void,
          reject
        });

        const message: WorkerMessage = {
          type: 'getLeaves',
          clusterId,
          requestId,
          limit
        };
        worker.postMessage(message);
      });
    },
    []
  );

  const getChildren = useCallback(
    (clusterId: number): Promise<ClusterFeature<P>[]> => {
      return new Promise((resolve, reject) => {
        const worker = workerRef.current;
        if (!worker) {
          reject(new Error('Worker not initialized'));
          return;
        }

        const requestId = ++requestIdRef.current;
        pendingRequestsRef.current.set(requestId, {
          resolve: resolve as (value: unknown) => void,
          reject
        });

        const message: WorkerMessage = {
          type: 'getChildren',
          clusterId,
          requestId
        };
        worker.postMessage(message);
      });
    },
    []
  );

  const getClusterExpansionZoom = useCallback(
    (clusterId: number): Promise<number> => {
      return new Promise((resolve, reject) => {
        const worker = workerRef.current;
        if (!worker) {
          reject(new Error('Worker not initialized'));
          return;
        }

        const requestId = ++requestIdRef.current;
        pendingRequestsRef.current.set(requestId, {
          resolve: resolve as (value: unknown) => void,
          reject
        });

        const message: WorkerMessage = {
          type: 'getClusterExpansionZoom',
          clusterId,
          requestId
        };
        worker.postMessage(message);
      });
    },
    []
  );

  return {
    clusters,
    isLoading,
    error,
    getLeaves,
    getChildren,
    getClusterExpansionZoom
  };
}
