# Google Maps Routes API Example

![image](https://raw.githubusercontent.com/visgl/react-google-maps/main/website/static/images/examples/directions.jpg)

This is an example which shows how to use `useMapsLibrary` to load the `routes` library, and then use the modern `Route` class to compute and render routes on a map.

It utilizes the modern client-side `Route.computeRoutes()` method combined with custom-styled React `<Polyline>` rendering, completely avoiding legacy services and CORS restrictions.

> [!IMPORTANT]
>
> This example uses the new [Routes API (Recommended)][gcp-routes-api] which is the modern and current way to calculate directions. If you are using the [Directions API (Legacy)][gcp-directions-api] Service, consider switching to this implementation of Routes API.

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
[gcp-directions-api]: https://console.cloud.google.com/apis/library/directions-backend.googleapis.com
[gcp-routes-api]: https://console.cloud.google.com/apis/library/routes.googleapis.com
