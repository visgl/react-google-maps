import {setMapObjectOptions} from '../set-map-object-options';

// tracking is keyed per object in a module-level WeakMap, so every test needs
// its own object or state leaks between them
const createObject = () => ({setOptions: jest.fn()});

test('writes the full set for an object with nothing recorded', () => {
  const object = createObject();

  setMapObjectOptions(object, {strokeColor: '#f00', editable: true});

  // failing safe: a caller that did not record a baseline gets everything
  // rather than silently losing options
  expect(object.setOptions).toHaveBeenCalledWith({
    strokeColor: '#f00',
    editable: true
  });
});

test('records without writing when the options were already applied', () => {
  const object = createObject();

  setMapObjectOptions(object, {strokeColor: '#f00'}, {alreadyApplied: true});

  expect(object.setOptions).not.toHaveBeenCalled();
});

test('writes an option that changed after it was recorded', () => {
  const object = createObject();

  // the constructor got the old value and the props changed in the same commit
  setMapObjectOptions(
    object,
    {strokeColor: '#f00', editable: true},
    {
      alreadyApplied: true
    }
  );

  setMapObjectOptions(object, {strokeColor: '#0f0', editable: true});

  expect(object.setOptions).toHaveBeenCalledTimes(1);

  const [sent] = object.setOptions.mock.calls[0];
  expect(Object.keys(sent)).toEqual(['strokeColor']);
  expect(sent.strokeColor).toBe('#0f0');
});

test('writes nothing when called again with equal options', () => {
  const object = createObject();

  setMapObjectOptions(object, {strokeColor: '#f00'}, {alreadyApplied: true});

  setMapObjectOptions(object, {strokeColor: '#f00'});
  setMapObjectOptions(object, {strokeColor: '#f00'});

  expect(object.setOptions).not.toHaveBeenCalled();
});

test('unsets an option that is no longer present, once', () => {
  const object = createObject();

  setMapObjectOptions(object, {strokeColor: '#f00'}, {alreadyApplied: true});

  setMapObjectOptions(object, {} as {strokeColor?: string});

  const [sent] = object.setOptions.mock.calls[0];
  expect(Object.keys(sent)).toEqual(['strokeColor']);
  expect(sent.strokeColor).toBeNull();

  object.setOptions.mockClear();
  setMapObjectOptions(object, {} as {strokeColor?: string});

  expect(object.setOptions).not.toHaveBeenCalled();
});

test('tracks each object separately', () => {
  const first = createObject();
  const second = createObject();

  setMapObjectOptions(first, {strokeColor: '#f00'}, {alreadyApplied: true});
  setMapObjectOptions(second, {strokeColor: '#f00'});

  // the second has nothing recorded, so it gets the full set
  expect(second.setOptions).toHaveBeenCalledWith({strokeColor: '#f00'});
});
