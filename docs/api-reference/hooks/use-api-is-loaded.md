# `useApiIsLoaded` Hook

React hook to check if the Maps JavaScript API has finished loading.

```tsx
import {useApiIsLoaded} from '@vis.gl/react-google-maps';

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

## Signature

`useApiIsLoaded(): boolean`

Returns a boolean indicating if the Maps JavaScript API completed loading.

## Source

[`src/hooks/use-api-is-loaded.ts`][src]

[src]: https://github.com/visgl/react-google-maps/blob/main/src/hooks/use-api-is-loaded.ts
