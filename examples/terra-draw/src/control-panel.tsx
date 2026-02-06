import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Terra Draw Integration</h3>
      <p>
        An example that wires TerraDraw into the react map. Use the toolbar to
        switch modes, draw features, and import/export GeoJSON.
      </p>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/terra-draw"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/terra-draw"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
