import {
  applyOptionsUpdate,
  getChangedOptions,
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

describe('applyOptionsUpdate', () => {
  test('folds the next options into the tracked state', () => {
    expect(
      applyOptionsUpdate(
        {strokeColor: '#f00', fillOpacity: 0.2},
        {
          strokeColor: '#0f0',
          fillOpacity: 0.2
        }
      )
    ).toEqual({strokeColor: '#0f0', fillOpacity: 0.2});
  });

  test('drops keys that are no longer present, so they are not unset twice', () => {
    const updated = applyOptionsUpdate(
      {strokeColor: '#f00', fillOpacity: 0.5} as {
        strokeColor: string;
      },
      {strokeColor: '#f00'}
    );

    expect(Object.keys(updated)).toEqual(['strokeColor']);
    // the next diff against these tracked options must be a no-op
    expect(getChangedOptions({strokeColor: '#f00'}, updated)).toBeNull();
  });
});
