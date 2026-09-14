// Copyright (c) 2025 Sanity
// This file is derived from sanity-io/use-effect-event (MIT Licensed)
//
// https://github.com/sanity-io/use-effect-event

import * as React from 'react';
import {useRef} from 'react';

/**
 * A clone of the React namespace for reading APIs that may be missing in older
 * supported React versions. Bundlers can rewrite direct React.someNewApi reads
 * into named imports, which breaks React 17. Reading from this cloned object
 * keeps those lookups optional.
 *
 * @see https://github.com/mui/material-ui/issues/41190#issuecomment-2040873379
 */
const SafeReact = {...React} as typeof React;

const useInsertionEffect = SafeReact.useInsertionEffect;
const useSafeInsertionEffect: (
  effect: React.EffectCallback,
  deps?: React.DependencyList
) => void =
  // React 17 doesn't have useInsertionEffect.
  useInsertionEffect &&
  // Preact replaces useInsertionEffect with useLayoutEffect and fires too late.
  useInsertionEffect !== SafeReact.useLayoutEffect
    ? useInsertionEffect
    : (fn: React.EffectCallback) => {
        fn();
      };

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

  useSafeInsertionEffect(() => {
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
