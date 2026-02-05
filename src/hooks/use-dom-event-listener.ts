/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect} from 'react';
import {useEffectEvent} from './use-effect-event';

const noop = () => {};

/**
 * Internally used to bind events to DOM nodes.
 * @internal
 */
export function useDomEventListener<T extends (...args: any[]) => void>(
  target?: Node | null,
  name?: string,
  callback?: T | null
) {
  const eventFn = useEffectEvent(callback ?? noop);
  const isCallbackDefined = Boolean(callback);

  useEffect(() => {
    if (!target || !name || !isCallbackDefined) return;

    // Note: eventFn is not guaranteed to be stable across renders, so we need
    // to use a local variable to be sure to remove the very same listener
    // function that has been added
    const listenerCallback = eventFn;
    target.addEventListener(name, listenerCallback);

    return () => target.removeEventListener(name, listenerCallback);
  }, [target, name, isCallbackDefined]);
}
