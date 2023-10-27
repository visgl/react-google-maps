# `useMapsLibrary` Hook

React hook to get access to the different [Google Maps API libraries][gmp-libraries].
This is essentially a react-version of the `google.maps.importLibrary` function.

```tsx
const MyComponent = () => {
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib) return;

    const svc = new placesLib.PlacesService();
    // ...
  }, [placesLib]);

  // ...
};
```

## Signature

`useMapsLibrary(name: string): google.maps.XxxLibrary`

Returns the library object as it is returned by `google.maps.importLibrary`.

### Parameters

#### `name`: string (required)

The name of the library that should be loaded

## Source

[`src/hooks/use-maps-library.tsx`][src]

[gmp-libraries]: https://developers.google.com/maps/documentation/javascript/libraries
[src]: https://github.com/visgl/react-google-maps/blob/main/src/hooks/use-maps-library.tsx
