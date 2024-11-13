# Remix Example

This is a [Remix](https://remix.run/docs) example project. It shows a basic map setup with two routes.

## Demo

Checkout the [demo](https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/remix) on Codesandbox.

## Google Maps Platform API Key

This example does not come with an API key. Running the examples locally requires a valid API key for the Google Maps Platform.
See [the official documentation][get-api-key] on how to create and configure your own key.

The API key has to be provided via an environment variable `GOOGLE_MAPS_API_KEY`. This can be done by creating a
file named `.env` in the example directory with the following content:

```shell title=".env"
GOOGLE_MAPS_API_KEY="<YOUR API KEY HERE>"
```

If you are on the CodeSandbox playground you can also choose to [provide the API key like this](https://codesandbox.io/docs/learn/environment/secrets)

## Development

First, run the development server:

For the local server that uses the local library files:

```bash
npm run start-local
```

For the regular dev server that uses the installed version files for `@vis.gl/react-google-maps`:

```bash
npm run start
```

Open [http://localhost:5371](http://localhost:5371) with your browser to see the result.

[get-api-key]: https://developers.google.com/maps/documentation/javascript/get-api-key
