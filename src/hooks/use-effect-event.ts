// Copyright (c) 2025 Sanity
// This file is derived from sanity-io/use-effect-event (MIT Licensed)
//
// https://github.com/sanity-io/use-effect-event

import * as React from 'react';

const {useLayoutEffect, useRef} = React;

// useInsertionEffect was added in React 18; fall back to useLayoutEffect for
// React 16/17. Both run before useEffect, so ref.current is always up-to-date
// by the time any passive effect (or real event) reads it.
const useBeforeEffect = React.useInsertionEffect ?? useLayoutEffect;

function forbiddenInRender() {
  throw new Error('useEffectEvent: invalid call during rendering.');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useEffectEventPolyfill<const T extends (...args: any[]) => void>(
  fn: T
): T {
  /**
   * Initialize the ref with `forbiddenInRender`, to catch illegal calls during
   * rendering. After the insertion effect ran, the ref will contain the actual
   * function, so all effects can see the actual value.
   */
  const ref = useRef(forbiddenInRender as T);

  useBeforeEffect(() => {
    ref.current = fn;
  }, [fn]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((...args: any[]) => ref.current(...args)) as T;
}

/**
 * Uses a polyfill implementation of `useEffectEvent`. The native useEffectEvent
 * implementation was causing issues that we do not fully understand yet.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEffectEvent: <const T extends (...args: any[]) => void>(
  fn: T
) => T = useEffectEventPolyfill;
