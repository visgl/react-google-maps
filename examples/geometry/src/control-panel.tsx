import * as React from 'react';

function ControlPanel({
  center,
  radius,
  onRadiusChanged,
  onCenterChanged
}: Props) {
  return (
    <div className="control-panel">
      <h3>Map with Geometry</h3>
      <p>
        Example to demonstrate usage of <code>{'<Polygon>'}</code>,{' '}
        <code>{'<Polyline>'}</code> and <code>{'<Circle>'}</code> components.
      </p>

      {/* Circle Controls */}
      <div style={{marginBottom: '2rem'}}>
        <h4>Change the circle from here:</h4>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <label htmlFor="radius">Radius:</label>
            <input
              type="number"
              value={radius}
              onChange={e => onRadiusChanged(Number(e.target.value))}
            />
          </div>
          <div>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={radius}
              onChange={e => onRadiusChanged(Number(e.target.value))}
              style={{width: '100%'}}
            />
          </div>
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            <button onClick={() => onRadiusChanged(10000)}>10km</button>
            <button onClick={() => onRadiusChanged(25000)}>25km</button>
            <button onClick={() => onRadiusChanged(50000)}>50km</button>
            <button onClick={() => onRadiusChanged(75000)}>75km</button>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <label htmlFor="lat">Lat:</label>
            <input
              type="number"
              value={center.lat}
              onChange={e =>
                onCenterChanged({lat: Number(e.target.value), lng: center.lng})
              }
            />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <label htmlFor="lng">Lng:</label>
            <input
              type="number"
              value={center.lng}
              onChange={e =>
                onCenterChanged({lat: center.lat, lng: Number(e.target.value)})
              }
            />
          </div>
        </div>
      </div>

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/geometry"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/geometry"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

type Props = {
  center: google.maps.LatLngLiteral;
  radius: number;
  onCenterChanged: (c: google.maps.LatLngLiteral) => void;
  onRadiusChanged: (r: number) => void;
};

export default React.memo(ControlPanel);
