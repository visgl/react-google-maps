import {ControlPosition, MapControl} from '@vis.gl/react-google-maps';
import React from 'react';

type CustomZoomControlProps = {
  controlPosition: ControlPosition;
  zoom: number;
  onZoomChange: (zoom: number) => void;
};

export const CustomZoomControl = ({
  controlPosition,
  zoom,
  onZoomChange
}: CustomZoomControlProps) => {
  return (
    <MapControl position={controlPosition}>
      <div
        style={{
          margin: '10px',
          padding: '1em',
          background: 'rgba(255,255,255,0.4)',
          display: 'flex',
          flexFlow: 'column nowrap'
        }}>
        <label htmlFor={'zoom'}>This is a custom zoom control!</label>
        <input
          id={'zoom'}
          type={'range'}
          min={1}
          max={18}
          step={'any'}
          value={zoom}
          onChange={ev => onZoomChange(ev.target.valueAsNumber)}
        />
      </div>
    </MapControl>
  );
};
