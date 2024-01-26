import {DependencyList, EffectCallback, useEffect, useRef} from 'react';
import isDeepEqual from 'fast-deep-equal/react';

export function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList
) {
  const ref = useRef<DependencyList | undefined>(undefined);

  if (!ref.current || !isDeepEqual(deps, ref.current)) {
    ref.current = deps;
  }

  useEffect(effect, ref.current);
}
