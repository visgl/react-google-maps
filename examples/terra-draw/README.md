# TerraDraw Integration Example

This example demonstrates how to integrate TerraDraw with
`@vis.gl/react-google-maps` to add drawing capabilities to a React application.

It includes:

- A `MapControl` toolbar for switching TerraDraw modes
- Basic feature actions (delete last, clear all)
- GeoJSON import and export helpers

## Google Maps Platform API Key

This example does not come with an API key. Running the examples locally requires
a valid API key for the Google Maps Platform.
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
