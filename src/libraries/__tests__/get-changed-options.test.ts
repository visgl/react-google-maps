import {
  getChangedOptions,
  snapshotOptions,
  UNSET
} from '../get-changed-options';

describe('getChangedOptions', () => {
  test('returns everything when nothing has been applied yet', () => {
    const options = {strokeColor: '#f00', editable: true};
    const changed = getChangedOptions(options, {});

    expect(changed).toEqual(options);
    // the tracked object must not be handed on to the maps api
    expect(changed).not.toBe(options);
  });

  test('returns null when nothing changed', () => {
    expect(
      getChangedOptions(
        {strokeColor: '#f00', editable: true},
        {strokeColor: '#f00', editable: true}
      )
    ).toBeNull();
  });

  test('returns only the values that changed', () => {
    expect(
      getChangedOptions(
        {strokeColor: '#f00', fillOpacity: 0.5, editable: true},
        {strokeColor: '#f00', fillOpacity: 0.2, editable: true}
      )
    ).toEqual({fillOpacity: 0.5});
  });

  test('compares nested values by content', () => {
    expect(
      getChangedOptions({icons: [{offset: '50%'}]}, {icons: [{offset: '50%'}]})
    ).toBeNull();

    expect(
      getChangedOptions({icons: [{offset: '75%'}]}, {icons: [{offset: '50%'}]})
    ).toEqual({icons: [{offset: '75%'}]});
  });

  test('ignores keys inherited from the prototype chain', () => {
    // `key in obj` walks the prototype, so an unguarded check would skip the
    // unset branch for `toString` and then copy the native function through
    const changed = getChangedOptions({}, {toString: 'x'} as object);

    expect(Object.keys(changed ?? {})).toEqual(['toString']);
    expect(Object.values(changed ?? {})).toEqual([UNSET]);
  });

  test('unsets a key that is no longer present', () => {
    const changed = getChangedOptions({strokeColor: '#f00'}, {
      strokeColor: '#f00',
      fillOpacity: 0.5
    } as {strokeColor: string});

    // key presence is what carries the reset, and toEqual ignores
    // undefined-valued keys, so assert the keys directly
    expect(Object.keys(changed ?? {})).toEqual(['fillOpacity']);
    expect(Object.values(changed ?? {})).toEqual([UNSET]);
  });

  test('applies a key that appeared with an explicit undefined value', () => {
    const changed = getChangedOptions({strokeColor: undefined}, {});

    expect(Object.keys(changed ?? {})).toEqual(['strokeColor']);
  });

  test('does not re-send a key already tracked as undefined', () => {
    expect(
      getChangedOptions({strokeColor: undefined}, {strokeColor: undefined})
    ).toBeNull();
  });
});

describe('snapshotOptions', () => {
  test('does not alias nested values from the source object', () => {
    const icons = [{offset: '50%'}];
    const tracked = snapshotOptions({icons});

    icons[0].offset = '75%';

    // a shallow copy would compare the array against itself and report no change
    expect(getChangedOptions({icons}, tracked)).toEqual({icons});
  });

  test('keeps non-plain objects by reference', () => {
    class Instance {}
    const instance = new Instance();

    expect(snapshotOptions({instance}).instance).toBe(instance);
  });
});

describe('hostile keys', () => {
  test('an own __proto__ key does not poison the result', () => {
    const next = JSON.parse(
      '{"strokeColor":"#f00","__proto__":{"polluted":1}}'
    );
    const changed = getChangedOptions(next, {strokeColor: '#f00'});

    // assigning to __proto__ on a plain object hits the inherited setter, so
    // the diff would come back truthy with no own keys and re-fire forever
    expect(changed && Object.keys(changed)).toEqual(['__proto__']);
    expect((changed as Record<string, unknown>).polluted).toBeUndefined();
  });

  test('a null-prototype value is not copied into a plain object', () => {
    const bare = Object.create(null) as Record<string, unknown>;
    bare.a = 1;

    // copying it into {} would make fast-equals report it changed every render
    expect(snapshotOptions({bare}).bare).toBe(bare);
  });
});
