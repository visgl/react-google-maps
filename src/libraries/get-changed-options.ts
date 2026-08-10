import {deepEqual as isDeepEqual} from 'fast-equals';

/**
 * Returns the subset of `nextOptions` that differs from `prevOptions`, or
 * `null` when nothing changed. Without `prevOptions`, everything is returned.
 *
 * The result is always a fresh object. Callers pass their memoized options in
 * here and hand the result to the maps API, which must not end up holding a
 * reference to the value the memoization compares against.
 *
 * Keys missing from `nextOptions` are not reported as changes: the maps API
 * leaves unspecified options untouched, so dropping a prop has never reset the
 * corresponding option on the instance.
 *
 * @internal
 */
export function getChangedOptions<T extends object>(
  nextOptions: T,
  prevOptions: T | null
): Partial<T> | null {
  if (!prevOptions) {
    return Object.keys(nextOptions).length > 0 ? {...nextOptions} : null;
  }

  let changedOptions: Partial<T> | null = null;

  for (const key of Object.keys(nextOptions) as Array<keyof T>) {
    // a key that was not part of the previous options was never applied, so it
    // counts as changed even when both values read as undefined. without this,
    // explicitly resetting a prop to undefined after omitting it entirely
    // would be silently dropped.
    if (key in prevOptions && isDeepEqual(nextOptions[key], prevOptions[key]))
      continue;

    changedOptions ??= {};
    changedOptions[key] = nextOptions[key];
  }

  return changedOptions;
}
