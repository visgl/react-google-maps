import {deepEqual as isDeepEqual} from 'fast-equals';

/**
 * The value written to unset an option that is no longer present.
 *
 * Every property of the maps API option types is declared as `T | null`, so
 * `null` is the value the API sanctions for "back to the default". `undefined`
 * only appears via the optional marker and has no documented meaning.
 *
 * @internal
 */
export const UNSET = null;

/**
 * Returns the options that have to be written to bring an instance from
 * `trackedOptions` to `nextOptions`, or `null` when nothing changed.
 *
 * `trackedOptions` is what the caller believes is currently applied to the
 * instance, not the previous render's props. That distinction is what makes
 * removal work: a key that was applied earlier and is missing from
 * `nextOptions` is explicitly unset rather than silently left behind.
 *
 * The result is always a fresh object, so the caller's tracked state is never
 * handed on to the maps API.
 *
 * @internal
 */
export function getChangedOptions<T extends object>(
  nextOptions: T,
  trackedOptions: Partial<T>
): Partial<T> | null {
  let changedOptions: Partial<T> | null = null;

  const keys = new Set<keyof T>([
    ...(Object.keys(trackedOptions) as Array<keyof T>),
    ...(Object.keys(nextOptions) as Array<keyof T>)
  ]);

  for (const key of keys) {
    // a key that disappeared has to be written back to the default, and a key
    // that is present counts as changed even when both values read as
    // undefined, since it may never have been applied
    if (!(key in nextOptions)) {
      changedOptions ??= {};
      // null is not assignable to an unconstrained T[keyof T]; see UNSET above
      changedOptions[key] = UNSET as unknown as T[keyof T];
      continue;
    }

    if (
      key in trackedOptions &&
      isDeepEqual(trackedOptions[key], nextOptions[key])
    )
      continue;

    changedOptions ??= {};
    changedOptions[key] = nextOptions[key];
  }

  return changedOptions;
}

/**
 * Folds `nextOptions` into the tracked state, dropping keys that are no longer
 * present so the next diff does not try to unset them twice.
 *
 * @internal
 */
export function applyOptionsUpdate<T extends object>(
  trackedOptions: Partial<T>,
  nextOptions: T
): Partial<T> {
  const updatedOptions: Partial<T> = {...trackedOptions};

  for (const key of Object.keys(trackedOptions) as Array<keyof T>) {
    if (!(key in nextOptions)) delete updatedOptions[key];
  }

  for (const key of Object.keys(nextOptions) as Array<keyof T>) {
    updatedOptions[key] = nextOptions[key];
  }

  return updatedOptions;
}
