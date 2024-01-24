import * as React from 'react';

type Props = {
  center: google.maps.LatLngLiteral;
  radius: number;
  onCenterChanged: (c: google.maps.LatLngLiteral) => void;
  onRadiusChanged: (r: number) => void;
};
function CircleControlPanel({
  center,
  radius,
  onRadiusChanged,
  onCenterChanged
}: Props) {
  return (
    <div className="control-panel" style={{top: 200}}>
      <h3>Change the circle from here:</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <label htmlFor="radius">Radius:</label>
          <input
            type="number"
            value={radius}
            onChange={e => onRadiusChanged(Number(e.target.value))}
          />
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
  );
}

export default React.memo(CircleControlPanel);
