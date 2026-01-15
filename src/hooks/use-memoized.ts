import {useMemo} from 'react';
import {usePrevious} from './use-previous';

export function useMemoized<T>(value: T, isEqual: (a: T, b: T) => boolean): T {
  const previous = usePrevious(value);
  return useMemo(() => {
    if (previous && isEqual(previous, value)) {
      return previous;
    }
    return value;
  }, [value, previous, isEqual]);
}
