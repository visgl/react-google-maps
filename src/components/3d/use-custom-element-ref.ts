import {ForwardedRef, useCallback, useImperativeHandle, useState} from 'react';

export function useCustomElementRef<T>(
  ref: ForwardedRef<T | null>
): [T | null, (node: T | null) => void] {
  const [element, setElement] = useState<T | null>(null);

  const elementRef = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useImperativeHandle(ref, () => element as T, [element]);

  return [element, elementRef];
}
