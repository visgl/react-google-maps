# `useMap` Hook

React hook to get access to any [google.maps.Map][gmp-map-ref]
instance within the APIProvider.

[gmp-map-ref]: https://developers.google.com/maps/documentation/javascript/reference/map#Map

## Usage

When there is only a single map within the `<APIProvider>`, the `useMap()` hook
can be called without any arguments and the `<Map>` doesn't need an id.

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

If there are multiple `<Map>` components in the APIProvider, they are only retrievable
using the `useMap()` hook when the hook is either called from a child-component of
the map or when an explicit id is specified on both the map and as a parameter of
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

## Return value

Returns a [google.maps.Map](https://developers.google.com/maps/documentation/javascript/reference/map#Map).
