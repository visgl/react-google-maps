# 3D Maps Example

This example implements a new `Map3D` component that renders
a 3D Globe based on the new experimental [`Map3DElement`][gmp-map3d-overview]
web-component.

The `Map3D` component is built with partially controlled props:

- The props for the camera-view (`center`, `range`, `heading`, `tilt` and
  `roll`) can act as fully controlled as long as no interactions happen.
- While interacting with the globe, the `onCameraChange` callback will notify
  the app of any changes to the camera.
- When feeding the values from `onCameraChange` back into the `Map3D`
  component, like in the example below, this will also work as expected.
- The values can't be manipulated while an interaction is happening.

```tsx
import {useState, useCallback} from 'react';
import {Map3D, Map3DCameraProps} from './map-3d';

const MyGlobe = () => {
  const [cameraProps, setCameraProps] =
    useState<Map3DCameraProps>(INITIAL_CAMERA_PROPS);
  const handleCameraChange = useCallback(props => setCameraProps(props), []);

  return <Map3D {...cameraProps} onCameraChange={handleCameraChange} />;
};
```

To use the `Map3D` component in your own experiments (it's experimental, so
please don't use it in production yet), copy the entire `./src/map-3d`
folder into your application and import the component with
`import {Map3D} from './map-3d';`.

[gmp-map3d-overview]: https://developers.google.com/maps/documentation/javascript/3d-maps-overview

## Google Maps API key

This example does not come with an API key. Running the examples locally requires a valid API key for the Google Maps Platform.
See [the official documentation][get-api-key] on how to create and configure your own key.

The API key has to be provided via an environment variable `GOOGLE_MAPS_API_KEY`. This can be done by creating a
file named `.env` in the example directory with the following content:

```shell title=".env"
GOOGLE_MAPS_API_KEY="<YOUR API KEY HERE>"
```

If you are on the CodeSandbox playground you can also choose to [provide the API key like this](https://codesandbox.io/docs/learn/environment/secrets)

## Development

Go into the example-directory and run

```shell
npm install
```

To start the example with the local library run

```shell
npm run start-local
```

The regular `npm start` task is only used for the standalone versions of the example (CodeSandbox for example)

[get-api-key]: https://developers.google.com/maps/documentation/javascript/get-api-key
