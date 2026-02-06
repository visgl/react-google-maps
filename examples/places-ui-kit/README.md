# Places Ui Kit Example

![image](https://user-images.githubusercontent.com/39244966/208682692-d5b23518-9e51-4a87-8121-29f71e41c777.png)

This is an example to show how to setup the Google Places UI Kit webcomponents

## Enable the API

To use the Places UI Kit you need to enable the [API][places-ui-kit] in the Cloud Console.

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
[places-ui-kit]: https://console.cloud.google.com/apis/library/placewidgets.googleapis.com
[elevation-api]: https://console.cloud.google.com/marketplace/product/google/elevation-backend.googleapis.com
