import React from 'react';
import {ControlPosition, Map, MapControl} from '@vis.gl/react-google-maps';

import {UndoRedoControl} from './undo-redo-control';
import {useDrawingManager} from './use-drawing-manager';
import ControlPanel from './control-panel';

const DrawingExample = () => {
  const drawingManager = useDrawingManager();

  return (
    <>
      <Map
        defaultZoom={3}
        defaultCenter={{lat: 22.54992, lng: 0}}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      />

      <ControlPanel />

      <MapControl position={ControlPosition.TOP_CENTER}>
        <UndoRedoControl drawingManager={drawingManager} />
      </MapControl>
    </>
  );
};

export default DrawingExample;
