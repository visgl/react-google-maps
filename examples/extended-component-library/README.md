# Google Maps Platform’s Extended Component Library Example

![image](https://user-images.githubusercontent.com/39244966/208682692-d5b23518-9e51-4a87-8121-29f71e41c777.png)

This example shows how to build a basic locations services web app using the [Google Maps Platform’s Extended Component Library](https://github.com/googlemaps/extended-component-library/tree/main).

[Google Maps Platform’s Extended Component Library](https://github.com/googlemaps/extended-component-library/tree/main) is a set of Web Components that helps developers build better maps faster, and with less effort. It encapsulates boilerplate code, best practices, and responsive design, reducing complex map UIs into what is effectively a single HTML element.

Ultimately, these components make it easier to read, learn, customize, and maintain maps-related code.

Components used in this example:

- [SplitLayout](https://github.com/googlemaps/extended-component-library/blob/main/src/split_layout/README.md)
- [OverlayLayout](https://github.com/googlemaps/extended-component-library/blob/main/src/overlay_layout/README.md)
- [PlacePicker](https://github.com/googlemaps/extended-component-library/blob/main/src/place_picker/README.md)
- [PlaceOverview](https://github.com/googlemaps/extended-component-library/blob/main/src/place_overview/README.md)
- [IconButton](https://github.com/googlemaps/extended-component-library/blob/main/src/icon_button/README.md)
- [PlaceDataProvider](https://github.com/googlemaps/extended-component-library/blob/main/src/place_building_blocks/place_data_provider/README.md)
- [PlaceReviews](https://github.com/googlemaps/extended-component-library/blob/main/src/place_building_blocks/place_reviews/README.md)

**Important**:
The [Extended Component
Library](https://github.com/googlemaps/extended-component-library/tree/main) is
offered using an open source license. It is not governed by the Google Maps
Platform Support Technical Support Services Guidelines, the SLA, or the
Deprecation Policy (however, any Google Maps Platform services used by the
library remain subject to the Google Maps Platform Terms of Service). If you
find a bug, or have a feature request, file an issue on the Github library
site.

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
