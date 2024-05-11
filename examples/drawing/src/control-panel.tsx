import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Drawing Tools Example</h3>
      <p>
        Shows how to use the drawing tools of the Maps JavaScript API and
        implements an undo/redo flow to show how to integrate the drawing
        manager and its events into the state of a react-application.
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
