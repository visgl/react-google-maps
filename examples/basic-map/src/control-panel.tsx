import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Example Template</h3>
      <p>
        Add a brief description of the example here and update the link below
      </p>
      <div className="source-link">
        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/_template"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
