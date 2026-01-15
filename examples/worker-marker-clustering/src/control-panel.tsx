import React from 'react';

type ControlPanelProps = {
  pointCount: number;
  onPointCountChange: (count: number) => void;
};

const POINT_OPTIONS = [1000, 5000, 10000, 25000, 50000, 100000];

export const ControlPanel = ({
  pointCount,
  onPointCountChange
}: ControlPanelProps) => {
  return (
    <div className="control-panel">
      <h3>Worker Clustering Demo</h3>

      <div className="control-group">
        <label>Number of Points:</label>
        <select
          value={pointCount}
          onChange={e => onPointCountChange(Number(e.target.value))}>
          {POINT_OPTIONS.map(count => (
            <option key={count} value={count}>
              {count.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="info">
        <p>
          This example uses a <strong>Web Worker</strong> to run Supercluster
          clustering off the main thread.
        </p>
        <p>
          Try selecting 50k or 100k points - the map stays responsive while
          clustering happens in the background!
        </p>
      </div>

      <div className="instructions">
        <p>
          <strong>Click</strong> a cluster to zoom in
        </p>
        <p>
          <strong>Click</strong> a point to see details
        </p>
      </div>
    </div>
  );
};
