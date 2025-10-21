import {useEffect, useRef} from 'react';

/**
 * A hook to store the previous value of a variable.
 * @param value The value to store
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  // eslint-disable-next-line react-hooks/refs
  return ref.current;
}
