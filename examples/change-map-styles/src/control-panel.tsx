import * as React from 'react';
import type {MapConfig} from './app';

type ControlPanelProps = {
  mapConfigs: MapConfig[];
  mapConfigId: string;
  onMapConfigIdChange: (id: string) => void;
};

function ControlPanel({
  mapConfigs,
  mapConfigId,
  onMapConfigIdChange
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <h3>Change Map Styles</h3>
      <p>
        The <code>Map</code> component can switch between multiple styles, even
        between cloud-based and local styles, on the fly. Switching the mapType
        is supported as well.
      </p>
      <p>
        Due to the way the Maps API works, a new <code>google.maps.Map</code>{' '}
        instance has to be created when the mapId is changed, which could affect
        the number of paid map-views.
      </p>

      <div>
        <label>Map Configuration</label>
        <select
          value={mapConfigId}
          onChange={ev => onMapConfigIdChange(ev.target.value)}>
          {mapConfigs.map(({id, label}) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/change-map-styles"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/change-map-styles"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
