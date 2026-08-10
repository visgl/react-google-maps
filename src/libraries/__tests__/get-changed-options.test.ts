import {getChangedOptions} from '../get-changed-options';

test('returns everything when there are no previous options', () => {
  const options = {strokeColor: '#f00', editable: true};
  const changed = getChangedOptions(options, null);

  expect(changed).toEqual(options);
  // the caller's object is the value the memoization compares against, so it
  // must not be handed on to the maps api
  expect(changed).not.toBe(options);
});

test('returns null for an empty options object', () => {
  expect(getChangedOptions({}, null)).toBeNull();
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
    getChangedOptions({icons: [{offset: '50%'}]}, {icons: [{offset: '25%'}]})
  ).toEqual({icons: [{offset: '50%'}]});
});

test('reports a value that became undefined', () => {
  const changed = getChangedOptions(
    {strokeColor: undefined},
    {strokeColor: '#f00'}
  );

  // key presence is what makes setOptions reset a value, and `toEqual` ignores
  // undefined-valued keys, so assert the keys directly
  expect(Object.keys(changed ?? {})).toEqual(['strokeColor']);
});

test('reports a key the previous options never carried', () => {
  // the prop was omitted for a render, so the snapshot lost the key. setting it
  // back to undefined must still reach the instance, otherwise the old value
  // stays applied forever
  const changed = getChangedOptions({strokeColor: undefined}, {});

  expect(Object.keys(changed ?? {})).toEqual(['strokeColor']);
});

test('ignores keys that are no longer present', () => {
  // the maps api leaves unspecified options untouched, so a dropped prop has
  // never reset the option on the instance
  expect(
    getChangedOptions({strokeColor: '#f00'}, {
      strokeColor: '#f00',
      fillOpacity: 0.5
    } as {strokeColor: string})
  ).toBeNull();
});
