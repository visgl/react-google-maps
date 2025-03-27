import * as React from 'react';
import './control-panel.css';

const GCP_DIRECTIONS_API =
  'https://console.cloud.google.com/apis/library/directions-backend.googleapis.com';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Directions</h3>
      <p>
        Loading the routes library to render directions on the map using
        <code>DirectionsService</code> and <code>DirectionsRenderer</code>.
      </p>

      <p className={'note'}>
        <strong>Important:</strong> This example is only compatible with the
        Directions API Legacy Service. Using this Services requires enabling the
        API on your Google Cloud project by following the direct links:{' '}
        <a target={'_new'} href={GCP_DIRECTIONS_API}>
          Directions API (Legacy)
        </a>
        .
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
