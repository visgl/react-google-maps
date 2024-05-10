import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Google Maps Platform’s Extended Component Library</h3>
      <p>
        Google Maps Platform’s Extended Component Library is a set of Web
        Components that helps developers build better maps faster, and with less
        effort.
      </p>
      <p>
        Ultimately, these components make it easier to read, learn, customize,
        and maintain maps-related code.
      </p>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/extended-component-library"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/extended-component-library"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
