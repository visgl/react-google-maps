import {useMap3D} from '@vis.gl/react-google-maps';
import * as React from 'react';

interface ControlPanelProps {
  onFlyCameraAround: () => void;
  onFlyCameraTo: () => void;
  onStopAnimation: () => void;
  isAnimating: boolean;
}

function ControlPanel({
  onFlyCameraAround,
  onFlyCameraTo,
  onStopAnimation,
  isAnimating
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <h3>Map3D Component Example</h3>
      <p>
        This example demonstrates the new Map3D component with camera animations
        using the Google Maps 3D API.
      </p>

      <div className="buttons">
        <button onClick={onFlyCameraAround} disabled={isAnimating}>
          Fly Camera Around
        </button>
        <button onClick={onFlyCameraTo} disabled={isAnimating}>
          Fly to Golden Gate
        </button>
        <button onClick={onStopAnimation} disabled={!isAnimating}>
          Stop Animation
        </button>
      </div>

      {isAnimating && (
        <p className="status">
          <em>Animation in progress...</em>
        </p>
      )}

      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/map-3d-2"
          target="_new">
          Try on CodeSandbox ↗
        </a>

        <a
          href="https://github.com/visgl/react-google-maps/tree/main/examples/map-3d-2"
          target="_new">
          View Code ↗
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
