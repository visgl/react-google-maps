import * as React from 'react';

import {ControlPosition} from '@vis.gl/react-google-maps';

export type ControlPanelProps = {
  position: ControlPosition;
  onControlPositionChange: (position: ControlPosition) => void;
};

function ControlPanel({position, onControlPositionChange}: ControlPanelProps) {
  const positionOptions: {key: string; value: ControlPosition}[] = [];

  for (const [p, v] of Object.entries(ControlPosition)) {
    positionOptions.push({key: p, value: v as ControlPosition});
  }

  return (
    <div className="control-panel">
      <h3>MapControl Example</h3>
      <p>
        Demonstrates how to use the <code>&lt;MapControl&gt;</code> component to
        add custom control components to the map.
      </p>

      <div>
        <label>Control Position</label>
        <select
          value={position}
          onChange={ev =>
            onControlPositionChange(Number(ev.target.value) as ControlPosition)
          }>
          {positionOptions.map(({key, value}) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/map-control"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/map-control"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
