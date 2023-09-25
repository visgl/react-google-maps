import * as React from 'react';

type ControlPanelProps = {
  mapIds: {[key: string]: {label: string; mapId: string}};
  selectedMapId: string;
  setSelectedMapId: (id: string) => void;
};

function ControlPanel({
  mapIds,
  selectedMapId,
  setSelectedMapId
}: ControlPanelProps) {
  return (
    <div className="control-panel">
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
        <label>MapId:</label>
        <select
          value={selectedMapId}
          onChange={ev => setSelectedMapId(ev.target.value)}>
          {Object.entries(mapIds).map(([key, {label, mapId}]) => (
            <option key={key} value={mapId}>
              {label}
            </option>
          ))}
        </select>
      </div>

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
