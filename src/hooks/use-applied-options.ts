import {useEffect, useRef} from 'react';
import {getChangedOptions} from '../libraries/get-changed-options';

import type {RefObject} from 'react';

export type AppliedOptions<TOptions extends object> = {
  instance: {setOptions(options: Partial<TOptions>): void};
  options: TOptions;
};

/**
 * Applies `options` to a maps API instance, sending only the values that
 * actually changed since the last call.
 *
 * `setOptions` is not a cheap setter: writing `editable` or `draggable` makes
 * the API rebuild the vertex and midpoint handles, so re-sending unchanged
 * values on every update is noticeable on shapes with many vertices. Passing
 * only the changed subset is equivalent, since the API leaves options that are
 * not specified untouched.
 *
 * This tracks what it has written rather than reading the instance back, so it
 * assumes nothing else writes these options on the same instance. A value set
 * from outside is not restored on the next update.
 *
 * `appliedOnCreateRef` lets the caller declare the options an instance was
 * already constructed with, so they are not written a second time on mount.
 *
 * @internal
 */
export function useAppliedOptions<TOptions extends object>(
  instance: {setOptions(options: Partial<TOptions>): void} | null,
  options: TOptions,
  appliedOnCreateRef?: RefObject<AppliedOptions<TOptions> | null>
): void {
  const prevRef = useRef<AppliedOptions<TOptions> | null>(null);

  useEffect(() => {
    if (!instance) {
      // don't hold on to an instance that has already been torn down
      prevRef.current = null;

      return;
    }

    // previously applied values only count when they were written to this very
    // instance, either by an earlier run or by whoever created it
    let prevOptions: TOptions | null = null;

    if (prevRef.current?.instance === instance) {
      prevOptions = prevRef.current.options;
    } else if (appliedOnCreateRef?.current?.instance === instance) {
      prevOptions = appliedOnCreateRef.current.options;
    }

    const changedOptions = getChangedOptions(options, prevOptions);

    if (changedOptions) instance.setOptions(changedOptions);

    prevRef.current = {instance, options};
  }, [instance, options, appliedOnCreateRef]);
}
