# `useMap` Hook

The `useMap()` hook can be used to directly access the
[`google.maps.Map`][gmp-map-ref] instance created by a
[`Map`](../components/map.md) component within the
[`APIProvider`](../components/api-provider.md) in your application.

## Usage

When there is only a single map within the `APIProvider`, the `useMap()`
hook can be called without any arguments and the `Map` doesn't need an id.

The same is true for components that are added as a child to the `Map`
component.

```tsx
const MyComponent = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // do something with the map instance
  }, [map]);

  return <>...</>;
};

const App = () => {
  return (
    <APIProvider>
      <Map></Map>
      <MyComponent />
    </APIProvider>
  );
};
```

When there are multiple `Map` components in the `APIProvider`, they are only retrievable
using the `useMap()` hook when the hook is either called from a child-component of
a `Map` or when an explicit id is specified on both the map and as a parameter of
the `useMap()` hook.

```tsx
const MyComponent = () => {
  const map = useMap('one-of-my-maps');

  useEffect(() => {
    if (!map) return;

    // do something with the map instance
  }, [map]);
  // Do something with the Google Maps map instance

  return <>...</>;
};

const App = () => {
  return (
    <APIProvider>
      <Map id={'one-of-my-maps'} />
      <Map id={'another-map'} />
      <MyComponent />
    </APIProvider>
  );
};
```

## Signature

`useMap(id?: string): google.maps.Map | null`

Returns the `google.maps.Map` instance or null if it can't be found

The returned map instance is determined as follows:

- If an `id` is specified, the map with that `id` is retrieved from the
  `APIProviderContext`.
  If that can't be found, return `null`.
- When no `id` is specified
  - If there is a parent map instance, return it
  - Otherwise, return the map with id `default` (maps without the `id` prop
    are registered with id `default`).

### Parameters

#### `id`: string (optional)

The id of the map-instance to be returned. If not specified it will return
the parent map instance, or the default map instance if there is no parent.

## Source

[`src/hooks/use-map.tsx`][src]

[src]: https://github.com/visgl/react-google-maps/blob/main/src/hooks/use-map.tsx
[gmp-map-ref]: https://developers.google.com/maps/documentation/javascript/reference/map#Map
