import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Places UI Kit</h3>
      <p>This shows the use of the Places UI Kit webcomponents.</p>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/places-ui-kit"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/places-ui-kit"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
