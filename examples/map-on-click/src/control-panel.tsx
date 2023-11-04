import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Basic Map with onClick event</h3>
      <p>
        The basic example of Google Maps with onCLick event that returns the
        current map in the callback.
      </p>
      <div className="source-link">
        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/map-on-click"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
