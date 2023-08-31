import {waitFor} from '@testing-library/react';

/**
 * Waits for a specified spy/mock-function to be called and returns the
 * arguments passed to the last call.
 * @param spy
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function waitForSpy<T extends (...args: any[]) => any>(
  spy:
    | jest.Mock<ReturnType<T>, Parameters<T>>
    | jest.SpyInstance<ReturnType<T>, Parameters<T>>
): Promise<Parameters<T> | undefined> {
  await waitFor(() => expect(spy).toHaveBeenCalled());

  return spy.mock.lastCall;
}
