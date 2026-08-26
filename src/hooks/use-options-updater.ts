import {useEffect} from 'react';
import {
  applyOptionsUpdate,
  getChangedOptions
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
 * Writes `options` to a maps API instance, sending only the values that changed
 * since the last update.
 *
 * `setOptions` is not a cheap setter: writing `editable` or `draggable` makes
 * the API rebuild the vertex and midpoint handles, so re-sending unchanged
 * values is noticeable on shapes with many vertices. Sending only the changed
 * subset is equivalent, since the API leaves unspecified options untouched.
 *
 * Callers must apply the initial options before the instance reaches this hook.
 * The geometry components already do: internally created instances receive them
 * through the constructor, and externally supplied ones are written to in the
 * creation effect before the instance is stored. The first time an instance is
 * seen its options are therefore recorded without being applied again.
 *
 * @internal
 */
export function useOptionsUpdater<TOptions extends object>(
  instance: OptionsInstance<TOptions> | null,
  options: TOptions
): void {
  useEffect(() => {
    if (!instance) return;

    const trackedOptions = trackedOptionsByInstance.get(instance) as
      Partial<TOptions> | undefined;

    // first time we see this instance: the caller already applied these
    if (!trackedOptions) {
      trackedOptionsByInstance.set(instance, {...options});

      return;
    }

    const changedOptions = getChangedOptions(options, trackedOptions);

    if (!changedOptions) return;

    instance.setOptions(changedOptions);
    trackedOptionsByInstance.set(
      instance,
      applyOptionsUpdate(trackedOptions, options)
    );
  }, [instance, options]);
}
