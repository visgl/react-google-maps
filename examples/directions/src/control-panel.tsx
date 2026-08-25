import * as React from 'react';
import './control-panel.css';

const GCP_DIRECTIONS_API =
  'https://console.cloud.google.com/apis/library/directions-backend.googleapis.com';

const GCP_ROUTES_API =
  'https://console.cloud.google.com/apis/library/routes.googleapis.com';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Routes API</h3>
      <p>
        Loading the routes library to compute and render routes on the map using
        the modern <code>Route.computeRoutes</code> service.
      </p>

      <p className={'note'}>
        <strong>Important:</strong> This example uses the new {' '}
        <a target={'_new'} href={GCP_ROUTES_API}>
          Routes API (Recommended)
        </a>{' '},
        the modern and current way to calculate directions. If you are using the{' '}
        <a target={'_new'} href={GCP_DIRECTIONS_API}>
          Directions API (Legacy)
        </a>{' '}
        Service, switch to this implementation of Routes API.
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
