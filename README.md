# React Components for the Google Maps JavaScript API

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/visgl/react-google-maps/tree/main/LICENSE)

This is a TypeScript / JavaScript library to integrate the Maps JavaScript API
into your React application.
It comes with a collection of React components to create maps, markers and
infowindows, and a set of hooks to use some of the Maps JavaScript API
[Services][gmp-services] and [Libraries][gmp-libraries].

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
[`Marker`][api-marker], [`AdvancedMarker`][api-adv-marker], or
[`InfoWindow`][api-infowindow] to render content on the map.

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
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';

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
