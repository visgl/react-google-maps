# `useMapsLibrary` Hook

React hook to trigger loading of different [Google Maps API libraries][gmp-libraries].

[gmp-libraries]: https://developers.google.com/maps/documentation/javascript/libraries

## Usage

```tsx
const MyComponent = () => {
  const placesApiLoaded = useMapsLibrary('places');
  const [placesService, setPlacesService] = useState(null);

  useEffect(() => {
    if (!placesApiLoaded) return;

    // when placesApiLoaded is true, the library can be accessed via the
    // global `google.maps` namespace.
    setPlacesService(new google.maps.places.PlacesService());
  }, [placesApiLoaded]);

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
