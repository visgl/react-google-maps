# `useMaxZoomService` Hook

React hook to use the Google Maps Platform [Maximum Zoom Imagery Service](https://developers.google.com/maps/documentation/javascript/maxzoom) in any component.

## Usage

```tsx
import React, {useEffect} from 'react';
import {useMaxZoomService} from '@vis.gl/react-google-maps-hooks';

const MyComponent = () => {
  const maxZoomService = useMaxZoomService();
  const location = /** google.maps.LatLng */;

  useEffect(() => {
    maxZoomService?.getMaxZoomAtLatLng(
      location,
      (result: google.maps.MaxZoomResult) => {
        // Do something with result
      }
    );
  }, [location]);

  return (...);
};
```

## Return value

Returns a [`Max Zoom Service`](https://developers.google.com/maps/documentation/javascript/maxzoom) instance to use directly.

```TypeScript
google.maps.MaxZoomService
```
