import * as React from 'react';
import {DetailsSize} from './app';

interface ControlPanelProps {
  detailsSize: DetailsSize;
  onDetailSizeChange: (size: DetailsSize) => void;
}

function ControlPanel(props: ControlPanelProps) {
  return (
    <div className="control-panel">
      <h3>Places UI Kit</h3>
      <p>This shows the use of the Places UI Kit webcomponents.</p>

      <p>Control the size of the place details infowindow:</p>
      <select
        name="detailsSize"
        id="detailsSize"
        value={props.detailsSize}
        onChange={event => {
          props.onDetailSizeChange(event.target.value as DetailsSize);
        }}>
        <option value="SMALL">Small</option>
        <option value="MEDIUM">Medium</option>
        <option value="LARGE">Large</option>
        <option value="X_LARGE">X-Large</option>
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
