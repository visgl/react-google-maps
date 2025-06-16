import * as React from 'react';
import {DetailsSize} from './app';

interface ControlPanelProps {
  detailsSize: DetailsSize;
  onDetailSizeChange: (size: DetailsSize) => void;
}

// ControlPanel provides UI configuration options for the place details view
// This component is memoized to prevent unnecessary re-renders
function ControlPanel(props: ControlPanelProps) {
  return (
    <div className="control-panel">
      <h3>Places UI Kit</h3>
      <p>This shows the use of the Places UI Kit webcomponents.</p>

      <p>Control the size of the place details infowindow:</p>
      {/* 
        Dropdown to select the level of detail shown in the place details infowindow
        - SMALL: Compact view with minimal information
        - MEDIUM: Standard view with moderate detail
        - LARGE: Extended view with more information
        - X_LARGE: Comprehensive view with all available details
      */}
      <select
        name="detailsSize"
        id="detailsSize"
        value={props.detailsSize}
        onChange={event => {
          props.onDetailSizeChange(event.target.value as DetailsSize);
        }}>
        <option value="FULL">Full</option>
        <option value="COMPACT">Compact</option>
      </select>
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
