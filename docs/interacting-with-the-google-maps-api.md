# Interacting with the Google Maps API

With the provided components you are able to declaratively create a [Google Map](./api-reference/components/map.md) or a map with [markers](./api-reference/components/marker.md) for example.

Besides that there are three main ways and concepts to interact with the Google Maps API on lower level with this library. You can use the provided `hooks`, the `refs` that are available for some components or use the [useMapsLibrary](./api-reference/hooks/useMapsLibrary.md) hook to tap into other libraries and services of the Google Maps API or craft your own custom hooks.

## Hooks

There are several hooks that provide additional functionality for the map or maps you create. The main one being the [`useMap`](./api-reference/hooks/useMap.md) hook. This hooks give you access to the underlying `google.maps.Map` instance. Every child component that is wrapped in the `<APIProvider>...</APIProvider>` component has access to the map instance via this hook.

```tsx
import React, {useEffect} from 'react';
import {APIProvider, useMap} from '@vis.gl/react-google-maps';

const MyComponent = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // here you can interact with the imperative maps API
  }, [map]);

  return <></>;
};

const App = () => (
  <APIProvider apiKey={'YOUR API KEY HERE'}>
    <Map /* ... */></Map>

    <MyComponent />
  </APIProvider>
);
```

Other hooks provide access to different Google Maps API services:

- [useDirectionsService](./api-reference/hooks/useDirectionsService.md) for the [Directions Service](https://developers.google.com/maps/documentation/javascript/directions)
- [useStreetViewPanorama](./api-reference/hooks/useStreetViewPanorama.md) for the [Streetview Service](https://developers.google.com/maps/documentation/javascript/streetview)
- [useAutocomplete](./api-reference/hooks/useAutocomplete.md) for the [Places Widget](https://developers.google.com/maps/documentation/javascript/reference/places-widget)

The [useMapsLibrary](./api-reference/hooks/useMapsLibrary.md) hook can be utilized to load other parts of the Google Maps API that are not loaded by default. For example the Places Service or the Geocoding Service. [Learn how to use this hook](#other-google-maps-api-libraries-and-services)

## Refs

The `<Marker>` and the `<AdvancedMarker>` components accept a `ref` prop which provides access to the underlying `google.maps.Marker`/`google.maps.marker.AdvancedMarkerElement` instance. Here is an example of how to use the `useMarkerRef` hook to get access to a marker instance. The same concept applies for the `<AdvancedMarker>` (using the `useAdvancedMarkerRef` hook)

```tsx
import React from 'react';
import {
  APIProvider,
  Map,
  Marker,
  useMarkerRef
} from '@vis.gl/react-google-maps';

const App = () => {
  const [markerRef, marker] = useMarkerRef();

  useEffect(() => {
    if (!marker) {
      return;
    }

    // do something with marker instance here
  }, [marker]);

  return (
    <APIProvider apiKey={'Your API key here'}>
      <Map zoom={12} center={{lat: 53.54992, lng: 10.00678}}>
        <Marker ref={markerRef} position={{lat: 53.54992, lng: 10.00678}} />
      </Map>
    </APIProvider>
  );
};

export default App;
```

## Other Google Maps API libraries and services

The Maps JavaScript API has a lot of [additional libraries](https://developers.google.com/maps/documentation/javascript/libraries)
for things like geocoding, routing, the Places API, Street View, and a lot more. These libraries
are not loaded by default, which is why this module provides a hook
`useMapsLibrary()` to handle dynamic loading of those libraries.

For example, if you want to write a component that needs to use the
`google.maps.places.PlacesService` class, you can implement it like this:

```tsx
import {useMapsLibrary} from '@vis.gl/react-google-maps';

const MyComponent = () => {
  // triggers loading the places library and returns true once complete (the
  // component calling the hook gets automatically re-rendered when this is
  // the case)
  const placesApiLoaded = useMapsLibrary('places');
  const [placesService, setPlacesService] = useState(null);

  useEffect(() => {
    if (!placesApiLoaded) return;

    // when placesApiLoaded is true, the library can be accessed via the
    // global `google.maps` namespace.
    setPlacesService(new google.maps.places.PlacesService());
  }, [placesApiLoaded]);

  useEffect(() => {
    if (!placesService) return;

    // ...use placesService...
  }, [placesService]);

  return <></>;
};
```

Or you can extract your own hook from this:

```tsx
function usePlacesService() {
  const placesApiLoaded = useMapsLibrary('places');
  const [placesService, setPlacesService] = useState(null);

  useEffect(() => {
    if (!placesApiLoaded) return;

    setPlacesService(new google.maps.places.PlacesService());
  }, [placesApiLoaded]);

  return placesService;
}

const MyComponent = () => {
  const placesService = usePlacesService();

  useEffect(() => {
    if (!placesService) return;

    // ... use placesService ...
  }, [placesService]);

  return <></>;
};
```
