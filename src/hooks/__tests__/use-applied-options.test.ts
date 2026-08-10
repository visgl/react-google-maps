import {renderHook} from '@testing-library/react';

import {useAppliedOptions} from '../use-applied-options';

test('applies all options on the first run', () => {
  const instance = {setOptions: jest.fn()};

  renderHook(() => {
    useAppliedOptions(instance, {strokeColor: '#f00', editable: true});
  });

  expect(instance.setOptions).toHaveBeenCalledTimes(1);
  expect(instance.setOptions).toHaveBeenCalledWith({
    strokeColor: '#f00',
    editable: true
  });
});

test('sends only the changed option on an update', () => {
  const instance = {setOptions: jest.fn()};

  const {rerender} = renderHook(
    ({fillOpacity}) => {
      useAppliedOptions(instance, {
        strokeColor: '#f00',
        editable: true,
        fillOpacity
      });
    },
    {initialProps: {fillOpacity: 0.2}}
  );

  instance.setOptions.mockClear();

  rerender({fillOpacity: 0.5});

  // `editable` is expensive to re-apply, so it must not be sent again
  expect(instance.setOptions).toHaveBeenCalledTimes(1);
  expect(instance.setOptions).toHaveBeenCalledWith({fillOpacity: 0.5});
});

test('skips the effect entirely when the options reference is unchanged', () => {
  const instance = {setOptions: jest.fn()};
  // callers memoize their options, which is what keeps the comparison off the
  // render path
  const options = {strokeColor: '#f00', editable: true};

  const {rerender} = renderHook(() => {
    useAppliedOptions(instance, options);
  });

  instance.setOptions.mockClear();

  rerender();
  rerender();

  expect(instance.setOptions).not.toHaveBeenCalled();
});

test('does not hand the caller its own options object', () => {
  const instance = {setOptions: jest.fn()};
  const options = {strokeColor: '#f00'};

  renderHook(() => {
    useAppliedOptions(instance, options);
  });

  expect(instance.setOptions).toHaveBeenCalledWith({strokeColor: '#f00'});
  expect(instance.setOptions.mock.calls[0][0]).not.toBe(options);
});

test('does not touch the instance when nothing changed', () => {
  const instance = {setOptions: jest.fn()};

  const {rerender} = renderHook(
    ({fillOpacity}) => {
      useAppliedOptions(instance, {fillOpacity});
    },
    {initialProps: {fillOpacity: 0.2}}
  );

  instance.setOptions.mockClear();

  rerender({fillOpacity: 0.2});

  expect(instance.setOptions).not.toHaveBeenCalled();
});

test('applies all options again when the instance is replaced', () => {
  const first = {setOptions: jest.fn()};
  const second = {setOptions: jest.fn()};

  const {rerender} = renderHook(
    ({instance}) => {
      useAppliedOptions(instance, {strokeColor: '#f00', editable: true});
    },
    {initialProps: {instance: first}}
  );

  rerender({instance: second});

  // the replacement starts out without any of the options applied
  expect(second.setOptions).toHaveBeenCalledTimes(1);
  expect(second.setOptions).toHaveBeenCalledWith({
    strokeColor: '#f00',
    editable: true
  });
});

test('applies the latest options once an instance becomes available', () => {
  type Instance = {setOptions: jest.Mock} | null;

  const instance = {setOptions: jest.fn()};

  const {rerender} = renderHook(
    ({current, fillOpacity}: {current: Instance; fillOpacity: number}) => {
      useAppliedOptions(current, {fillOpacity});
    },
    {initialProps: {current: null as Instance, fillOpacity: 0.2}}
  );

  // options that changed while there was no instance must not be lost
  rerender({current: null as Instance, fillOpacity: 0.5});
  rerender({current: instance, fillOpacity: 0.5});

  expect(instance.setOptions).toHaveBeenCalledTimes(1);
  expect(instance.setOptions).toHaveBeenCalledWith({fillOpacity: 0.5});
});

test('re-applies everything when the same instance comes back after a gap', () => {
  type Instance = {setOptions: jest.Mock} | null;

  const instance = {setOptions: jest.fn()};

  const {rerender} = renderHook(
    ({current}: {current: Instance}) => {
      useAppliedOptions(current, {strokeColor: '#f00'});
    },
    {initialProps: {current: instance as Instance}}
  );

  instance.setOptions.mockClear();

  // the instance was torn down and handed back, so it no longer carries the
  // options that were applied before
  rerender({current: null as Instance});
  rerender({current: instance as Instance});

  expect(instance.setOptions).toHaveBeenCalledTimes(1);
  expect(instance.setOptions).toHaveBeenCalledWith({strokeColor: '#f00'});
});
