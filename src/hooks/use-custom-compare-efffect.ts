import {DependencyList, EffectCallback, useEffect} from 'react';
import {useMemoized} from './use-memoized';

export function useCustomCompareEffect<T extends DependencyList>(
  effect: EffectCallback,
  dependencies: T,
  isEqual: (a: T, b: T) => boolean
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [useMemoized(dependencies, isEqual)]);
}
