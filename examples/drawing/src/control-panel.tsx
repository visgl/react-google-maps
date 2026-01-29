import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Drawing Example</h3>
      <p>
        Shows how to build custom drawing tools using Maps JavaScript API
        overlays and implements an undo/redo flow to integrate drawing events
        into the state of a React application.
      </p>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/drawing"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/drawing"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
