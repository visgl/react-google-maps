import {Ref, useEffect, useState} from 'react';

import {useCallbackRef} from '../../hooks/use-callback-ref';
import {useMapsLibrary} from '../../hooks/use-maps-library';
import {
  CameraStateRef3D,
  useTrackedCameraStateRef3D
} from './use-tracked-camera-state-ref-3d';
import {Map3DProps} from './index';

/**
 * Hook to manage the Map3DElement instance lifecycle.
 *
 * Handles:
 * - Waiting for the 'maps3d' library to load
 * - Waiting for the 'gmp-map-3d' custom element to be defined
 * - Creating a callback ref for the element
 * - Applying initial options when the element is ready
 * - Tracking camera state
 *
 * @internal
 */
export function useMap3DInstance(
  props: Map3DProps
): readonly [
  map3d: google.maps.maps3d.Map3DElement | null,
  containerRef: Ref<HTMLDivElement>,
  map3dRef: Ref<google.maps.maps3d.Map3DElement>,
  cameraStateRef: CameraStateRef3D,
  isReady: boolean
] {
  // Load the maps3d library
  const maps3dLib = useMapsLibrary('maps3d');

  // Track if the custom element is defined
  const [customElementReady, setCustomElementReady] = useState(false);

  // Container ref for the wrapper div
  const [container, containerRef] = useCallbackRef<HTMLDivElement>();

  // Ref for the gmp-map-3d element
  const [map3d, map3dRef] = useCallbackRef<google.maps.maps3d.Map3DElement>();

  // Track camera state
  const cameraStateRef = useTrackedCameraStateRef3D(map3d);

  // Wait for custom element definition
  useEffect(() => {
    customElements.whenDefined('gmp-map-3d').then(() => {
      setCustomElementReady(true);
    });
  }, []);

  // Apply initial options when map3d element is ready
  useEffect(() => {
    if (!map3d) return;

    const {
      // Extract camera props
      center,
      heading,
      tilt,
      range,
      roll,
      // Extract default* props (not applied to element)
      defaultCenter,
      defaultHeading,
      defaultTilt,
      defaultRange,
      defaultRoll,
      // Extract non-element props
      id,
      style,
      className,
      children,
      // Extract event props
      onCenterChanged,
      onHeadingChanged,
      onTiltChanged,
      onRangeChanged,
      onRollChanged,
      onCameraChanged,
      onClick,
      onSteadyChange,
      onAnimationEnd,
      onError,
      // Remaining are element options
      ...elementOptions
    } = props;

    // Apply initial camera state from props or defaults
    const initialCenter = center ?? defaultCenter;
    const initialHeading = heading ?? defaultHeading;
    const initialTilt = tilt ?? defaultTilt;
    const initialRange = range ?? defaultRange;
    const initialRoll = roll ?? defaultRoll;

    // Build initial options object
    const initialOptions: Partial<google.maps.maps3d.Map3DElementOptions> = {
      ...elementOptions
    };

    if (initialCenter) initialOptions.center = initialCenter;
    if (initialHeading !== undefined) initialOptions.heading = initialHeading;
    if (initialTilt !== undefined) initialOptions.tilt = initialTilt;
    if (initialRange !== undefined) initialOptions.range = initialRange;
    if (initialRoll !== undefined) initialOptions.roll = initialRoll;

    // Apply all initial options to the element
    Object.assign(map3d, initialOptions);
  }, [map3d]); // Only run when map3d element first becomes available

  const isReady = !!maps3dLib && customElementReady;

  return [map3d, containerRef, map3dRef, cameraStateRef, isReady] as const;
}
