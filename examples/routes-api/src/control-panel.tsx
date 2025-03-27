import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Routes API Rendering</h3>
      <p>
        This is an example to show how to retrieve a route from the new Routes
        API and visualize it with polylines and advanced markers.
      </p>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/routes-api"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/routes-api"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
