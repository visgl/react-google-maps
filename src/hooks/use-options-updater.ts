import {useEffect} from 'react';
import {
  getChangedOptions,
  snapshotOptions
} from '../libraries/get-changed-options';

type OptionsInstance<TOptions extends object> = {
  setOptions(options: Partial<TOptions>): void;
};

/**
 * The options this hook believes are currently applied to each instance.
 *
 * Keyed weakly so a torn-down maps object is not kept alive by its entry, which
 * also means no cleanup is needed when an instance goes away.
 */
const trackedOptionsByInstance = new WeakMap<object, object>();

/**
 * Records the options an instance was just created with, so the first update
 * does not re-send them.
 *
 * Call this where the options are actually applied, which is the constructor
 * for an internally created instance and the explicit `setOptions` for an
 * externally supplied one. The hook cannot infer it: parent effects run after
 * child effects, so an option can change in the same commit that stores the
 * instance, and assuming it was applied would drop that change permanently.
 *
 * @internal
 */
export function markOptionsApplied<TOptions extends object>(
  instance: OptionsInstance<TOptions>,
  options: TOptions
): void {
  trackedOptionsByInstance.set(instance, snapshotOptions(options));
}

/**
 * Writes `options` to a maps API instance, sending only the values that changed
 * since the last update.
 *
 * `setOptions` is not a cheap setter: writing `editable` or `draggable` makes
 * the API rebuild the vertex and midpoint handles, so re-sending unchanged
 * values is noticeable on shapes with many vertices. Sending only the changed
 * subset is equivalent, since the API leaves unspecified options untouched.
 *
 * An instance with no recorded options is assumed to have none applied, so the
 * full set is written. Callers that already applied them should say so with
 * `markOptionsApplied`, which is what the geometry components do.
 *
 * @internal
 */
export function useOptionsUpdater<TOptions extends object>(
  instance: OptionsInstance<TOptions> | null,
  options: TOptions
): void {
  useEffect(() => {
    if (!instance) return;

    const trackedOptions = (trackedOptionsByInstance.get(instance) ??
      {}) as Partial<TOptions>;

    const changedOptions = getChangedOptions(options, trackedOptions);

    if (!changedOptions) return;

    instance.setOptions(changedOptions);
    trackedOptionsByInstance.set(instance, snapshotOptions(options));
  }, [instance, options]);
}
