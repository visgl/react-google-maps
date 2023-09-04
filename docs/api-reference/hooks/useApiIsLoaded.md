# `useMapsLibrary` Hook

React hook to check if the Google Maps (core-) API has finished loading.

## Usage

```tsx
const MyComponent = () => {
  const apiIsLoaded = useApiIsLoaded();

  useEffect(() => {
    if (!apiIsLoaded) return;

    // when the maps library is loaded, apiIsLoaded will be true and the API can be
    // accessed using the global `google.maps` namespace.
  }, [apiIsLoaded]);

  // ...
};
```

```tsx
const MyComponent = () => {
  const librariesLoaded = useMapsLibrary('places', 'geocoding', 'routes');

  useEffect(() => {
    if (!librariesLoaded) return;

    // ...
  }, [librariesLoaded]);

  // ...
};
```

## Return value

Returns a boolean indicating if all the specified libraries have been loaded.
