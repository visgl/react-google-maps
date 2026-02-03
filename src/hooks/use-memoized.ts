/* eslint-disable react-hooks/refs */
// refs should not be used in render because changes to refs won't
// trigger a re-render, making them unreliable for holding state.
// In this case though, that is exactly what we want.

import {useRef} from 'react';

export function useMemoized<T>(value: T, isEqual: (a: T, b: T) => boolean): T {
  const ref = useRef<T>(value);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
