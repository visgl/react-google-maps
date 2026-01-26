/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect} from 'react';

/**
 * Copies of two custom hooks the library uses
 * which are also being used here in the custom Places UI Kit components
 */

/**
 * Internally used to bind events to DOM nodes.
 * @internal
 */
export function useDomEventListener<T extends (...args: any[]) => void>(
  target?: Node | null,
  name?: string,
  callback?: T | null
) {
  useEffect(() => {
    if (!target || !name || !callback) return;

    target.addEventListener(name, callback);

    return () => target.removeEventListener(name, callback);
  }, [target, name, callback]);
}

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

    // eslint-disable-next-line react-hooks/immutability
    object[prop] = value;
  }, [object, prop, value]);
}
