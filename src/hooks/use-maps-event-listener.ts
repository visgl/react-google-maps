/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect} from 'react';

/**
 * Internally used to bind events to Maps JavaScript API objects.
 * @internal
 */
export function useMapsEventListener<T extends (...args: any[]) => void>(
  target?: object | null,
  name?: string,
  callback?: T | null
) {
  useEffect(() => {
    if (!target || !name || !callback) return;

    const listener = google.maps.event.addListener(target, name, callback);

    return () => listener.remove();
  }, [target, name, callback]);
}
