# Get Started

The easiest way to get started is to start with any of the examples in our
[`./examples` folder](https://github.com/visgl/react-google-maps/tree/main/examples).
Each of the examples is a standalone application using a vite development server
that you can copy as a starting point.

In order for this to work, an [API key for the Google Maps JavaScript API][gmp-get-api-key]
is required. For the examples, this key has to be provided via an environment variable
`GOOGLE_MAPS_API_KEY`, for example by putting your key into a file named `.env` in the
directory:

```text title=".env"
GOOGLE_MAPS_API_KEY=<your API key here>
```

Once that is set up, run `npm install` followed by `npm start` to start the development server.

[gmp-get-api-key]: https://developers.google.com/maps/documentation/javascript/get-api-key

## Installation

The library can be installed from npm:

```bash
npm install @vis.gl/react-google-maps
```
or
```bash
yarn add @vis.gl/react-google-maps
```

This module comes with full TypeScript-support out of the box, so no additional module is
required for the typings.

## Example

A minimal example to just render a map looks like this:

```tsx title=index.jsx
import React from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={API_KEY}>
    <Map
      style={{width: '100vw', height: '100vh'}}
      defaultCenter={{lat: 22.54992, lng: 0}}
      defaultZoom={3}
      gestureHandling='greedy'
      disableDefaultUI
    />
  </APIProvider>
);

const root = createRoot(document.querySelector('#app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
