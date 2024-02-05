import {Ref, useEffect, useState} from 'react';

import {MapProps} from '../map';
import {APIProviderContextValue} from '../api-provider';

import {useCallbackRef} from '../../libraries/use-callback-ref';
import {useApiIsLoaded} from '../../hooks/use-api-is-loaded';

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
): readonly [map: google.maps.Map | null, containerRef: Ref<HTMLDivElement>] {
  const apiIsLoaded = useApiIsLoaded();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [container, containerRef] = useCallbackRef<HTMLDivElement>();

  const {
    id,
    initialBounds,
    initialCameraProps,

    ...mapOptions
  } = props;

  // create the map instance and register it in the context
  useEffect(
    () => {
      if (!container || !apiIsLoaded) return;

      const {addMapInstance, removeMapInstance} = context;
      const newMap = new google.maps.Map(container, mapOptions);

      setMap(newMap);
      addMapInstance(newMap, id);

      if (initialBounds) {
        newMap.fitBounds(initialBounds);
      }

      if (initialCameraProps) {
        newMap.setOptions(initialCameraProps);
      }

      return () => {
        if (!container || !apiIsLoaded) return;

        // remove all event-listeners to minimize memory-leaks
        google.maps.event.clearInstanceListeners(newMap);

        setMap(null);
        removeMapInstance(id);
      };
    },

    // some dependencies are ignored in the list below:
    //  - initialBounds and initialCameraProps will only be used once, and
    //    changes should be ignored
    //  - mapOptions has special hooks that take care of updating the options
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [container, apiIsLoaded, id, props.mapId]
  );

  // report an error if the same map-id is used multiple times
  // useEffect(() => {
  //   if (!id) return;
  //
  //   const {mapInstances} = context;
  //
  //   if (mapInstances[id] && mapInstances[id] !== map) {
  //     logErrorOnce(
  //       `The map id '${id}' seems to have been used multiple times. ` +
  //         'This can lead to unexpected problems when accessing the maps. ' +
  //         'Please use unique ids for all <Map> components.'
  //     );
  //   }
  // }, [id, context, map]);

  return [map, containerRef] as const;
}
