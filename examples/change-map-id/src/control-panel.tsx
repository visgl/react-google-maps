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
    <div className="control-panel-change-map-id">
      <h3>Change MapIds</h3>
      <p>
        The react-component can switch between multiple mapIds without having to
        reinitialize.
      </p>
      <p>
        Be aware that, due to the way the Google Maps API works, this creates a
        new <code>google.maps.Map</code> instance when the mapId is changed,
        which can cause additional charges.
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

      <div className="source-link">
        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/change-map-id"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
