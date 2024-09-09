# `useMapsLibrary` Hook

React hook to get access to the different [Maps JavaScript API libraries][gmp-libraries].
This is essentially a react-version of the `google.maps.importLibrary` function.

```tsx
const MyComponent = () => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib || !map) return;

    const svc = new placesLib.PlacesService(map);
    // ...
  }, [placesLib, map]);

  // ...
};

// Make sure you have wrapped the component tree with the APIProvider
const App = () => (
  <APIProvider apiKey={/* ... */}>
    {/* ... */}
    <MyComponent />
  </APIProvider>
);
```

## Signature

`useMapsLibrary(name: string): google.maps.XxxLibrary`

Returns the library object as it is returned by `google.maps.importLibrary`.

### Parameters

#### `name`: string (required)

The name of the library that should be loaded

## Source

[`src/hooks/use-maps-library.ts`][src]

[gmp-libraries]: https://developers.google.com/maps/documentation/javascript/libraries
[src]: https://github.com/visgl/react-google-maps/blob/main/src/hooks/use-maps-library.ts
