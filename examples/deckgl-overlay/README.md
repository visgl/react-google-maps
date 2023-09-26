# deck.gl Interleaved Overlay Example

An example demonstrating how an interleaved deck.gl overlay can be added
to a `<Map>` component. (using the `GoogleMapsOverlay` from [@deck.gl/google-maps][]).

[@deck.gl/google-maps]: https://deck.gl/docs/api-reference/google-maps/overview

## Instructions

Go into the example-directory and run

```shell
npm install
```

Then start the example with

```shell
npm start
```

Running the examples locally requires a valid API key for the Google Maps Platform.
See [the official documentation][get-api-key] on how to create and configure your own key.

The API key has to be provided via an environment variable `GOOGLE_MAPS_API_KEY`. This can be done by creating a
file named `.env` in the example directory with the following content:

```shell title=".env"
GOOGLE_MAPS_API_KEY="<YOUR API KEY HERE>"
```

[get-api-key]: https://developers.google.com/maps/documentation/javascript/get-api-key
