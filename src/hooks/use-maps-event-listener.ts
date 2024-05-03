import {useEffect} from 'react';

/**
 * Internally used to bind events to google maps API objects.
 * @internal
 */
export function useMapsEventListener(
  target?: google.maps.MVCObject | null,
  name?: string,
  callback?: ((arg?: unknown) => void) | null
) {
  useEffect(() => {
    if (!target || !name || !callback) return;

    const listener = google.maps.event.addListener(target, name, callback);

    return () => listener?.remove();
  }, [target, name, callback]);
}
