import * as React from 'react';
import './control-panel.css';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>3D Map Routes (JS API)</h3>
      <p>
        This example demonstrates how to retrieve a route programmatically using
        the modern <code>google.maps.routes.Route.computeRoutes(...)</code> SDK
        method and visualize it cleanly using a custom-styled 3D polyline.
      </p>

      <p className={'note'}>
        <strong>Note:</strong> This utilizes custom 3D elements and routing from
        the Maps JS API{' '}
        <a
          href="https://developers.google.com/maps/documentation/javascript/reference/route"
          target="_new">
          Route
        </a>{' '}
        and{' '}
        <a
          href="https://developers.google.com/maps/documentation/javascript/reference/3d-map"
          target="_new">
          3D Map
        </a>{' '}
        libraries.{' '}
        <strong>Note that ROADMAP mode is currently in Alpha.</strong>
      </p>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/map-3d-routes"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/map-3d-routes"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
