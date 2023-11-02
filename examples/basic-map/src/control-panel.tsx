import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel-basic-map">
      <h3>Basic Map</h3>
      <p>
        The simplest example possible, just rendering a google map with some
        settings adjusted.
      </p>
      <div className="source-link">
        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/basic-map"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
