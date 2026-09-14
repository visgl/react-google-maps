import {getChangedOptions, snapshotOptions} from './get-changed-options';

type MapObject<TOptions extends object> = {
  setOptions(options: Partial<TOptions>): void;
};

/**
 * The options believed to be applied to each object, keyed weakly so a
 * torn-down maps object is not kept alive and no cleanup is needed.
 */
const appliedOptionsByObject = new WeakMap<object, object>();

/**
 * A drop-in replacement for `object.setOptions(options)` that writes only the
 * values that changed since the last call.
 *
 * `setOptions` is not a cheap setter. It applies every key it is given without
 * comparing against the current value, and on an editable shape each stroke or
 * fill key costs a redraw of the vertex handles, so re-sending an unchanged
 * option bag is measurably expensive on shapes with many vertices. Sending only
 * the changed subset is equivalent, since the API leaves unspecified options
 * untouched.
 *
 * Pass `alreadyApplied` when the object was just created with these options, so
 * they are recorded without being written a second time. The caller has to say
 * so: parent effects run after child effects, so an option can change in the
 * same commit that creates the object, and inferring that the current options
 * were applied would drop that change permanently.
 *
 * An object with nothing recorded is treated as having no options applied and
 * receives the full set, so a forgotten `alreadyApplied` costs a redundant
 * write rather than a missing one.
 *
 * @internal
 */
export function setMapObjectOptions<TOptions extends object>(
  object: MapObject<TOptions>,
  options: TOptions,
  {alreadyApplied = false}: {alreadyApplied?: boolean} = {}
): void {
  if (alreadyApplied) {
    appliedOptionsByObject.set(object, snapshotOptions(options));

    return;
  }

  const appliedOptions = (appliedOptionsByObject.get(object) ??
    {}) as Partial<TOptions>;

  const changedOptions = getChangedOptions(options, appliedOptions);

  if (!changedOptions) return;

  object.setOptions(changedOptions);
  appliedOptionsByObject.set(object, snapshotOptions(options));
}
