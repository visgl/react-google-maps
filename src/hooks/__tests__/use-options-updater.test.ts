import {renderHook} from '@testing-library/react';

import {UNSET} from '../../libraries/get-changed-options';
import {markOptionsApplied, useOptionsUpdater} from '../use-options-updater';

// every test needs its own instance: tracking is keyed per object and lives in
// a module-level WeakMap, so a shared instance would leak state between tests
const createInstance = () => ({setOptions: jest.fn()});

test('applies everything when nothing is known to have been applied', () => {
  const instance = createInstance();

  renderHook(() => {
    useOptionsUpdater(instance, {strokeColor: '#f00', editable: true});
  });

  // failing safe: a caller that did not record a baseline gets the full set
  // rather than silently losing options
  expect(instance.setOptions).toHaveBeenCalledWith({
    strokeColor: '#f00',
    editable: true
  });
});

test('does not re-apply options recorded as already applied', () => {
  const instance = createInstance();

  markOptionsApplied(instance, {strokeColor: '#f00', editable: true});

  renderHook(() => {
    useOptionsUpdater(instance, {strokeColor: '#f00', editable: true});
  });

  expect(instance.setOptions).not.toHaveBeenCalled();
});

test('applies an option that changed after it was recorded', () => {
  const instance = createInstance();

  // the constructor got the old value, and the props changed in the commit that
  // stored the instance. assuming the new value was applied would drop it
  markOptionsApplied(instance, {strokeColor: '#f00', editable: true});

  renderHook(() => {
    useOptionsUpdater(instance, {strokeColor: '#0f0', editable: true});
  });

  expect(instance.setOptions).toHaveBeenCalledTimes(1);

  const [sent] = instance.setOptions.mock.calls[0];
  expect(Object.keys(sent)).toEqual(['strokeColor']);
  expect(sent.strokeColor).toBe('#0f0');
});

test('does not re-apply when the effect re-runs with an equal options object', () => {
  const instance = createInstance();

  markOptionsApplied(instance, {strokeColor: '#f00', editable: true});

  // a fresh object each render, so the effect deps change and the body really
  // runs. this is the StrictMode-safety case
  const {rerender} = renderHook(
    ({color}) => {
      useOptionsUpdater(instance, {strokeColor: color, editable: true});
    },
    {initialProps: {color: '#f00'}}
  );

  rerender({color: '#f00'});
  rerender({color: '#f00'});

  expect(instance.setOptions).not.toHaveBeenCalled();
});

test('sends only the changed option on an update', () => {
  const instance = createInstance();

  markOptionsApplied(instance, {
    strokeColor: '#f00',
    editable: true,
    fillOpacity: 0.2
  });

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

  // `editable` is expensive to re-apply, so it must not be sent again. assert
  // the keys, since toHaveBeenCalledWith ignores undefined-valued ones and
  // would accept `{fillOpacity: 0.5, editable: undefined}`
  expect(instance.setOptions).toHaveBeenCalledTimes(1);

  const [sent] = instance.setOptions.mock.calls[0];
  expect(Object.keys(sent)).toEqual(['fillOpacity']);
  expect(sent.fillOpacity).toBe(0.5);
});

test('unsets an option that is no longer present', () => {
  const instance = createInstance();

  markOptionsApplied(instance, {strokeColor: '#f00'});

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

  markOptionsApplied(instance, {strokeColor: '#f00'});

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

  // the replacement has no recorded baseline, so it gets the full set
  expect(second.setOptions).toHaveBeenCalledWith({strokeColor: '#f00'});
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

  // the null render did nothing; the instance arriving is what triggers the
  // first write, and it must not be skipped
  expect(instance.setOptions).toHaveBeenCalledWith({strokeColor: '#f00'});
});
