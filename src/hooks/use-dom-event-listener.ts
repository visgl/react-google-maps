/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect} from 'react';

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
