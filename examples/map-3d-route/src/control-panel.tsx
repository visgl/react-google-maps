import * as React from 'react';
import './control-panel.css';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>3D Map Routes</h3>
      <p>
        This example demonstrates how to render a client-side 3D route using the
        modern <code>&lt;gmp-route-3d&gt;</code> custom element inside a 3D Map.
      </p>

      <p className={'note'}>
        <strong>Note:</strong> This utilizes custom 3D elements from the Maps JS
        API{' '}
        <a
          href="https://developers.google.com/maps/documentation/javascript/reference/routes-elements"
          target="_new">
          routes
        </a>{' '}
        and{' '}
        <a
          href="https://developers.google.com/maps/documentation/javascript/reference/3d-map"
          target="_new">
          maps3d
        </a>{' '}
        libraries.
      </p>

      <div className="links">
        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/map-3d-route"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
