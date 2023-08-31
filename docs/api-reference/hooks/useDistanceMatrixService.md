# `useDistanceMatrixService` Hook

React hook to use the Google Maps Platform [Distance Matrix Service](https://developers.google.com/maps/documentation/javascript/distancematrix) in any component.

## Usage

```tsx
import React from 'react';
import {useDistanceMatrixService} from '@vis.gl/react-google-maps-hooks';

const MyComponent = () => {
  const service = useDistanceMatrixService();

  service.getDistanceMatrix(request, response => {
    // Do something with the response
  }

  return (...);
};
```

## Return value

Returns a [`Distance Matrix Service`](https://developers.google.com/maps/documentation/javascript/distancematrix) instance to use directly.

```TypeScript
google.maps.DistanceMatrixService
```
