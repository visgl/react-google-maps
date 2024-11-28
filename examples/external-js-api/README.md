# Externally loaded Google Maps JavaScript API

![image](https://user-images.githubusercontent.com/39244966/208682692-d5b23518-9e51-4a87-8121-29f71e41c777.png)

This is an example to show how to set up a simple Google map with the `<Map/>` with externally loaded Google Maps JavaScript API.
For instance, you can use the Google Maps JavaScript API URL to load the API when you need to use Client ID instead of API Key.

## Google Maps Platform API URL

This example does not come with an API URL. Running the examples locally requires a valid Google Maps JavaScript API URL.
See [the official documentation][get-load-maps-js-api] on how to create a URL.

The API URL has to be provided via an environment variable `GOOGLE_MAPS_API_URL`. This can be done by creating a
file named `.env` in the example directory with the following content:

```shell title=".env"
GOOGLE_MAPS_API_URL="<YOUR URL HERE>"
```

If you are on the CodeSandbox playground you can also choose to [provide the API URL like this](https://codesandbox.io/docs/learn/environment/secrets)

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

[get-load-maps-js-api]: https://developers.google.com/maps/documentation/javascript/load-maps-js-api#direct_script_loading_url_parameters
