import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Directions</h3>
      <p>
        Loading the routes library to render directions on the map using
        DirectionsService and DirectionsRenderer.
      </p>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/directions"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/directions"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
