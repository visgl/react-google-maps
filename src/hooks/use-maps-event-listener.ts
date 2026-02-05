/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect} from 'react';
import {useEffectEvent} from './use-effect-event';

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
  const eventFn = useEffectEvent(callback ?? noop);
  const isCallbackDefined = Boolean(callback);

  useEffect(() => {
    if (!target || !isCallbackDefined) return;

    const listener = google.maps.event.addListener(target, name, eventFn);

    return () => listener.remove();
  }, [target, name, isCallbackDefined]);
}
