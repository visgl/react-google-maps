import {waitFor} from '@testing-library/react';
import {mockInstances} from '@googlemaps/jest-mocks';

type Constructable = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): unknown;
};

/**
 * Uses `waitFor` to detect when a specified @googlemaps/jest-mocks object has
 * been created and returns the last item from the list of mock objects
 * for that type.
 * @param ctor
 */
export async function waitForMockInstance<T extends Constructable>(
  ctor: T
): Promise<InstanceType<T>> {
  await waitFor(() => expect(mockInstances.get(ctor)).not.toHaveLength(0));

  return mockInstances.get(ctor).at(-1)!;
}
