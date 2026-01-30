import React from 'react';

import {DrawingMode} from './types';

const MODES: Array<{mode: Exclude<DrawingMode, null>; label: string}> = [
  {mode: 'marker', label: 'Marker'},
  {mode: 'circle', label: 'Circle'},
  {mode: 'polygon', label: 'Polygon'},
  {mode: 'polyline', label: 'Polyline'},
  {mode: 'rectangle', label: 'Rectangle'}
];

interface Props {
  activeMode: DrawingMode;
  setActiveMode: (mode: DrawingMode) => void;
}

export const DrawingToolbar = ({activeMode, setActiveMode}: Props) => {
  return (
    <div className="drawing-toolbar" role="toolbar" aria-label="Drawing tools">
      {MODES.map(({mode, label}) => (
        <button
          key={mode}
          type="button"
          className={activeMode === mode ? 'is-active' : undefined}
          onClick={() => setActiveMode(mode)}
          aria-pressed={activeMode === mode}>
          {label}
        </button>
      ))}
    </div>
  );
};
