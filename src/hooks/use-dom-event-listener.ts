/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect} from 'react';
import {useEffectEvent} from './useEffectEvent';

const noop = () => {};

/**
 * Internally used to bind events to DOM nodes.
 * @internal
 */
export function useDomEventListener<T extends (...args: any[]) => void>(
  target: Node | null | undefined,
  name: string,
  callback: T | null | undefined
) {
  const callbackEvent = useEffectEvent(callback ?? noop);
  const isCallbackDefined = !!callback;
  useEffect(() => {
    if (!target || !isCallbackDefined) return;

    // According to react 19 useEffectEvent and our ponyfill, the callback returned by useEffectEvent is NOT stable
    // Thus, we need to create a stable listener callback that we can then use to removeEventListener with.
    const listenerCallback: EventListener = (...args) => callbackEvent(...args);

    target.addEventListener(name, listenerCallback);

    return () => target.removeEventListener(name, listenerCallback);
  }, [target, name, isCallbackDefined]);
}
