// Copyright (c) 2025 Sanity
// This file is derived from sanity-io/use-effect-event (Licensed under the MIT License)
//
// https://github.com/sanity-io/use-effect-event

import {useRef, useInsertionEffect} from 'react';

function forbiddenInRender() {
  throw new Error(
    "A function wrapped in useEffectEvent can't be called during rendering."
  );
}

/**
 * This is a ponyfill of the upcoming `useEffectEvent` hook that'll arrive in React 19.
 * https://19.react.dev/learn/separating-events-from-effects#declaring-an-effect-event
 * To learn more about the ponyfill itself, see: https://blog.bitsrc.io/a-look-inside-the-useevent-polyfill-from-the-new-react-docs-d1c4739e8072
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEffectEvent<const T extends (...args: any[]) => void>(
  fn: T
): T {
  /**
   * For both React 18 and 19 we set the ref to the forbiddenInRender function, to catch illegal calls to the function during render.
   * Once the insertion effect runs, we set the ref to the actual function.
   */
  const ref = useRef(forbiddenInRender as T);

  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((...args: any[]) => {
    return ref.current(...args);
  }) as T;
}
