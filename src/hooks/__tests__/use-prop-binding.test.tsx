import {renderHook} from '@testing-library/react';

import {usePropBinding} from '../use-prop-binding';

type Target = {foo?: string | null};

describe('usePropBinding', () => {
  test('does not write a prop the consumer never provided', () => {
    const target: Target = {};

    renderHook(() => usePropBinding(target, 'foo', undefined));

    expect(Object.getOwnPropertyDescriptor(target, 'foo')).toBeUndefined();
  });

  test('writes provided values, including null', () => {
    const target: Target = {};

    const {rerender} = renderHook(
      ({value}: {value: string | null | undefined}) =>
        usePropBinding(target, 'foo', value),
      {initialProps: {value: 'a' as string | null | undefined}}
    );
    expect(target.foo).toBe('a');

    rerender({value: null});
    expect(target.foo).toBeNull();
  });

  test('clears a prop that was written before and is removed later', () => {
    const target: Target = {};

    const {rerender} = renderHook(
      ({value}: {value: string | undefined}) =>
        usePropBinding(target, 'foo', value),
      {initialProps: {value: 'a' as string | undefined}}
    );
    expect(target.foo).toBe('a');

    rerender({value: undefined});
    expect(Object.getOwnPropertyDescriptor(target, 'foo')).toBeDefined();
    expect(target.foo).toBeUndefined();
  });

  test('a new object starts untouched even after a previous one was written', () => {
    const first: Target = {};
    const second: Target = {};

    const {rerender} = renderHook(
      ({object, value}: {object: Target; value: string | undefined}) =>
        usePropBinding(object, 'foo', value),
      {initialProps: {object: first, value: 'a' as string | undefined}}
    );
    expect(first.foo).toBe('a');

    rerender({object: second, value: undefined});
    expect(Object.getOwnPropertyDescriptor(second, 'foo')).toBeUndefined();
  });
});
