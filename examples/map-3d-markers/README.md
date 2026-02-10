# 3D Maps with Markers Example

This example implements a new `Map3D` component that renders
a 3D Globe based on the new experimental [`Map3DElement`][gmp-map3d-overview]
web-component.

The map contains basic [`Marker3DElements`][gmp-map3d-marker-add] as well as markers with a custom pin and a 3D model.

[gmp-map3d-overview]: https://developers.google.com/maps/documentation/javascript/3d-maps-overview
[gmp-map3d-marker-add]: https://developers.google.com/maps/documentation/javascript/3d/marker-add

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
