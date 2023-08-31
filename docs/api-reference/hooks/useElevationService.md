# `useElevationService` Hook

React hook to use the Google Maps Platform [Elevation Service](https://developers.google.com/maps/documentation/javascript/elevation) in any component.

## Usage

```tsx
import React, {useEffect} from 'react';
import {useElevationService} from '@vis.gl/react-google-maps-hooks';

const MyComponent = () => {
  const elevator = useElevationService();
  const location = /** google.maps.LatLng */;

  useEffect(() => {
    elevator?.getElevationForLocations(
      {locations: [location]},
      (results: google.maps.ElevationResult[]) => {
        // Do something with results
      }
    );
  }, [location]);

  return (...);
};
```

## Return value

Returns a [`Elevation Service`](https://developers.google.com/maps/documentation/javascript/elevation) instance to use directly.

```TypeScript
google.maps.ElevationService
```
