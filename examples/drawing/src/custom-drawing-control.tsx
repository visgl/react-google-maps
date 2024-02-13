import React from 'react';
import {ControlPosition, MapControl} from '@vis.gl/react-google-maps';

import {UndoRedo} from './undo-redo';
import {useDrawingManager} from './use-drawing-manager';

export const CustomDrawingControl = () => {
  const drawingManager = useDrawingManager();

  return (
    <MapControl position={ControlPosition.TOP_CENTER}>
      <UndoRedo drawingManager={drawingManager} />
    </MapControl>
  );
};

export default CustomDrawingControl;
