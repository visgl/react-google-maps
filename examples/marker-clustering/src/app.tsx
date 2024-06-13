import React, {useEffect, useState, useMemo} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';

import {ControlPanel} from './control-panel';
import {getCategories, loadTreeDataset, Tree} from './trees';
import {ClusteredTreeMarkers} from './clustered-tree-markers';

import './style.css';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

/**
 * The App component contains the APIProvider, Map and ControlPanel and handles
 * data-loading and filtering.
 */
const App = () => {
  const [trees, setTrees] = useState<Tree[]>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // load data asynchronously
  useEffect(() => {
    loadTreeDataset().then(data => setTrees(data));
  }, []);

  // get category information for the filter-dropdown
  const categories = useMemo(() => getCategories(trees), [trees]);
  const filteredTrees = useMemo(() => {
    if (!trees) return null;

    return trees.filter(
      t => !selectedCategory || t.category === selectedCategory
    );
  }, [trees, selectedCategory]);

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        mapId={'bf51a910020fa25a'}
        defaultCenter={{lat: 43.64, lng: -79.41}}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI>
        {filteredTrees && <ClusteredTreeMarkers trees={filteredTrees} />}
      </Map>

      <ControlPanel
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />
    </APIProvider>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
