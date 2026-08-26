import {renderHook} from '@testing-library/react';

import {UNSET} from '../../libraries/get-changed-options';
import {useOptionsUpdater} from '../use-options-updater';

// every test needs its own instance: tracking is keyed per object and lives in
// a module-level WeakMap, so a shared instance would leak state between tests
const createInstance = () => ({setOptions: jest.fn()});

test('records the first options it sees without applying them', () => {
  const instance = createInstance();

  renderHook(() => {
    useOptionsUpdater(instance, {strokeColor: '#f00', editable: true});
  });

  // the caller already applied these, via the constructor or the creation effect
  expect(instance.setOptions).not.toHaveBeenCalled();
});

test('does not re-apply when the effect runs again with the same options', () => {
  const instance = createInstance();
  const options = {strokeColor: '#f00', editable: true};

  const {rerender} = renderHook(() => {
    useOptionsUpdater(instance, options);
  });

  rerender();
  rerender();

  expect(instance.setOptions).not.toHaveBeenCalled();
});

test('sends only the changed option on an update', () => {
  const instance = createInstance();

  const {rerender} = renderHook(
    ({fillOpacity}) => {
      useOptionsUpdater(instance, {
        strokeColor: '#f00',
        editable: true,
        fillOpacity
      });
    },
    {initialProps: {fillOpacity: 0.2}}
  );

  rerender({fillOpacity: 0.5});

  // `editable` is expensive to re-apply, so it must not be sent again
  expect(instance.setOptions).toHaveBeenCalledTimes(1);
  expect(instance.setOptions).toHaveBeenCalledWith({fillOpacity: 0.5});
});

test('unsets an option that is no longer present', () => {
  const instance = createInstance();

  const {rerender} = renderHook(
    ({options}) => {
      useOptionsUpdater(instance, options);
    },
    {initialProps: {options: {strokeColor: '#f00'} as Record<string, unknown>}}
  );

  rerender({options: {}});

  expect(instance.setOptions).toHaveBeenCalledTimes(1);

  const [sent] = instance.setOptions.mock.calls[0];
  expect(Object.keys(sent)).toEqual(['strokeColor']);
  expect(Object.values(sent)).toEqual([UNSET]);
});

test('does not unset the same option twice', () => {
  const instance = createInstance();

  const {rerender} = renderHook(
    ({options}) => {
      useOptionsUpdater(instance, options);
    },
    {initialProps: {options: {strokeColor: '#f00'} as Record<string, unknown>}}
  );

  rerender({options: {}});
  instance.setOptions.mockClear();
  rerender({options: {}});

  expect(instance.setOptions).not.toHaveBeenCalled();
});

test('tracks each instance separately', () => {
  const first = createInstance();
  const second = createInstance();

  const {rerender} = renderHook(
    ({instance}) => {
      useOptionsUpdater(instance, {strokeColor: '#f00'});
    },
    {initialProps: {instance: first}}
  );

  rerender({instance: second});

  // the replacement is seen for the first time, so its options are recorded
  // rather than applied: its caller already applied them
  expect(second.setOptions).not.toHaveBeenCalled();
});

test('does nothing while the instance is null', () => {
  const instance = createInstance();

  const {rerender} = renderHook(
    ({current}: {current: typeof instance | null}) => {
      useOptionsUpdater(current, {strokeColor: '#f00'});
    },
    {initialProps: {current: null as typeof instance | null}}
  );

  rerender({current: instance});

  expect(instance.setOptions).not.toHaveBeenCalled();
});
