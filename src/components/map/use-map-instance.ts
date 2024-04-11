import {Ref, useEffect, useRef, useState} from 'react';

import {MapProps} from '../map';
import {APIProviderContextValue} from '../api-provider';

import {useCallbackRef} from '../../libraries/use-callback-ref';
import {useApiIsLoaded} from '../../hooks/use-api-is-loaded';
import {
  CameraState,
  CameraStateRef,
  useTrackedCameraStateRef
} from './use-tracked-camera-state-ref';

/**
 * The main hook takes care of creating map-instances and registering them in
 * the api-provider context.
 * @return a tuple of the map-instance created (or null) and the callback
 *   ref that will be used to pass the map-container into this hook.
 * @internal
 */
export function useMapInstance(
  props: MapProps,
  context: APIProviderContextValue
): readonly [
  map: google.maps.Map | null,
  containerRef: Ref<HTMLDivElement>,
  cameraStateRef: CameraStateRef
] {
  const apiIsLoaded = useApiIsLoaded();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [container, containerRef] = useCallbackRef<HTMLDivElement>();

  const cameraStateRef = useTrackedCameraStateRef(map);

  const {
    id,
    defaultBounds,
    defaultCenter,
    defaultZoom,
    defaultHeading,
    defaultTilt,

    ...mapOptions
  } = props;

  // apply default camera props if available and not overwritten by controlled props
  if (!mapOptions.center && defaultCenter) mapOptions.center = defaultCenter;
  if (!mapOptions.zoom && Number.isFinite(defaultZoom))
    mapOptions.zoom = defaultZoom;
  if (!mapOptions.heading && Number.isFinite(defaultHeading))
    mapOptions.heading = defaultHeading;
  if (!mapOptions.tilt && Number.isFinite(defaultTilt))
    mapOptions.tilt = defaultTilt;

  for (const key of Object.keys(mapOptions) as (keyof typeof mapOptions)[])
    if (mapOptions[key] === undefined) delete mapOptions[key];

  const savedMapStateRef = useRef<{
    mapId?: string | null;
    cameraState: CameraState;
  }>();

  // create the map instance and register it in the context
  useEffect(
    () => {
      if (!container || !apiIsLoaded) return;

      const {addMapInstance, removeMapInstance} = context;
      const mapId = props.mapId;
      const newMap = new google.maps.Map(container, mapOptions);

      setMap(newMap);
      addMapInstance(newMap, id);

      if (defaultBounds) {
        newMap.fitBounds(defaultBounds);
      }

      // the savedMapState is used to restore the camera parameters when the mapId is changed
      if (savedMapStateRef.current) {
        const {mapId: savedMapId, cameraState: savedCameraState} =
          savedMapStateRef.current;
        if (savedMapId !== mapId) {
          newMap.setOptions(savedCameraState);
        }
      }

      return () => {
        savedMapStateRef.current = {
          mapId,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          cameraState: cameraStateRef.current
        };

        // remove all event-listeners to minimize memory-leaks
        google.maps.event.clearInstanceListeners(newMap);

        setMap(null);
        removeMapInstance(id);
      };
    },

    // some dependencies are ignored in the list below:
    //  - defaultBounds and the default* camera props will only be used once, and
    //    changes should be ignored
    //  - mapOptions has special hooks that take care of updating the options
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [container, apiIsLoaded, id, props.mapId]
  );

  return [map, containerRef, cameraStateRef] as const;
}
