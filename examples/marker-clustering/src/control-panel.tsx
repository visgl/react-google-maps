import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Marker Clustering</h3>
      <p>Using MarkerClusterer to cluster Markers on a map.</p>

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
}

export default React.memo(ControlPanel);
