# `useDirectionsService` Hook

React hook to use the Google Maps Platform [Directions Service](https://developers.google.com/maps/documentation/javascript/reference/directions) in any component.

## Usage

```tsx
import React from 'react';
import {useDirectionsService} from '@vis.gl/react-google-maps-hooks';

const MyComponent = () => {
  const {
    directionsService,
    directionsRenderer,
    renderRoute,
    setRenderedRouteIndex
  } = useDirectionsService(directionsOptions);

  // Do something with the directions

  return (...);
};
```

## Parameters

### DirectionsProps

Pass in whether to render on a Google Maps Platform map or not and the
[DirectionsRendererOptions](https://developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRendererOptions).

```TypeScript
export interface DirectionsServiceHookOptions {
  mapId?: string;
  renderOnMap?: boolean;
  renderOptions?: google.maps.DirectionsRendererOptions;
}
```

The `mapId` needs to be applied when multiple `Map` components are used.

## Return value

Returns an object with the following elements:

- [`directionsService`](https://developers.google.com/maps/documentation/javascript/reference/directions#DirectionsService) instance
- [`directionsRenderer`](https://developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRenderer) instance
- `renderRoute` retrieve directions and render them on the map, will return the route result (`google.maps.DirectionsResult`).
- `setRenderedRouteIndex` select which of multiple routes from the `google.maps.DirectionsResult` should be rendered

```TypeScript
interface DirectionsServiceHookReturns {
  directionsService: google.maps.DirectionsService | null;
  directionsRenderer: google.maps.DirectionsRenderer | null;
  renderRoute: ((request: google.maps.DirectionsRequest) => Promise<google.maps.DirectionsResult>) | null;
  setRenderedRouteIndex : ((index: number) => void) | null;
}
```

**NOTE**:
renderRoute and setRenderedRouteIndex are only returned when `renderRoute` is set to true
