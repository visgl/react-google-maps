import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Advanced Marker</h3>
      <p>
        This example uses <code>&lt;AdvancedMarker&gt;</code> component with
        custom hover and click states, integrating React components for dynamic
        content.
      </p>

      <p>
        The marker can display additional "infowindow-like" information or
        perform actions, creating an engaging and responsive user experience.
      </p>
    </div>
  );
}

export default React.memo(ControlPanel);
