import {waitFor} from '@testing-library/react';

/**
 * Waits for a specified spy/mock-function to be called and returns the
 * arguments passed to the last call.
 * @param spy
 */
export async function waitForSpy<T extends jest.Mock>(
  spy: T
): Promise<Parameters<T>> {
  await waitFor(() => expect(spy).toHaveBeenCalled());

  return spy.mock.lastCall;
}
