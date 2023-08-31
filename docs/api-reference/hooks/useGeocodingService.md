# `useGeocodingService` Hook

React hook to use the Google Maps Platform [Geocoding Service](https://developers.google.com/maps/documentation/javascript/geocoding) in any component.

## Usage

```tsx
import React from 'react';
import {useGeocodingService} from '@vis.gl/react-google-maps-hooks';

const MyComponent = () => {
  const geocoder = useGeocodingService();

  // Do something with the geocoder

  return (...);
};
```

## Return value

Returns a [`Geocoder`](https://developers.google.com/maps/documentation/javascript/reference/geocoder) instance to use directly.

```TypeScript
google.maps.Geocoder
```
