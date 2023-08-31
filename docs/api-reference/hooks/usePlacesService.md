# `usePlacesService` Hook

React hook to use the Google Maps Platform [Places Service](https://developers.google.com/maps/documentation/javascript/reference/places-service) in any component.

## Usage

When initializing the `<APIProvider>`, include the Places Library like this: `libraries={['places']}`.

The Places Service renders attributions in a specified container.

This container can either be a `Map`, which is implemented in the following way with the `usePlacesService` Hook:

```tsx
import React from 'react';
import {usePlacesService} from '@vis.gl/react-google-maps-hooks';

const MyComponent = () => {
  const placesService = usePlacesService();

  // Do something with the Places Service

  return (...);
};
```

or the container is a `div` element, that needs to be passed to the `usePlacesService` Hook in the following way:

```tsx
import React from 'react';
import {usePlacesService} from '@vis.gl/react-google-maps-hooks';

const MyComponent = () => {
  const [divContainer, setDivContainer] = useState<HTMLDivElement | null>(null);

  const divRef = useCallback(
    (node: React.SetStateAction<HTMLDivElement | null>) => {
      node && setDivContainer(node);
    },
    []
  );

  const service = usePlacesService({divElement: divContainer});

  // Do something with the places Service

  return (...);
};
```

## Return value

Returns a [`Places Service`](https://developers.google.com/maps/documentation/javascript/reference/places-service) instance to use directly.

```TypeScript
google.maps.places.PlacesService
```
