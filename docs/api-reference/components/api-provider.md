# `<APIProvider>` Component

The `<APIProvider/>` is a component to load the Google Maps JavaScript API. It can wrap any other React component that consumes the API. It must wrap the Google Maps React components like the `<Map>`.

## Usage

It can be used to load libraries that will be consumed by any other component

```tsx
import React, {FunctionComponent} from 'react';
import {APIProvider} from '@vis.gl/react-google-maps-components';

const App: FunctionComponent<Record<string, unknown>> = () => (
  <APIProvider apiKey={'Your API key here'} libraries={['places']}>
    <AnyComponentUsingPlaces />
  </APIProvider>
);
export default App;
```

and should always wrap the `<Map>` component and its children.

```tsx
import React, {FunctionComponent} from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps-components';

const App: FunctionComponent<Record<string, unknown>> = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map zoom={10} center={{lat: 53.54992, lng: 10.00678}} />
  </APIProvider>
);
export default App;
```

## Props

The `<APIProvider>` comes along with different options to apply.

```tsx
interface APIProviderProps extends APILoadingOptions {
  onLoad?: () => void;
}
```

```tsx
interface APILoadingOptions {
  apiKey: string;
  libraries?: Array<string>;
  version?: string;
  region?: string;
  language?: string;
  authReferrerPolicy?: string;
}
```

The API key is obligatory to load the Google Maps JavaScript API. All other properties are optional and similar to the [Maps JavaScript API URL Parameters](https://developers.google.com/maps/documentation/javascript/url-params).
