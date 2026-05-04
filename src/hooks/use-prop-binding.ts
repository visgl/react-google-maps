/* eslint-disable react-hooks/immutability -- Google Maps API objects are designed to be mutated */
import {useEffect} from 'react';

import type {GmpWritableElementProp} from '../../types/writable';

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
  value: GmpWritableElementProp<T[K]>
) {
  useEffect(() => {
    if (!object) return;

    // We use any here because GmpWritableElementProp<T[K]> is a broader type than T[K]
    // and can't be assigned directly without this cast.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (object as any)[prop] = value;
  }, [object, prop, value]);
}
