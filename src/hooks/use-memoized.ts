import {useRef} from 'react';

export function useMemoized<T>(value: T, isEqual: (a: T, b: T) => boolean): T {
  const ref = useRef<T>(value);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
