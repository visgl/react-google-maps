import * as React from 'react';

type Props = {
  radius: number;
  opacity: number;
  onRadiusChanged: (radius: number) => void;
  onOpacityChanged: (opacity: number) => void;
};

function ControlPanel({
  radius,
  opacity,
  onRadiusChanged,
  onOpacityChanged
}: Props) {
  return (
    <div className="control-panel">
      <h3>Heatmap</h3>
      <p>
        This uses the <code>useMapsLibrary()</code> hook and the{' '}
        <code>google.maps.visualization</code> library to show earthquake
        magnitude data in a heatmap.
      </p>

      {/* Circle Controls */}
      <div style={{marginBottom: '2rem'}}>
        <h4>Change the heatmap appearance here:</h4>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
            <label htmlFor="radius">Radius:</label>
            <input
              type="number"
              value={radius}
              onChange={e => onRadiusChanged(Number(e.target.value))}
              min={5}
              max={50}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
            <label htmlFor="opacity">Opacity:</label>
            <input
              type="number"
              value={opacity}
              onChange={e => onOpacityChanged(Number(e.target.value))}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
        </div>
      </div>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/heatmap"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/heatmap"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
