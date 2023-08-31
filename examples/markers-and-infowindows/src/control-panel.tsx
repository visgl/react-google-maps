import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Markers and InfoWindows</h3>
      <p>
        This example shows the different ways to add markers and infowindows to
        the map.
      </p>
      <div className="source-link">
        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/markers-and-infowindows"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
