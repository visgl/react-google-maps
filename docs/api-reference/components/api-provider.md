# `<APIProvider>` Component

The `APIProvider` is our component to load the Google Maps JavaScript API.

This component can be added at any level of the application (typically somewhere
at the top), and it will render all child components unmodified.

Besides handling the loading of the Maps JavaScript API, it also provides context
information and functions for the other components and hooks of this library.

> **Please Note:** since the Maps JavaScript API can only be loaded once, and
> settings like the language and region cannot be changed after loading, it is
> important to make sure the props are specified with their final values when
> the APIProvider component is rendered. Changing these props after the first
> render will in most cases have no effect, cause an error, or both.

The `APIProvider` only needs the [Google Maps API Key][gmp-api-keys] to function.
This has to be provided via the `apiKey` prop:

```tsx title="app.jsx"
import React from 'react';
import {APIProvider} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    {/* ... any components ... */}
  </APIProvider>
);
export default App;
```

## Props

The props are based on [the parameters][gmp-params] available for the
'Dynamic Library Import' API which we are using under the hood.

> Note that most of the props below are marked with 'first-render only',
> which refers to the fact that these can only be specified on
> first render, later changes to the values will have no effect.

### Required

#### `apiKey`: string (required, first-render only) {#apiKey}

The API Key for the Maps JavaScript API.

### Optional

#### `version`: string (first-render only) {#version}

The [version][gmp-api-version] to load (defaults to `weekly`).

#### `region`: string (first-render only) {#region}

The [region code][gmp-region] to use. This alters the map's behavior based on a
given country or territory. Quoting [the official docs][gmp-region]:

> As the developer of a Maps JavaScript API application, you are encouraged
> to always set a region parameter as various services (such as Places
> Autocomplete) tend to provide better results when the region is set.
>
> It is also your responsibility to ensure that your application complies with
> local laws by ensuring that the correct region localization is applied for the
> country in which the application is hosted.

#### `language`: string (first-render only) {#language}

The language to use.
This affects all text-content on the map, and the responses to service requests.
The default value is determined per user based on HTTP-headers sent by the Browser.

#### `authReferrerPolicy`: string (first-render only) {#authReferrerPolicy}

If your API key is configured for an entire subdomain,
you can set `authReferrerPolicy: "origin"` to limit the amount of data sent
when authorizing requests from the Maps JavaScript API.

#### `libraries`: string[] {#libraries}

A list of [libraries][gmp-libs] to load immediately
(libraries can also be loaded later with the `useMapsLibrary` hook).

#### `onLoad`: () => void {#onLoad}

a callback that is called once the Maps JavaScript
API finished loading.

## Context

The APIProvider creates a context value `APIProviderContext` to be used by
the hooks and components in this library.
The context contains functions and data needed to register and retrieve
map-instances, libraries and the loading-status.

:::note

Client code should never need to interact with the context directly, always
use the corresponding hooks instead.
If you feel like you need to directly access the context, please file a
bug report about this.

:::

## Hooks

The following hooks are built to work with the `APIProvider` Component:

- [`useApiIsLoaded()`](../hooks/use-api-is-loaded.md) and [`useApiLoadingState()`](../hooks/use-api-loading-status.md) to check the current loading state of the API.
- [`useMapsLibrary()`](../hooks/use-maps-library.md) to load additional [Maps Libraries][gmp-libs].

## Source

[`src/components/api-provider.tsx`][api-provider-src].

[gmp-api-keys]: https://developers.google.com/maps/documentation/javascript/get-api-key
[gmp-params]: https://developers.google.com/maps/documentation/javascript/load-maps-js-api#required_parameters
[gmp-api-version]: https://developers.google.com/maps/documentation/javascript/versions
[gmp-libs]: https://developers.google.com/maps/documentation/javascript/libraries
[gmp-region]: https://developers.google.com/maps/documentation/javascript/localization#Region
[gmp-lang]: https://developers.google.com/maps/documentation/javascript/localization
[api-provider-src]: https://github.com/visgl/react-google-maps/blob/main/src/components/api-provider.tsx
