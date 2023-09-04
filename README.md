# Google Maps React

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/ubilabs/google-maps-react-hooks/tree/main/LICENSE)

A library to integrate the Google Maps JavaScript API into React Applications
using simple components or hooks.

The hooks provide the possibility to access different Google Maps services and libraries, as well as the map instance
itself inside all components that are wrapped inside the `APIProvider`.
The map instance can only be accessed, if a `Map` component is used inside the `APIProvider`.

## Description

This is a Typescript / Javascript library to integrate the Google Maps Javascript API into your React application.
It comes with a collection of React components to create maps, markers and infowindows, and a set of
hooks to use some of the Google Maps
API [Services](https://developers.google.com/maps/documentation/javascript#services)
and [Libraries](https://developers.google.com/maps/documentation/javascript#libraries).

## Installation

```sh
npm install @vis.gl/react-google-maps -D
```

## Map Usage

Import the `APIProvider` and wrap it around all components that should have access to the map instance(s).
All components that are children of the `APIProvider` can use hooks, components and access all map instance(s).

Add a `Map` component inside the `APIProvider` to display a map on the screen. Inside the `Map` component, it is
possible to add components like a `Marker` or `InfoWindow` that can be displayed on the map. Also, all hooks can be used
inside all components.

```tsx
import React from 'react';
import {APIProvider, Map, Marker, InfoWindow} from '@vis.gl/react-google-maps';

function App() {
  const position = {lat: 53.54992, lng: 10.00678};

  return (
    <APIProvider googleMapsAPIKey={'YOUR API KEY HERE'}>
      <Map zoom={10} center={position}>
        <Marker position={position}>
          <InfoWindow>
            <p>I am open.</p>
          </InfoWindow>
        </Marker>
      </Map>
    </APIProvider>
  );
}

export default App;
```

## Usage of the `useMap` hook

The `APIProvider` is used to load the Google Maps JavaScript API at the top level of the app component and provides a
context that holds all map instances that can be accessed via the `useMap` hook.

It is possible to use one or multiple `Map` components inside the `APIProvider`. Make sure to pass the id of the map to
the `useMap` hook when using multiple maps.

### Hook usage with one Map component

The `useMap()` hook can be used to directly access the `google.maps.Map` instance created by a `<Map>` component
in your application.

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

### Hook usage with multiple Map components

When multiple `Map` components are used, an additional prop `id` is required for all map components (internally, the
id `default` is used whenever no map-id is specified, which could lead to problems with multiple maps).

Inside the App component:

```tsx
import React from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

function App() {
  const position = {lat: 53.54992, lng: 10.00678};

  return (
    <APIProvider apiKey={'YOUR API KEY HERE'}>
      <Map id={'map-1'} /* ... */ />
      <Map id={'map-2'} /* ... */ />
    </APIProvider>
  );
}

export default App;
```

Inside another component, accessing the map instances:

```tsx
import React, {useEffect} from 'react';
import {useMap} from '@vis.gl/react-google-maps-hooks';

const MyComponent = () => {
  const mapOne = useMap('map-1');
  const mapTwo = useMap('map-2');

  useEffect(() => {
    if (!mapOne || !mapTwo) return;

    // interact with the map-instances.
  }, [mapOne, mapTwo]);

  return <></>;
};
```

## Examples

Explore our [examples directory on GitHub](./examples) for full implementation examples.
