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
  const maps3dLib = useMapsLibrary('maps3d');
  const [customElementReady, setCustomElementReady] = useState(false);
  const [, containerRef] = useCallbackRef<HTMLDivElement>();
  const [map3d, map3dRef] = useCallbackRef<google.maps.maps3d.Map3DElement>();
  const cameraStateRef = useTrackedCameraStateRef3D(map3d);

  useEffect(() => {
    customElements.whenDefined('gmp-map-3d').then(() => {
      setCustomElementReady(true);
    });
  }, []);

  // Apply initial options once when the element is first available
  useEffect(
    () => {
      if (!map3d) return;

      const {
        center,
        heading,
        tilt,
        range,
        roll,
        defaultCenter,
        defaultHeading,
        defaultTilt,
        defaultRange,
        defaultRoll,
        // Non-element props to exclude
        id,
        style,
        className,
        children,
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
        mode,
        gestureHandling,
        ...elementOptions
      } = props;

      const initialCenter = center ?? defaultCenter;
      const initialHeading = heading ?? defaultHeading;
      const initialTilt = tilt ?? defaultTilt;
      const initialRange = range ?? defaultRange;
      const initialRoll = roll ?? defaultRoll;

      const initialOptions: Partial<google.maps.maps3d.Map3DElementOptions> = {
        ...elementOptions
      };

      if (initialCenter) initialOptions.center = initialCenter;
      if (initialHeading !== undefined) initialOptions.heading = initialHeading;
      if (initialTilt !== undefined) initialOptions.tilt = initialTilt;
      if (initialRange !== undefined) initialOptions.range = initialRange;
      if (initialRoll !== undefined) initialOptions.roll = initialRoll;

      Object.assign(map3d, initialOptions);
    },
    // this effect should only run when the map3d element first becomes
    // available, so we skip re-running it when other props change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map3d]
  );

  const isReady = !!maps3dLib && customElementReady;

  return [map3d, containerRef, map3dRef, cameraStateRef, isReady] as const;
}
