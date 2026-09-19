/* eslint-disable react-hooks/immutability -- Google Maps API objects are designed to be mutated */
import {useEffect, useRef} from 'react';

import type {GmpWritableElementProp} from '../../types/writable';

/**
 * Internally used to copy values from props into API-Objects
 * whenever they change.
 *
 * A prop the consumer never provided is not written at all. Assigning
 * `undefined` would clobber the default the Maps API set up on the object
 * (see #867) and, for deprecated or channel-gated properties, log a warning
 * the consumer did not cause. Once a value has been written to an object,
 * a later `undefined` still clears it.
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
  const writtenTo = useRef<T | null>(null);

  useEffect(() => {
    if (!object) return;
    if (value === undefined && writtenTo.current !== object) return;

    writtenTo.current = object;

    // We use any here because GmpWritableElementProp<T[K]> is a broader type than T[K]
    // and can't be assigned directly without this cast.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (object as any)[prop] = value;
  }, [object, prop, value]);
}
