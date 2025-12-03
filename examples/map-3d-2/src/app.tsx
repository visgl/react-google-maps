import React, {useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map3D, Map3DRef} from '@vis.gl/react-google-maps';
import ControlPanel from './control-panel';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

// San Francisco coordinates with altitude
const INITIAL_CENTER = {lat: 37.7749, lng: -122.4194, altitude: 500};
const INITIAL_RANGE = 2000;
const INITIAL_HEADING = 0;
const INITIAL_TILT = 60;

const App = () => {
  const map3dRef = useRef<Map3DRef>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlyCameraAround = () => {
    if (!map3dRef.current?.map3d) return;

    setIsAnimating(true);
    // Use the current camera position for the orbit animation
    const map3d = map3dRef.current.map3d;
    map3dRef.current.flyCameraAround({
      camera: {
        center: map3d.center || INITIAL_CENTER,
        range: map3d.range || INITIAL_RANGE,
        heading: map3d.heading || INITIAL_HEADING,
        tilt: map3d.tilt || INITIAL_TILT
      },
      durationMillis: 15000,
      repeatCount: 1
    });
  };

  const handleFlyCameraTo = () => {
    if (!map3dRef.current) return;

    setIsAnimating(true);
    // Fly to Golden Gate Bridge
    map3dRef.current.flyCameraTo({
      endCamera: {
        center: {lat: 37.8199, lng: -122.4783, altitude: 100},
        range: 1000,
        heading: 45,
        tilt: 65
      },
      durationMillis: 5000
    });
  };

  const handleStopAnimation = () => {
    if (!map3dRef.current) return;

    map3dRef.current.stopCameraAnimation();
    setIsAnimating(false);
  };

  return (
    <APIProvider apiKey={API_KEY}>
      <Map3D
        ref={map3dRef}
        defaultCenter={INITIAL_CENTER}
        defaultRange={INITIAL_RANGE}
        defaultHeading={INITIAL_HEADING}
        onClick={ev => {
          console.log(ev);
        }}
        defaultTilt={INITIAL_TILT}
        mode="HYBRID"
        onAnimationEnd={() => setIsAnimating(false)}
        onCameraChanged={e => {
          console.log('Camera changed:', e.detail);
        }}
      />
      <ControlPanel
        onFlyCameraAround={handleFlyCameraAround}
        onFlyCameraTo={handleFlyCameraTo}
        onStopAnimation={handleStopAnimation}
        isAnimating={isAnimating}
      />
    </APIProvider>
  );
};

export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
