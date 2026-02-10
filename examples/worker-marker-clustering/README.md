# Worker-based Marker Clustering

This example demonstrates how to use Web Workers for clustering large datasets
(10k-100k+ markers) without blocking the main thread.

## The Problem

When using Supercluster on the main thread with large datasets:

- `clusterer.load()` blocks the UI for several seconds
- Map becomes unresponsive during clustering calculations
- Users experience "frozen" interfaces

## The Solution

This example uses the `useSuperclusterWorker` hook which:

- Runs all Supercluster operations in a Web Worker
- Keeps the main thread free for smooth map interactions
- Provides loading state for UI feedback

## Key Files

- `src/clustering.worker.ts` - Web Worker that runs Supercluster
- `src/hooks/use-map-viewport.ts` - Hook to track map viewport bounds and zoom
- `src/hooks/use-supercluster-worker.ts` - Hook for Web Worker-based clustering
- `src/app.tsx` - Main application using the clustering hooks

## Usage

```tsx
import {useMapViewport} from './hooks/use-map-viewport';
import {useSuperclusterWorker} from './hooks/use-supercluster-worker';

// Create worker URL (Vite handles bundling)
const workerUrl = new URL('./clustering.worker.ts', import.meta.url);

function ClusteredMarkers({geojson}) {
  const viewport = useMapViewport({padding: 100});

  const {clusters, isLoading, error} = useSuperclusterWorker(
    geojson,
    {radius: 120, maxZoom: 16},
    viewport,
    workerUrl
  );

  if (isLoading) return <LoadingSpinner />;

  return clusters.map(feature => <Marker key={feature.id} feature={feature} />);
}
```

## Running Locally

```bash
# Install dependencies
npm install

# Set your Google Maps API key
export GOOGLE_MAPS_API_KEY=your_key_here

# Start development server (with local library)
npm run start-local

# Or start standalone
npm start
```

## Performance Comparison

| Points  | Main Thread  | Web Worker |
| ------- | ------------ | ---------- |
| 10,000  | ~500ms block | No block   |
| 50,000  | ~2s block    | No block   |
| 100,000 | ~5s block    | No block   |

The Web Worker approach keeps the UI responsive regardless of dataset size,
with clustering happening asynchronously in the background.
