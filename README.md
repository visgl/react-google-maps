> [!IMPORTANT]
> This project is still in it's alpha phase.
>
> When using it be aware that things may not yet work as expected and can
> break at any point. Releases happen often, so when you experience problems,
> make sure you are using the latest version (check with `npm outdated` in
> your project) before opening an issue.
>
> We are still in a phase where we can easily make bigger changes, so we ask
> you to please [provide feedback](https://github.com/visgl/react-google-maps/issues/new)
> on everything you notice - including, but not limited to
>
> - developer experience (installation, typings, sourcemaps, framework integration, ...)
> - hard to understand concepts and APIs
> - wrong, missing, outdated or inaccurate documentation
> - use-cases not covered by the API
> - missing features
> - and of course any bugs you encounter
>
> Also, feel free to use [GitHub discussions](https://github.com/visgl/react-google-maps/discussions) to ask questions or start a new
> discussion.

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

_(PowerShell users: since `@` has a special meaning in PowerShell, the
package name has to be quoted)_

## Usage

Import the [`APIProvider`][api-provider] and wrap it around all components that should have
access to the Google Maps API.
Any component within the context of the `APIProvider` can use the hooks and
components provided by this library.

To render a simple map, add a [`Map`][api-map] component inside the `APIProvider`.
Within the `Map` component, you can then add further components like
[`Marker`][api-marker], [`AdvancedMarker`][api-adv-marker], or
[`InfoWindow`][api-infowindow] to render content on the map.

For more advanced use-cases you can even add your own components to the map
that make use of `google.maps.OverlayView` or `google.maps.WebGlOverlayView`.

```tsx
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

function App() {
  const position = {lat: 53.54992, lng: 10.00678};

  return (
    <APIProvider apiKey={'YOUR API KEY HERE'}>
      <Map center={position} zoom={10}>
        <Marker position={position} />
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

For example, if you want to use the `google.maps.places.PlacesService` class in
your component, you can implement it like this:

```tsx
import {useMapsLibrary} from '@vis.gl/react-google-maps';

const MyComponent = () => {
  // triggers loading the places library and returns true once complete (the
  // component calling the hook gets automatically re-rendered when this is
  // the case)
  const placesLib = useMapsLibrary('places');
  const [placesService, setPlacesService] = useState(null);

  useEffect(() => {
    if (!placesLib) return;

    setPlacesService(new placesLib.PlacesService());
  }, [placesLib]);

  useEffect(() => {
    if (!placesService) return;

    // ...use placesService...
  }, [placesService]);

  return <></>;
};
```

## Examples

Explore our [examples directory on GitHub](./examples) or the
[examples on our website][examples] for full implementation examples.

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
