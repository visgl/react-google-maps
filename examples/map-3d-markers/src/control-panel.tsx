import * as React from 'react';

const GMP_3D_MAPS_OVERVIEW_URL =
  'https://developers.google.com/maps/documentation/javascript/3d-maps-overview';

const GMP_3D_MAPS_MARKER_ADD_URL =
  'https://developers.google.com/maps/documentation/javascript/3d/marker-add';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>3D Maps with Markers</h3>
      <p>
        This example implements a new <code>Map3D</code> component that renders
        a 3D Globe based on the new experimental{' '}
        <a href={GMP_3D_MAPS_OVERVIEW_URL} target={'_blank'}>
          <code>Map3DElement</code>
        </a>{' '}
        web-component.
      </p>

      <p>
        The map contains basic{' '}
        <a href={GMP_3D_MAPS_MARKER_ADD_URL} target={'_blank'}>
          <code>Marker3DElements</code>
        </a>{' '}
        as well as markers with a custom pin and a 3D model.
      </p>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/map-3d-markers"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/map-3d-markers"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
