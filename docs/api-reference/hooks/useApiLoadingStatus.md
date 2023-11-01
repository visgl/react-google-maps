# `useApiIsLoaded` Hook

React hook to get the current status of the API Loader. This can be used to react to loading-errors.

```tsx
import {useApiLoadingStatus, APILoadingStatus} from '@vis.gl/react-google-maps';

const MyComponent = () => {
  const status = useApiLoadingStatus();

  useEffect(() => {
    if (status === APILoadingStatus.FAILED) {
      console.log(':(');

      return;
    }
  }, [status]);

  // ...
};
```

## Signature

`useApiLoadingStatus(): APILoadingStatus`

Returns the current loading-state.

## Source

[`src/hooks/use-api-loading-status.tsx`][src]

[src]: https://github.com/visgl/react-google-maps/blob/main/src/hooks/use-api-loading-status.tsx
