# `<MapControl>` Component

The `MapControl` component can be used to render components into the
control-containers of a map instance.

The Maps JavaScript API uses a custom layout algorithm for map controls.
While you can add your buttons or whatever controls you need on top of
the map canvas, that isn't much of an option when you need to mix built-in
controls with your own controls. In this case adding your controls to
the map is the best option.

See [the official documentation on this topic][gmp-custom-ctrl].

## Usage

You can add as many `MapControl` components as you like to any `Map`, multiple
controls for the same position are possible as well.

```tsx
import {
  APIProvider,
  ControlPosition,
  Map,
  MapControl
} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={'...'}>
    <Map {...mapProps}>
      <MapControl position={ControlPosition.TOP_LEFT}>
        .. any component here will be added to the control-containers of the
        google map instance ..
      </MapControl>
    </Map>
  </APIProvider>
);
```

## Props

### Required

#### `position`: ControlPosition

The position is specified as one of the values of the `ControlPosition` enum, which
is an exact copy of the [`google.maps.ControlPosition`][gmp-ctrl-pos] type.

[gmp-custom-ctrl]: https://developers.google.com/maps/documentation/javascript/controls#CustomControls
[gmp-ctrl-pos]: https://developers.google.com/maps/documentation/javascript/controls#ControlPositioning
