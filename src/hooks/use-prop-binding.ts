import {useEffect} from 'react';

/**
 * Internally used to copy values from props into API-Objects
 * whenever they change.
 *
 * @example
 *   usePropBinding(marker, 'position', position);
 *
 * @internal
 */
export function usePropBinding<T extends object, K extends keyof T>(
  object: T | null,
  prop: K,
  value: T[K]
) {
  useEffect(() => {
    if (!object) return;

    object[prop] = value;
  }, [object, prop, value]);
}
