# Frameworks and SSR

The main thing to consider when using the library with Server-side Rendering (SSR) or a fullstack framework like Next.js or Remix is to make sure that
the map is excluded from Server-side Rendering since that is not supported by the Google Maps API. We are currently evaluating a solution that would provide basic SSR capabilities via the Static Maps API.

## Next.js

This is how a component in a Next.js (app router) application looks like. Checkout the example [code](https://github.com/visgl/react-google-maps/tree/main/examples/nextjs) on Github or play around with the [demo](https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/nextjs) on Codesandbox.

:::note

The `use client;` statement at the top tells Next.js that
this component should only be rendered on the client.

:::

```tsx
'use client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';

export default function MyMap() {
  return (
    <div className={styles.container}>
      <APIProvider apiKey={'...'}>
        <Map
          mapId={'bf51a910020fa25a'}
          defaultZoom={5}
          defaultCenter={{lat: 53, lng: 10}}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        />
      </APIProvider>
    </div>
  );
}
```

## Remix

Here is the best approach we found to use a map component in a Remix application. Checkout the example [code](https://github.com/visgl/react-google-maps/tree/main/examples/remix) on Github or play around with the [demo](https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/remix) on Codesandbox.

Wrap the map in a `<ClientOnly>` component from the [`remix-utils`](https://github.com/sergiodxa/remix-utils) package for it to be rendered only on the client.

:::note

If you use a fallback and you know the dimensions of your final map, make sure that
the fallback has the same size to prevent layout shifts when the map component loads.

:::

```tsx
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import {ClientOnly} from 'remix-utils/client-only';

export default function MyMap() {
  return (
    <ClientOnly fallback={<MapFallback />}>
      {() => (
        <APIProvider apiKey={'...'}>
          <Map
            mapId={'bf51a910020fa25a'}
            defaultZoom={5}
            defaultCenter={{lat: 53, lng: 10}}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          />
        </APIProvider>
      )}
    </ClientOnly>
  );
}
```
