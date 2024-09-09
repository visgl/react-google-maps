import * as React from 'react';

const GMP_3D_MAPS_OVERVIEW_URL =
  'https://developers.google.com/maps/documentation/javascript/3d-maps-overview';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>3D Maps</h3>
      <p>
        This example implements a new <code>Map3D</code> component that renders
        a 3D Globe based on the new experimental{' '}
        <a href={GMP_3D_MAPS_OVERVIEW_URL} target={'_blank'}>
          <code>Map3DElement</code>
        </a>{' '}
        web-component.
      </p>

      <p>
        The mini-map in the bottom right shows the position and heading of the
        globe camera as well as the center-point of the globe view. Clicking in
        the mini-map will update the center-point of the globe.
      </p>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/map-3d"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/map-3d"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
