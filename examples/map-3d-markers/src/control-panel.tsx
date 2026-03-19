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
        This example demonstrates the <code>Map3D</code>, <code>Marker3D</code>,
        and <code>Pin</code> components for rendering 3D maps based on the{' '}
        <a href={GMP_3D_MAPS_OVERVIEW_URL} target={'_blank'}>
          Google Maps 3D
        </a>{' '}
        web components.
      </p>

      <p>
        The map showcases various marker types including basic markers, extruded
        markers, markers with custom pins, SVG/image markers, and 3D models.
        Learn more about{' '}
        <a href={GMP_3D_MAPS_MARKER_ADD_URL} target={'_blank'}>
          adding markers to 3D maps
        </a>
        .
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
