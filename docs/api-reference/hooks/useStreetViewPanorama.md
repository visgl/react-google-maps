# `useStreetViewPanorama` Hook

React hook to use the Google Maps Platform [Street View Panorama](https://developers.google.com/maps/documentation/javascript/streetview) in
any component.

## Usage

The `StreetViewPanorama` can either be used within a DOM element, like a `<div>` element:

```tsx
import React, {useEffect} from 'react';
import {
  useGoogleMap,
  useStreetViewPanorama
} from '@vis.gl/react-google-maps-hooks';

const MyComponent = () => {
  const [divContainer, setDivContainer] = useState<HTMLDivElement | null>(null);

  const divRef = useCallback(
    (node: React.SetStateAction<HTMLDivElement | null>) => {
      node && setDivContainer(node);
    },
    []
  );

  const map = useGoogleMap();

  const position = /** google.maps.LatLng */;
  const pov = /** google.maps.StreetViewPov */;

  const panorama = useStreetViewPanorama({
    divElement: divContainer,
    position,
    pov
  });

  return <div className={styles.pano} ref={divRef} />;
};
```

or can be created on its own to be used by the map:

```tsx
import React, {useEffect} from 'react';
import {
  useGoogleMap,
  useStreetViewPanorama
} from '@vis.gl/react-google-maps-hooks';

const MyComponent = () => {
  const position = /** google.maps.LatLng */;
  const pov = /** google.maps.StreetViewPov */;

  useStreetViewPanorama({
    position,
    pov
  });

  return null;
};
```

## Return value

Returns a [`StreetViewPanorama`](https://developers.google.com/maps/documentation/javascript/reference/street-view#StreetViewPanorama)
instance to use directly.

## Parameters

### StreetViewPanoramaProps

Optional options that can be passed to display a street view
location: [Street View Locations and Point-of-View (POV)](https://developers.google.com/maps/documentation/javascript/streetview#StreetViewLocation).

```TypeScript
interface StreetViewPanoramaProps {
  mapId?: string;
  divElement?: HTMLElement | null;
  position?: google.maps.LatLng | google.maps.LatLngLiteral;
  pov?: google.maps.StreetViewPov;
  zoom?: number;
}
```

The `mapId` needs to be applied when multiple `Map` components are used.
