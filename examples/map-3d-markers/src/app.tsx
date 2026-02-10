/* eslint-disable no-console */
import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {
  AltitudeMode,
  APIProvider,
  Map3D,
  MapMode,
  Marker3D,
  Pin,
  Popover3D
} from '@vis.gl/react-google-maps';

import {Model3D, Model3DProps} from './model-3d';
import ControlPanel from './control-panel';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

const INITIAL_VIEW_PROPS = {
  defaultCenter: {lat: 40.7093, lng: -73.9968, altitude: 32},
  defaultRange: 1733,
  defaultHeading: 5,
  defaultTilt: 70,
  defaultRoll: 0
};

/**
 * AnimatedModel3D wraps the Model3D component with rotation animation.
 * Demonstrates how to animate 3D models using requestAnimationFrame.
 */
const AnimatedModel3D = (modelProps: Model3DProps) => {
  const rotationSpeed = 10;
  const [modelHeading, setModelHeading] = useState(0);

  // Animate the model rotation using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (lastTimestamp === 0) lastTimestamp = timestamp;

      const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds
      lastTimestamp = timestamp;

      setModelHeading(prev => (prev + rotationSpeed * deltaTime) % 360);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [rotationSpeed]);

  return (
    <Model3D
      {...modelProps}
      orientation={{heading: modelHeading, tilt: 0, roll: 0}}
    />
  );
};

const App = () => {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [interactiveMarker, setInteractiveMarker] =
    useState<google.maps.maps3d.Marker3DInteractiveElement | null>(null);

  return (
    <APIProvider apiKey={API_KEY} libraries={['maps3d', 'marker']}>
      <Map3D
        mode={MapMode.SATELLITE}
        {...INITIAL_VIEW_PROPS}
        defaultLabelsDisabled>
        {/* Basic marker with popover (non-interactive) */}
        <Marker3D
          position={{lat: 40.704876, lng: -73.995379, altitude: 50}}
          altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
        />

        {/* Basic extruded marker */}
        <Marker3D
          position={{lat: 40.704118, lng: -73.994371, altitude: 150}}
          altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
          extruded
        />

        {/* Interactive marker with colored pin and popover */}
        <Marker3D
          ref={setInteractiveMarker}
          position={{lat: 40.705666, lng: -73.996382, altitude: 50}}
          altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
          onClick={() => {
            console.log('Interactive marker clicked!');
            setOpenPopoverId('colored-pin');
          }}
          title="Click to see details">
          <Pin borderColor="#0D652D" background="#34A853" glyphColor="white" />
        </Marker3D>

        {openPopoverId === 'colored-pin' && (
          <Popover3D
            open
            anchor={interactiveMarker}
            onClose={() => {
              setOpenPopoverId(null);
              console.log('close');
            }}>
            <div style={{padding: '12px', maxWidth: '200px'}}>
              <h3 style={{margin: '0 0 8px 0', fontSize: '14px'}}>
                Custom Pin Marker
              </h3>
              <p style={{margin: 0, fontSize: '12px'}}>
                An interactive marker with custom pin colors. Click the marker
                to toggle this popover.
              </p>
            </div>
          </Popover3D>
        )}

        {/* Marker with custom logo pin */}
        <Marker3D
          position={{lat: 40.706461, lng: -73.997409, altitude: 50}}
          altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}>
          <Pin
            borderColor="white"
            background="white"
            glyph="https://www.gstatic.com/images/branding/productlogos/maps/v7/192px.svg"
          />
        </Marker3D>

        {/* Marker with SVG image */}
        <Marker3D
          position={{lat: 40.707275, lng: -73.998332, altitude: 80}}
          altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}>
          <img
            src="https://www.gstatic.com/images/branding/productlogos/maps/v7/192px.svg"
            width={64}
            height={64}
          />
        </Marker3D>

        {/* Animated 3D Model */}
        <AnimatedModel3D
          position={{
            lat: 40.708804,
            lng: -74.000229,
            altitude: 150
          }}
          altitudeMode={
            AltitudeMode.RELATIVE_TO_GROUND as google.maps.maps3d.AltitudeMode
          }
          src={new URL('../data/balloon-red.glb', import.meta.url)}
          scale={10}
        />
      </Map3D>

      <ControlPanel />
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
