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
 * Stores a stack of map-instances for each mapId. Whenever an
 * instance is used, it is removed from the stack while in use,
 * and returned to the stack when the component unmounts.
 * This allows us to correctly implement caching for multiple
 * maps om the same page, while reusing as much as possible.
 *
 * FIXME: while it should in theory be possible to reuse maps solely
 *   based on the mapId (as all other parameters can be changed at
 *   runtime), we don't yet have good enough tracking of options to
 *   reliably unset all the options that have been set.
 */
class CachedMapStack {
  static entries: {[key: string]: google.maps.Map[]} = {};

  static has(key: string) {
    return this.entries[key] && this.entries[key].length > 0;
  }

  static pop(key: string) {
    if (!this.entries[key]) return null;

    return this.entries[key].pop() || null;
  }

  static push(key: string, value: google.maps.Map) {
    if (!this.entries[key]) this.entries[key] = [];

    this.entries[key].push(value);
  }
}

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
    reuseMaps,
    renderingType,
    colorScheme,

    ...mapOptions
  } = props;

  const hasZoom = props.zoom !== undefined || props.defaultZoom !== undefined;
  const hasCenter =
    props.center !== undefined || props.defaultCenter !== undefined;

  if (!defaultBounds && (!hasZoom || !hasCenter)) {
    console.warn(
      '<Map> component is missing configuration. ' +
        'You have to provide zoom and center (via the `zoom`/`defaultZoom` and ' +
        '`center`/`defaultCenter` props) or specify the region to show using ' +
        '`defaultBounds`. See ' +
        'https://visgl.github.io/react-google-maps/docs/api-reference/components/map#required'
    );
  }

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
  }>(undefined);

  // create the map instance and register it in the context
  useEffect(
    () => {
      if (!container || !apiIsLoaded) return;

      const {addMapInstance, removeMapInstance} = context;

      // note: colorScheme (upcoming feature) isn't yet in the typings, remove once that is fixed:
      const {mapId} = props;
      const cacheKey = `${mapId || 'default'}:${renderingType || 'default'}:${colorScheme || 'LIGHT'}`;

      let mapDiv: HTMLElement;
      let map: google.maps.Map;

      if (reuseMaps && CachedMapStack.has(cacheKey)) {
        map = CachedMapStack.pop(cacheKey) as google.maps.Map;
        mapDiv = map.getDiv();

        container.appendChild(mapDiv);
        map.setOptions(mapOptions);

        // detaching the element from the DOM lets the map fall back to its default
        // size, setting the center will trigger reloading the map.
        setTimeout(() => map.setCenter(map.getCenter()!), 0);
      } else {
        mapDiv = document.createElement('div');
        mapDiv.style.height = '100%';
        container.appendChild(mapDiv);

        map = new google.maps.Map(mapDiv, {
          ...mapOptions,
          ...(renderingType
            ? {renderingType: renderingType as google.maps.RenderingType}
            : {}),
          ...(colorScheme
            ? {colorScheme: colorScheme as google.maps.ColorScheme}
            : {})
        });
      }

      setMap(map);
      addMapInstance(map, id);

      if (defaultBounds) {
        const {padding, ...defBounds} = defaultBounds;
        map.fitBounds(defBounds, padding);
      }

      // prevent map not rendering due to missing configuration
      else if (!hasZoom || !hasCenter) {
        map.fitBounds({east: 180, west: -180, south: -90, north: 90});
      }

      // the savedMapState is used to restore the camera parameters when the mapId is changed
      if (savedMapStateRef.current) {
        const {mapId: savedMapId, cameraState: savedCameraState} =
          savedMapStateRef.current;
        if (savedMapId !== mapId) {
          map.setOptions(savedCameraState);
        }
      }

      return () => {
        savedMapStateRef.current = {
          mapId,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          cameraState: cameraStateRef.current
        };

        // detach the map-div from the dom
        mapDiv.remove();

        if (reuseMaps) {
          // push back on the stack
          CachedMapStack.push(cacheKey, map);
        } else {
          // remove all event-listeners to minimize the possibility of memory-leaks
          google.maps.event.clearInstanceListeners(map);
        }

        setMap(null);
        removeMapInstance(id);
      };
    },

    // some dependencies are ignored in the list below:
    //  - defaultBounds and the default* camera props will only be used once, and
    //    changes should be ignored
    //  - mapOptions has special hooks that take care of updating the options
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      container,
      apiIsLoaded,
      id,

      // these props can't be changed after initialization and require a new
      // instance to be created
      props.mapId,
      props.renderingType,
      props.colorScheme
    ]
  );

  return [map, containerRef, cameraStateRef] as const;
}
