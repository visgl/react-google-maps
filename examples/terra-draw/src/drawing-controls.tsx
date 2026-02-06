import * as React from 'react';
import type {TerraDraw} from 'terra-draw';

import {DRAWING_MODE_BUTTONS, TerraDrawModeId} from './terra-draw-config';

type DrawingControlsProps = {
  draw: TerraDraw | null;
};

const DEFAULT_MODE: TerraDrawModeId = 'point';

const DrawingControls = ({draw}: DrawingControlsProps) => {
  const [activeMode, setActiveMode] = React.useState<TerraDrawModeId>('static');

  React.useEffect(() => {
    if (!draw || activeMode !== 'static') return;

    // Start in a sensible default mode once TerraDraw is ready.
    draw.setMode(DEFAULT_MODE);
    setActiveMode(DEFAULT_MODE);
  }, [draw, activeMode]);

  const handleModeChange = (modeId: TerraDrawModeId) => {
    if (!draw) return;

    draw.setMode(modeId);
    setActiveMode(modeId);
  };

  const handleClear = () => {
    if (!draw) return;

    draw.clear();
    draw.setMode('static');
    setActiveMode('static');
  };

  const handleDeleteLast = () => {
    if (!draw) return;

    const snapshot = draw.getSnapshot();
    const lastFeature = snapshot[snapshot.length - 1];

    if (lastFeature?.id) {
      draw.removeFeatures([lastFeature.id]);
    }
  };

  return (
    <div className="terra-draw-toolbar-group">
      <div className="terra-draw-toolbar-row">
        {DRAWING_MODE_BUTTONS.map(button => (
          <button
            key={button.id}
            type="button"
            className={`terra-draw-button ${
              activeMode === button.id ? 'active' : ''
            }`}
            onClick={() => handleModeChange(button.id)}
            disabled={!draw}>
            {button.label}
          </button>
        ))}
      </div>
      <div className="terra-draw-toolbar-row">
        <button
          type="button"
          className="terra-draw-button"
          onClick={handleDeleteLast}
          disabled={!draw}>
          Delete Last
        </button>
        <button
          type="button"
          className="terra-draw-button"
          onClick={handleClear}
          disabled={!draw}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default React.memo(DrawingControls);
