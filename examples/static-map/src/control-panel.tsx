import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Static Map</h3>
      <p>Static Map usage examples.</p>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/static-map"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/static-map"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
