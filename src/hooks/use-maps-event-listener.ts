/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect} from 'react';
import {useEffectEvent} from './useEffectEvent';

const noop = () => {};

/**
 * Internally used to bind events to Maps JavaScript API objects.
 * @internal
 */
export function useMapsEventListener<T extends (...args: any[]) => void>(
  target: object | null,
  name: string,
  callback: T | null | undefined
) {
  const callbackEvent = useEffectEvent(callback ?? noop);
  const isCallbackDefined = !!callback;
  useEffect(() => {
    if (!target || !isCallbackDefined) return;

    // According to react 19 useEffectEvent and our ponyfill, the callback returned by useEffectEvent is NOT stable
    // Thus, it's best to create a stable listener callback to add to the event listener.
    const listenerCallback = (...args: any[]) => callbackEvent(...args);
    const listener = google.maps.event.addListener(
      target,
      name,
      listenerCallback
    );

    return () => listener.remove();
  }, [target, name, isCallbackDefined]);
}
