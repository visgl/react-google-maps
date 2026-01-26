import React from 'react';
import {ControlPosition, Map, MapControl} from '@vis.gl/react-google-maps';

import {UndoRedoControl} from './undo-redo-control';
import {DrawingToolbar} from './drawing-toolbar';
import {useDrawingManager} from './use-drawing-manager';
import ControlPanel from './control-panel';

const DrawingExample = () => {
  const drawingController = useDrawingManager();

  return (
    <>
      <Map
        defaultZoom={3}
        defaultCenter={{lat: 22.54992, lng: 0}}
        mapId="712dec71c4c9382b"
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        disableDoubleClickZoom={true}
      />

      <ControlPanel />

      <MapControl position={ControlPosition.TOP_CENTER}>
        <div className="drawing-controls">
          <DrawingToolbar
            activeMode={drawingController.activeMode}
            setActiveMode={drawingController.setActiveMode}
          />
          <UndoRedoControl
            drawingController={drawingController.eventTarget}
            onOverlaySelect={() => drawingController.setActiveMode(null)}
          />
        </div>
      </MapControl>
    </>
  );
};

export default DrawingExample;
