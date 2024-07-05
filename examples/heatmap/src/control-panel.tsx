import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Heatmap</h3>
      <p>
        This uses the useMapsLibrary hook showing earthquake magnitude data in a
        heatmap.
      </p>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/heatmap"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/heatmap"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
