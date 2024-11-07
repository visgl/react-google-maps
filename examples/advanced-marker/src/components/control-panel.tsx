import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Advanced Marker</h3>
      <p>
        This example uses the <code>&lt;AdvancedMarker&gt;</code> component with
        custom hover and click states.
      </p>

      <p>
        By integrating content in the marker that would traditionally be shown
        in an info window, we can create a smooth and engaging user experience.
      </p>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/advanced-marker"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/advanced-marker"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
