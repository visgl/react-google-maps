import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Synchronized Maps</h3>
      <p>
        Shows how to use the controlled map component to synchronize multiple
        map instances.
      </p>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/multiple-maps"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/multiple-maps"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
