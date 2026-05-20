# React Components for the Google Maps JavaScript API

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/visgl/react-google-maps/tree/main/LICENSE)

This is a TypeScript / JavaScript library to integrate the Maps JavaScript API
into your React application.
It comes with a collection of React components to create maps, markers,
infowindows, geometry overlays (circles, polylines, polygons), and
photorealistic [3D maps][gmp-maps-3d], as well as a set of hooks to use some
of the Maps JavaScript API [Services][gmp-services] and
[Libraries][gmp-libraries].

## Installation

This library is available on npm as [`@vis.gl/react-google-maps`][npm-package].

```sh
npm install @vis.gl/react-google-maps
```

or

```sh
yarn add @vis.gl/react-google-maps
```

_(PowerShell users: since `@` has a special meaning in PowerShell, the
package name has to be quoted)_

## Usage

Import the [`APIProvider`][api-provider] and wrap it around all components that should have
access to the Maps JavaScript API.
Any component within the context of the `APIProvider` can use the hooks and
components provided by this library.

To render a simple map, add a [`Map`][api-map] component inside the `APIProvider`.
Within the `Map` component, you can then add further components like
[`Marker`][api-marker], [`AdvancedMarker`][api-adv-marker],
[`InfoWindow`][api-infowindow], or geometry components such as
[`Circle`][api-circle], [`Polyline`][api-polyline], and
[`Polygon`][api-polygon] to render content on the map.
For photorealistic 3D maps, use the [`Map3D`][api-map-3d] component instead.

For more advanced use-cases you can even add your own components to the map
that make use of `google.maps.OverlayView` or `google.maps.WebGlOverlayView`.

```tsx
import {AdvancedMarker, APIProvider, Map} from '@vis.gl/react-google-maps';

function App() {
  const position = {lat: 53.54992, lng: 10.00678};

  return (
    <APIProvider apiKey={'YOUR API KEY HERE'}>
      <Map defaultCenter={position} defaultZoom={10} mapId="DEMO_MAP_ID">
        <AdvancedMarker position={position} />
      </Map>
    </APIProvider>
  );
}

export default App;
```

Please see our [documentation][docs] or [examples][] for more in-depth information
about this library.

### Available Components

| Component | Description |
| :--- | :--- |
| [`<APIProvider>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/api-provider) | Loads the Google Maps JavaScript API and provides context. |
| [`<Map>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/map) | Renders a Google Map container and manages the map instance. |
| [`<MapControl>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/map-control) | Renders custom React components in one of the map's control containers. |
| [`<InfoWindow>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/info-window) | Displays a standard Google Maps Info Window overlay. |
| [`<Marker>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/marker) | Displays a legacy Google Maps marker on the map. |
| [`<AdvancedMarker>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/advanced-marker) | Renders a highly customizable modern Advanced Marker. |
| [`<Pin>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/pin) | Customizes the background, border, and glyph colors of an `AdvancedMarker`. |
| [`<Circle>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/circle) | Draws a circle at a given center and radius on the map. |
| [`<Rectangle>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/rectangle) | Draws a rectangular vector boundary on the map. |
| [`<Polyline>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/polyline) | Draws a linear path on the map. |
| [`<Polygon>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/polygon) | Draws a closed polygon boundary on the map. |
| [`<StaticMap>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/static-map) | Renders a lightweight Google Static Maps API image. |
| [`<Map3D>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/map-3d) | Renders a Next-Generation Photorealistic 3D Google Map. |
| [`<Marker3D>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/marker-3d) | Places a 3D object or icon within a `Map3D` view. |
| [`<Popover>`](https://visgl.github.io/react-google-maps/docs/api-reference/components/popover) | Renders an overlay/popup relative to a 3D element or coordinates. |

### Using other libraries of the Maps JavaScript API

Besides rendering maps, the Maps JavaScript API has a lot of
[additional libraries][gmp-libraries] for things like geocoding, routing, the
Places API, Street View, and a lot more.

These libraries are not loaded by default, which is why this module provides
the [`useMapsLibrary()`][api-use-lib] hook to handle dynamic loading of
additional libraries.

For example, if you just want to use the `google.maps.geocoding.Geocoder` class in
a component and you don't even need a map, it can be implemented like this:

```tsx
import {useMapsLibrary} from '@vis.gl/react-google-maps';

const MyComponent = () => {
  // useMapsLibrary loads the geocoding library, it might initially return `null`
  // if the library hasn't been loaded. Once loaded, it will return the library
  // object as it would be returned by `await google.maps.importLibrary()`
  const geocodingLib = useMapsLibrary('geocoding');
  const geocoder = useMemo(
    () => geocodingLib && new geocodingLib.Geocoder(),
    [geocodingLib]
  );

  useEffect(() => {
    if (!geocoder) return;

    // now you can use `geocoder.geocode(...)` here
  }, [geocoder]);

  return <></>;
};

const App = () => {
  return (
    <APIProvider apiKey={'YOUR API KEY HERE'}>
      <MyComponent />
    </APIProvider>
  );
};
```

### Using Custom Elements of the Maps JavaScript API

The maps JavaScript API also provides a lot of custom elements like the
[Places UI Kit][gmp-places-ui-kit] or the [Maps 3D][gmp-maps-3d] elements.
This library provides the types needed to use these custom elements in a
TypeScript / React application.

```tsx
import {useMapsLibrary} from '@vis.gl/react-google-maps';

const My3DMap = (props: My3DMapProps) => {
  useMapsLibrary('maps3d');

  const {center, heading, tilt, range, roll} = props;

  return (
    <>
      <gmp-map-3d
        center={center}
        range={range}
        heading={heading}
        tilt={tilt}
        roll={roll}
        mode="SATELLITE"></gmp-map-3d>
    </>
  );
};
```
### Available Custom Elements

| Custom Element | Description |
| :--- | :--- |
| [`<gmp-map>`](https://developers.google.com/maps/documentation/javascript/reference/map#MapElement) | The native, web-component-based core 2D vector or raster map element. |
| [`<gmp-map-3d>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#Map3DElement) | The foundational web component initializing Google's photorealistic 3D globe view. |
| [`<gmp-flattener>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#FlattenerElement) | Flattens a designated region of the 3D terrain mesh for clean placement of shapes or markers. |
| [`<gmp-popover>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#PopoverElement) | An info-window style popup interface container optimized for positioning inside 3D viewports. |
| [`<gmp-advanced-marker>`](https://developers.google.com/maps/documentation/javascript/reference/marker#AdvancedMarkerElement) | A highly performance-optimized 2D map marker backing custom HTML, asset styling, and pin configurations. |
| [`<gmp-marker>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#MarkerElement) | A standard billboard/sprite point asset mapped specifically within a 3D globe environment. |
| [`<gmp-marker-interactive>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#MarkerInteractiveElement) | An interactive variation of the standard 3D map marker designed to handle user click events and trigger popovers. |
| [`<gmp-marker-3d>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DElement) | A volumetric, structural 3D point graphic supporting model scaling, extrusion, and altitude configurations. |
| [`<gmp-marker-3d-interactive>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DInteractiveElement) | An interactive version of the 3D volumetric point graphic that responds to pointer inputs. |
| [`<gmp-model-3d>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#Model3DElement) | Renders and animates photorealistic native 3D mesh assets (such as glTF models) directly onto map coordinates. |
| [`<gmp-model-3d-interactive>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#Model3DInteractiveElement) | An interactive version of the native 3D mesh wrapper enabling pointer events directly on the object surface. |
| [`<gmp-polyline-3d>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polyline3DElement) | Draws continuous multi-segment line paths across 3D spaces, complete with altitude properties and occlusion toggles. |
| [`<gmp-polyline-3d-interactive>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polyline3DInteractiveElement) | An interactive line-string path that listens for clicks and user interactions within the 3D view. |
| [`<gmp-polygon-3d>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polygon3DElement) | Defines multi-coordinate geometric shapes and boundaries supporting geometric fills and extrusion on the 3D globe. |
| [`<gmp-polygon-3d-interactive>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polygon3DInteractiveElement) | An interactive geometric area overlay allowing users to trigger events by interacting with the 3D polygon. |
| [`<gmp-circle-path>`](https://developers.google.com/maps/documentation/javascript/reference/3d-map#CirclePathElement) | Generates and draws procedural circular spline layout paths mapped cleanly within 3D environments. |
| [`<gmp-route-3d>`](https://developers.google.com/maps/documentation/javascript/reference/routes-elements#Route3DElement) | Overlays and visualizes complex directional pathways, multi-modal steps, and routing telemetry on 3D viewports. |
| [`<gmp-air-quality-meter>`](https://developers.google.com/maps/documentation/javascript/reference/air-quality#AirQualityMeterElement) | An environmental monitoring panel displaying localized real-time air safety indices and language-localized parameters. |
| [`<gmp-place-autocomplete>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceAutocompleteElement) | A rich UI text input component packing fully automated address lookups and drop-down prediction items. |
| [`<gmp-basic-place-autocomplete>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#BasicPlaceAutocompleteElement) | A streamlined, lightweight variant of the predictive place autocomplete input widget. |
| [`<gmp-place-search>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceSearchElement) | A dynamic local directory UI component that outputs and arranges keyword and vicinity query listings. |
| [`<gmp-place-details>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsElement) | A dense, modular location profile card showing media, business stats, scheduling charts, and contact datasets. Layout block styling and structure can be fine-tuned internally using individual child components. |
| [`<gmp-place-details-compact>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement) | A responsive, space-conscious version of the comprehensive details card tailored for mobile viewports and tooltips. |
| [`<gmp-place-details-place-request>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsPlaceRequestElement) | An API context bridge element used inside a details panel to tie lookups to an explicit programmatic Google Place ID. |
| [`<gmp-place-details-location-request>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsLocationRequestElement) | An API context bridge element used inside a details panel to tie lookups to explicit latitude/longitude coordinates. |
| [`<gmp-place-contextual>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceContextualElement) | Handles the presentation of embedded context layers and metadata driven by localized contextual token validation. |
| [`<gmp-place-contextual-list-config>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceContextualListConfigElement) | Exposes layout configuration rules to change styling distributions and list configurations of local context sheets. |
| [`<gmp-place-nearby-search-request>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceNearbySearchRequestElement) | A declarative widget component used to trigger and configure vicinity-focused radial place queries. |
| [`<gmp-place-text-search-request>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceTextSearchRequestElement) | A declarative widget component used to structure and trigger string/text-based global search parameters. |


## Examples

Explore our [examples directory on GitHub](./examples) or the
[examples on our website][examples] for full implementation examples.

## Supported Browsers

Being a library built around the Google Maps JavaScript API, we follow the
same browser-support policy as the Google Maps Team,
[available here][gmp-browsersupport].
Generally, the last two versions of the major browsers are officially supported.

It is not unlikely that browsers even far outside the given
range will still work. We try our best to support as many browsers and
versions as reasonably possible, but we won't actively investigate issues
related to outdated browser versions.

However, if you can suggest small changes that could be made to even
increase that range, we will be happy to include them, as long as they don't
negatively affect the supported browsers.

## Terms of Service

`@vis.gl/react-google-maps` uses Google Maps Platform services. Use of Google
Maps Platform services through this library is subject to the
[Google Maps Platform Terms of Service][gmp-tos].

This library is not a Google Maps Platform Core Service.
Therefore, the Google Maps Platform Terms of Service (e.g., Technical
Support Services, Service Level Agreements, and Deprecation Policy)
do not apply to this library.

### European Economic Area (EEA) developers

If your billing address is in the European Economic Area, effective on
8 July 2025, the [Google Maps Platform EEA Terms of Service][gmp-tos-eea]
will apply to your use of the Services. Functionality varies by region.
[Learn more][gmp-tos-eea-faq].

## Help and Support

This library is offered via an open source license. It is not governed by the
Google Maps Platform [Technical Support Services Guidelines][gmp-tssg],
the [SLA][gmp-sla], or the [Deprecation Policy][gmp-dp] (however, any Google
Maps Platform services used by this library remain subject to the Google Maps
Platform Terms of Service).

If you find a bug or have a feature request, please [file an issue][rgm-issues]
on GitHub. If you would like to get answers to technical questions from
other Google Maps Platform developers, feel free to open a thread in the
[discussions section on GitHub][rgm-discuss] or ask a question through one of
our [developer community channels][gmp-community].

If you'd like to contribute, please check the [Contributing guide][rgm-contrib].

You can also discuss this library on [our Discord server][gmp-discord].

[api-provider]: https://visgl.github.io/react-google-maps/docs/api-reference/components/api-provider
[api-map]: https://visgl.github.io/react-google-maps/docs/api-reference/components/map
[api-marker]: https://visgl.github.io/react-google-maps/docs/api-reference/components/marker
[api-adv-marker]: https://visgl.github.io/react-google-maps/docs/api-reference/components/advanced-marker
[api-infowindow]: https://visgl.github.io/react-google-maps/docs/api-reference/components/info-window
[api-circle]: https://visgl.github.io/react-google-maps/docs/api-reference/components/circle
[api-polyline]: https://visgl.github.io/react-google-maps/docs/api-reference/components/polyline
[api-polygon]: https://visgl.github.io/react-google-maps/docs/api-reference/components/polygon
[api-map-3d]: https://visgl.github.io/react-google-maps/docs/api-reference/components/map-3d
[api-use-lib]: https://visgl.github.io/react-google-maps/docs/api-reference/hooks/use-maps-library
[docs]: https://visgl.github.io/react-google-maps/docs/
[examples]: https://visgl.github.io/react-google-maps/examples
[gmp-services]: https://developers.google.com/maps/documentation/javascript#services
[gmp-libraries]: https://developers.google.com/maps/documentation/javascript/libraries
[npm-package]: https://www.npmjs.com/package/@vis.gl/react-google-maps
[gmp-tos]: https://cloud.google.com/maps-platform/terms
[gmp-tos-eea]: https://cloud.google.com/terms/maps-platform/eea
[gmp-tos-eea-faq]: https://developers.google.com/maps/comms/eea/faq
[gmp-tssg]: https://cloud.google.com/maps-platform/terms/tssg
[gmp-sla]: https://cloud.google.com/maps-platform/terms/sla
[gmp-dp]: https://cloud.google.com/maps-platform/terms/other/deprecation-policy
[rgm-issues]: https://github.com/visgl/react-google-maps/issues
[rgm-discuss]: https://github.com/visgl/react-google-maps/discussions
[rgm-contrib]: https://visgl.github.io/react-google-maps/docs/contributing
[gmp-community]: https://developers.google.com/maps/developer-community
[gmp-discord]: https://discord.gg/f4hvx8Rp2q
[gmp-browsersupport]: https://developers.google.com/maps/documentation/javascript/browsersupport
[gmp-places-ui-kit]: https://developers.google.com/maps/documentation/javascript/places-ui-kit/overview
[gmp-maps-3d]: https://developers.google.com/maps/documentation/javascript/3d/overview
