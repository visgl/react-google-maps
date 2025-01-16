import React, {useCallback} from 'react';

import {CategoryData} from './trees';

type ControlPanelProps = {
  categories: Array<CategoryData>;
  onCategoryChange: (value: string | null) => void;
};

export const ControlPanel = ({
  categories,
  onCategoryChange
}: ControlPanelProps) => {
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onCategoryChange(e.target.value || null);
    },
    [onCategoryChange]
  );
  return (
    <div className="control-panel marker-clustering-control-panel">
      <h3>Marker Clustering</h3>
      <p>
        This example uses the <code>@googlemaps/markerclusterer</code> library
        to demonstrate how to render a large dataset of markers on the map.
      </p>
      <p>
        This example also includes a filter function to show dynamic updating of
        the clustered markers and an InfoWindow to show details about the
        locations.
      </p>
      <p>
        <label>Filter Trees:</label>{' '}
        <select onChange={handleCategoryChange}>
          <option value={''}>All trees</option>

          {categories.map(category => (
            <option key={category.key} value={category.key}>
              {category.label} ({category.count})
            </option>
          ))}
        </select>
      </p>
      <div className={'attribution'}>
        <div>
          <strong>Data:</strong>{' '}
          <a
            href="https://open.toronto.ca/dataset/street-tree-data/"
            target="_blank">
            Street Tree Data
          </a>{' '}
          licensed under the{' '}
          <a href="https://open.toronto.ca/open-data-license/" target="_blank">
            Open Government Licence – Toronto
          </a>
          .
        </div>
      </div>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/marker-clustering"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/marker-clustering"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
};
