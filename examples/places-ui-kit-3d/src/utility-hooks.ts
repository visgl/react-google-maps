import {
  DependencyList,
  EffectCallback,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import isDeepEqual from 'fast-deep-equal';

export function useCallbackRef<T>() {
  const [el, setEl] = useState<T | null>(null);
  const ref = useCallback((value: T) => setEl(value), [setEl]);

  return [el, ref as Ref<T>] as const;
}

export function useDeepCompareEffect(
  effect: EffectCallback,
  deps: DependencyList
) {
  const ref = useRef<DependencyList | undefined>(undefined);

  if (!ref.current || !isDeepEqual(deps, ref.current)) {
    ref.current = deps;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, ref.current);
}

export function useDebouncedEffect(
  effect: EffectCallback,
  timeout: number,
  deps: DependencyList
) {
  const timerRef = useRef(0);

  useEffect(
    () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = 0;
      }

      timerRef.current = setTimeout(() => effect(), timeout);
      return () => clearTimeout(timerRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeout, ...deps]
  );
}
