import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Externally loaded Google Maps JavaScript API</h3>
      <p>
        The example demonstrates how to load the Google Maps API externally.
      </p>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/external-js-api"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/external-js-api"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
