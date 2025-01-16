# `<StaticMap>` Component

React component and utility function to create and render [Google Static Maps][gmp-static-map] images. This implementation provides both a React component for rendering and a URL generation utility that supports all Google Static Maps API features. The main purpose of the utility function is to enable 'url-signing' in various
server environments.

:::note

Currently, the `StaticMap` component is just a thin wrapper for a 
regular `img` element. This will likely change in future versions when 
additional features are added to static maps.

:::

The main parameters to control the map are `center`,
`zoom`, `width` and `height`. With a plain map all of these are required for the map to show. There are cases where `center` and `zoom` can be omitted and the viewport can be automatically be determined from other data. This is the case when having markers, paths or other `visible` locations which can form an automatic bounding box for the map view.

Parameters that are always required are `apiKey`, `width` and `height`.

```tsx
import {StaticMap, createStaticMapsUrl} from '@vis.gl/react-google-maps';

const App = () => {
  let staticMapsUrl = createStaticMapsUrl({
    apiKey: 'YOUR API KEY',
    width: 512,
    height: 512,
    center: {lat: 53.555570296010295, lng: 10.008892744638956},
    zoom: 15
  });

  // Recommended url-signing when in a server environment.
  staticMapsUrl = someServerSigningCode(
    staticMapsUrl,
    process.env.MAPS_SIGNING_SECRET
  );

  return <StaticMap url={staticMapsUrl} />;
};
```

More on URL signing and digital signatures [here](#digital-signature).

## Props

The `StaticMap` component only has one `url` prop. The recommended way to generate the url is to use the `createStaticMapsUrl` helper function.

### Required

#### `url`: string

An url which can be consumed by the Google Maps Static Api.

### Optional

#### `className`: string

A class name that will be attached to the `img` tag.

## `createStaticMapsUrl` options

:::note

Some explanations and syntax migh differ slightly from the official documentation since the Google documentation focuses on building and URL which has
been abstracted here in the helper function for better developer experience

:::

For more details about API options see the [get started][get-started] guide in the Google documentation.

### Required

#### `apiKey`: string

The Google Maps Api key.

#### `width`: number

Width of the image. Maps smaller than 180 pixels in width will display a reduced-size Google logo. This parameter is affected by the scale parameter; the final output size is the product of the size and scale values.

#### `height`: number

Height of the image. This parameter is affected by the scale parameter; the final output size is the product of the size and scale values.

### Optional

#### `center`: [StaticMapsLocation](#staticmapslocation)

(required if no markers, paths or visible locations are present) Defines the center of the map, equidistant from all edges of the map. This parameter takes a location as either [`google.maps.LatLngLiteral`][gmp-ll] or a string address (e.g. "city hall, new york, ny") identifying a unique location on the face of the earth.

#### `zoom`: number

(required if no markers, paths or visible locations are present) Defines the zoom level of the map, which determines the magnification level of the map. This parameter takes a numerical value corresponding to the zoom level of the region desired.

#### `scale`: number

Affects the number of pixels that are returned. scale=2 returns twice as many pixels as scale=1 while retaining the same coverage area and level of detail (i.e. the contents of the map don't change). This is useful when developing for high-resolution displays. The default value is 1. Accepted values are 1 and 2

#### `format`: 'png' | 'png8' | 'png32' | 'gif' | 'jpg' | 'jpg-baseline'

Defines the format of the resulting image. By default, the Maps Static API creates PNG images. There are several possible formats including GIF, JPEG and PNG types. Which format you use depends on how you intend to present the image. JPEG typically provides greater compression, while GIF and PNG provide greater detail

#### `mapType`: [google.maps.MapTypeId][gmp-map-type-id]

Defines the type of map to construct. There are several possible maptype values, including roadmap, satellite, hybrid, and terrain.

#### `language`: string

Defines the language to use for display of labels on map tiles. Note that this parameter is only supported for some country tiles; if the specific language requested is not supported for the tile set, then the default language for that tileset will be used.

#### `region`: string

Defines the appropriate borders to display, based on geo-political sensitivities. Accepts a region code specified as a two-character ccTLD ('top-level domain') value

#### `mapId`: string

Specifies the identifier for a specific map. The Map ID associates a map with a particular style or feature, and must belong to the same project as the API key used to initialize the map.

#### `markers`: [StaticMapsMarker[]](#staticmapsmarker)

Defines markers that should be visible on the map.

#### `paths`: [StaticMapsPath[]](#staticmapspath)

Defines paths that should be shown on the map.

#### `visible`: [StaticMapsLocation[]](#staticmapslocation)

Specifies one or more locations that should remain visible on the map, though no markers or other indicators will be displayed. Use this parameter to ensure that certain features or map locations are shown on the Maps Static API.

#### `style`: [google.maps.MapTypeStyle[]][gmp-map-type-style]

Defines a custom style to alter the presentation of a specific feature (roads, parks, and other features) of the map. This parameter takes feature and element arguments identifying the features to style, and a set of style operations to apply to the selected features. See [style reference][gmp-style-ref] for more information.

## Digital Signature

:::warning

Please only use URL signing on the server and keep your URL signing secret secure. Do not pass it in any requests, store it on any websites, or post it to any public forum. Anyone obtaining your URL signing secret could spoof requests using your identity.

:::
It is recommended to use a [digital signature][digital-signature] with your Static Maps Api requests.

Digital signatures are generated using a URL signing secret, which is available on the Google Cloud Console. This secret is essentially a private key, only shared between you and Google, and is unique to your project.

The signing process uses an encryption algorithm to combine the URL and your shared secret. The resulting unique signature allows our servers to verify that any site generating requests using your API key is authorized to do so.

- Step 1: [Get your URL signing secret][sign-secret]
- Step 2: Construct an unsigned request with the `createStaticMapUrl` helper.
- Step 3: [Generate the signed request][generate-signed] | [Sample code for URL signing][sample-code]

Google also provides a package [`@googlemaps/url-signature`][url-signature] for URL signing. Another example could look like this. Here in a Next.js environment.

```tsx
import 'server-only';

import {signUrl} from '@googlemaps/url-signature';

export function signStaticMapsUrl(url: string, secret: string): string {
  return signUrl(url, secret).toString();
}
```

When the signing process is setup, you can then [limit the unsigned request][limit-unsigned] to prevent abuse of your api key

## Types

### StaticMapsLocation

Reference: [`google.maps.LatLngLiteral`][gmp-ll]

```tsx
type StaticMapsLocation = google.maps.LatLngLiteral | string;
```

### StaticMapsMarker

- For `color`, `size`, `label` see [marker styles][gmp-marker-styles].
- For `icon`, `anchor` and `scaling` see [custom icons][gmp-custom-icons].

```tsx
type StaticMapsMarker = {
  location: google.maps.LatLngLiteral | string;
  color?: string;
  size?: 'tiny' | 'mid' | 'small';
  label?: string;
  icon?: string;
  anchor?: string;
  scale?: 1 | 2 | 4;
};
```

### StaticMapsPath

For style options see [Path styles][gmp-path-styles].

`coordinates` can either bei an array of locations/addresses or it can be an [encoded polyline][gmp-encoded-polyline]. Note that the encoded polyline needs an `enc:` prefix.

```tsx
type StaticMapsPath = {
  coordinates: Array<google.maps.LatLngLiteral | string> | string;
  weight?: number;
  color?: string;
  fillcolor?: string;
  geodesic?: boolean;
};
```

## Examples

Usage examples for many of the API options can be found [here][usage-examples]

## Source

[`./src/components/static-map`][static-map-source]\
[`./src/libraries/create-static-maps-url/index`][create-static-map-url-source]\
[`./src/libraries/create-static-maps-url/types`][create-static-map-url-types]

[gmp-static-map]: https://developers.google.com/maps/documentation/maps-static
[static-map-source]: https://github.com/visgl/react-google-maps/tree/main/src/components/static-map
[create-static-map-url-source]: https://github.com/visgl/react-google-maps/tree/main/src/libraries/create-static-maps-url/index.ts
[create-static-map-url-types]: https://github.com/visgl/react-google-maps/tree/main/src/libraries/create-static-maps-url/types
[gmp-map-type-id]: https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId
[gmp-ll]: https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngLiteral
[gmp-map-type-style]: https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeStyle
[usage-examples]: https://github.com/visgl/react-google-maps/tree/main/examples/static-map
[get-started]: https://developers.google.com/maps/documentation/maps-static/start
[sign-secret]: https://developers.google.com/maps/documentation/maps-static/digital-signature#get-secret
[gmp-encoded-polyline]: https://developers.google.com/maps/documentation/maps-static/start#EncodedPolylines
[gmp-path-styles]: https://developers.google.com/maps/documentation/maps-static/start#PathStyles
[gmp-marker-styles]: https://developers.google.com/maps/documentation/maps-static/start#MarkerStyles
[gmp-custom-icons]: https://developers.google.com/maps/documentation/maps-static/start#CustomIcons
[limit-unsigned]: https://developers.google.com/maps/documentation/maps-static/digital-signature#limit-unsigned-requests
[url-signature]: https://www.npmjs.com/package/@googlemaps/url-signature
[generate-signed]: https://developers.google.com/maps/documentation/maps-static/digital-signature#generate-signed-request
[sample-code]: https://developers.google.com/maps/documentation/maps-static/digital-signature#sample-code-for-url-signing
[digital-signature]: https://developers.google.com/maps/documentation/maps-static/digital-signature
[gmp-style-ref]: https://developers.google.com/maps/documentation/maps-static/style-reference
