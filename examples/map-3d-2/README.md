# Map3D Component Example

This example demonstrates the new `<Map3D/>` component which provides a React wrapper for Google Maps' 3D Map functionality.

## Features

- 3D map rendering with photorealistic tiles
- Camera controls (center, range, heading, tilt, roll)
- Camera animation methods (flyCameraAround, flyCameraTo, stopCameraAnimation)
- Event handling for camera changes and clicks

## Google Maps Platform API Key

This example requires a valid API key for the Google Maps Platform with the following APIs enabled:
- Maps JavaScript API
- Map Tiles API (for 3D photorealistic tiles)

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

To start the example with the latest published library version on npm run

```shell
npm start
```

[get-api-key]: https://developers.google.com/maps/documentation/javascript/get-api-key
