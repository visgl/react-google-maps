# `<Map3D>` Component

React component to render a [3D Map][gmp-map-3d] using the Google Maps JavaScript API.
It must be placed as a child inside an [`<APIProvider>`][api-provider] container.

The main props to control the camera are `center`, `range`, `heading`, `tilt`,
and `roll`. At minimum, a center position with altitude should be specified
for the map to display properly.

```tsx
import {APIProvider, Map3D} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
    <Map3D
      defaultCenter={{lat: 37.7749, lng: -122.4194, altitude: 1000}}
      defaultRange={5000}
      defaultHeading={0}
      defaultTilt={45}
    />
  </APIProvider>
);
```

:::note

By default, the Map3D component uses a default style of `width: 100%; height: 100%;`
for the container element, assuming that the parent element will establish a size
for the map. If that doesn't work in your case, you can adjust the styling using
the [`style`](#style-reactcssproperties) and [`className`](#classname-string) props.

:::

## Controlled and Uncontrolled Props

The props controlling the camera parameters (center, range, heading, tilt, and roll)
can all be specified via controlled or uncontrolled values. For example, the center
of the map can be specified via either `center` or `defaultCenter`. This can even
be mixed for different parameters.

As is the case with React form elements, the default values will only be applied
when the map is first initialized, while the regular parameters will keep the map
synchronized with the specified values.

```tsx
const UncontrolledMap3D = () => {
  return (
    <Map3D
      defaultCenter={{lat: 37.7749, lng: -122.4194, altitude: 500}}
      defaultRange={2000}
      defaultHeading={0}
      defaultTilt={60}
    />
  );
};
```

When controlled props are used, the map will reflect the values specified for
the camera parameters. When interactions occur, the new camera parameters will
be published with a `cameraChanged` event and the application can use them to
update the props.

```tsx
import {Map3DCameraChangedEvent} from '@vis.gl/react-google-maps';

const INITIAL_CAMERA = {
  center: {lat: 37.7749, lng: -122.4194, altitude: 500},
  range: 2000,
  heading: 0,
  tilt: 60
};

const ControlledMap3D = () => {
  const [center, setCenter] = useState(INITIAL_CAMERA.center);
  const [range, setRange] = useState(INITIAL_CAMERA.range);
  const [heading, setHeading] = useState(INITIAL_CAMERA.heading);
  const [tilt, setTilt] = useState(INITIAL_CAMERA.tilt);

  const handleCameraChange = useCallback((ev: Map3DCameraChangedEvent) => {
    setCenter(ev.detail.center);
    setRange(ev.detail.range);
    setHeading(ev.detail.heading);
    setTilt(ev.detail.tilt);
  }, []);

  return (
    <Map3D
      center={center}
      range={range}
      heading={heading}
      tilt={tilt}
      onCameraChanged={handleCameraChange}
    />
  );
};
```

## Camera Animations

The Map3D component exposes imperative methods for camera animations via a ref.
These include `flyCameraAround` for orbiting animations and `flyCameraTo` for
flying to a destination.

```tsx
import {Map3D, Map3DRef} from '@vis.gl/react-google-maps';

const AnimatedMap = () => {
  const map3dRef = useRef<Map3DRef>(null);

  const handleFlyAround = () => {
    map3dRef.current?.flyCameraAround({
      camera: {
        center: {lat: 37.7749, lng: -122.4194, altitude: 0},
        range: 1000,
        heading: 0,
        tilt: 60
      },
      durationMillis: 10000,
      repeatCount: 1
    });
  };

  const handleFlyTo = () => {
    map3dRef.current?.flyCameraTo({
      endCamera: {
        center: {lat: 37.8199, lng: -122.4783, altitude: 100},
        range: 1000,
        heading: 45,
        tilt: 65
      },
      durationMillis: 5000
    });
  };

  return (
    <>
      <Map3D ref={map3dRef} {...cameraProps} />
      <button onClick={handleFlyAround}>Fly Around</button>
      <button onClick={handleFlyTo}>Fly To Golden Gate</button>
    </>
  );
};
```

## Props

The `Map3DProps` type extends [`google.maps.maps3d.Map3DElementOptions`][gmp-map-3d-options]
and includes all possible options available for a 3D map as props.

### General Props

#### `id`: string

A string that identifies the map component. This is required when multiple
maps are present in the same APIProvider context to be able to access them
using the [`useMap3D()`](../hooks/use-map-3d.md) hook.

#### `mode`: MapMode

Specifies how the 3D map should be rendered. Can be `'HYBRID'` or `'SATELLITE'`,
or use the `MapMode` constants.

```tsx
import {Map3D, MapMode} from '@vis.gl/react-google-maps';

<Map3D mode={MapMode.SATELLITE} {...otherProps} />;
```

- **`HYBRID`**: Displays a transparent layer of major streets on satellite imagery.
- **`SATELLITE`**: Displays satellite or photorealistic imagery.

#### `gestureHandling`: GestureHandling

Specifies how gesture events should be handled on the map.

```tsx
import {Map3D, GestureHandling} from '@vis.gl/react-google-maps';

<Map3D gestureHandling={GestureHandling.GREEDY} {...otherProps} />;
```

- **`AUTO`**: Lets the map choose the gesture handling mode (default).
- **`COOPERATIVE`**: Requires modifier keys or two-finger gestures to navigate.
- **`GREEDY`**: The map captures all gestures, preventing page scrolling.

#### `style`: React.CSSProperties

Additional style rules to apply to the map container element. By default, this
will contain `{width: '100%', height: '100%'}`.

#### `className`: string

Additional CSS class name to apply to the element containing the map.
When a className is specified, the default width and height from the style prop
are no longer applied.

### Camera Control

#### `center`: google.maps.LatLngAltitudeLiteral

Coordinates for the center of the map, including altitude.

```tsx
<Map3D center={{lat: 37.7749, lng: -122.4194, altitude: 500}} />
```

#### `range`: number

The distance from the camera to the center point in meters.

#### `heading`: number

The heading of the camera in degrees, measured clockwise from north.

#### `tilt`: number

The angle of the camera in degrees from the nadir (straight down).
A value of 0 looks straight down, while 90 would look at the horizon.

#### `roll`: number

The roll of the camera in degrees.

#### `defaultCenter`, `defaultRange`, `defaultHeading`, `defaultTilt`, `defaultRoll`

The initial state of the camera. These can be used to leave the map component
in uncontrolled mode. When both a default value and a controlled value are
present for a parameter, the controlled value takes precedence.

### Map Options

#### `bounds`: google.maps.LatLngBoundsLiteral

The bounds to constrain the camera within.

#### `defaultLabelsDisabled`: boolean

Whether to disable default labels on the map.

#### `maxAltitude`: number

The maximum altitude the camera can reach in meters.

#### `minAltitude`: number

The minimum altitude the camera can reach in meters.

#### `maxHeading`: number

The maximum heading value allowed.

#### `minHeading`: number

The minimum heading value allowed.

#### `maxTilt`: number

The maximum tilt value allowed.

#### `minTilt`: number

The minimum tilt value allowed.

### Events

The Map3D component supports events emitted by the `google.maps.maps3d.Map3DElement`.

```tsx
const MapWithEventHandler = () => {
  const handleCameraChange = useCallback((ev: Map3DCameraChangedEvent) => {
    console.log('camera changed:', ev.detail);
  }, []);

  return <Map3D onCameraChanged={handleCameraChange} {...otherProps} />;
};
```

#### Event Props

| Event Prop         | Description                                   | Event Type                |
| ------------------ | --------------------------------------------- | ------------------------- |
| `onCameraChanged`  | Fired when any camera parameter changes       | `Map3DCameraChangedEvent` |
| `onCenterChanged`  | Fired when the center changes                 | `Map3DCameraChangedEvent` |
| `onHeadingChanged` | Fired when the heading changes                | `Map3DCameraChangedEvent` |
| `onTiltChanged`    | Fired when the tilt changes                   | `Map3DCameraChangedEvent` |
| `onRangeChanged`   | Fired when the range changes                  | `Map3DCameraChangedEvent` |
| `onRollChanged`    | Fired when the roll changes                   | `Map3DCameraChangedEvent` |
| `onClick`          | Fired when the map is clicked                 | `Map3DClickEvent`         |
| `onSteadyChange`   | Fired when the map becomes steady or unsteady | `Map3DSteadyChangeEvent`  |
| `onAnimationEnd`   | Fired when a camera animation ends            | `Map3DEvent`              |
| `onError`          | Fired when an error occurs                    | `Map3DEvent`              |

#### Event Details

**`Map3DCameraChangedEvent`** contains:

- **`center`**: The current center position with altitude
- **`range`**: The current range in meters
- **`heading`**: The current heading in degrees
- **`tilt`**: The current tilt in degrees
- **`roll`**: The current roll in degrees

**`Map3DClickEvent`** contains:

- **`position`**: The geographic position of the click with altitude

## Ref Handle

The Map3D component exposes a ref handle with the following properties and methods:

```tsx
interface Map3DRef {
  /** The underlying Map3DElement instance. */
  map3d: google.maps.maps3d.Map3DElement | null;
  /** Fly the camera around a center point. */
  flyCameraAround: (
    options: google.maps.maps3d.FlyAroundAnimationOptions
  ) => void;
  /** Fly the camera to a destination. */
  flyCameraTo: (options: google.maps.maps3d.FlyToAnimationOptions) => void;
  /** Stop any ongoing camera animation. */
  stopCameraAnimation: () => void;
}
```

## Context

The Map3D component creates a `GoogleMaps3DContext` to be used by child components
like [`<Marker3D>`](./marker-3d.md), containing a reference to the
`google.maps.maps3d.Map3DElement` instance.

## Hooks

You can use the [`useMap3D()`](../hooks/use-map-3d.md) hook in child components
to get access to the `google.maps.maps3d.Map3DElement` rendered by the `<Map3D>`
component.

## Source

[`./src/components/map-3d`][map-3d-source]

[gmp-map-3d]: https://developers.google.com/maps/documentation/javascript/3d-maps-overview
[gmp-map-3d-options]: https://developers.google.com/maps/documentation/javascript/reference/3d-map#Map3DElementOptions
[api-provider]: ./api-provider.md
[map-3d-source]: https://github.com/visgl/react-google-maps/tree/main/src/components/map-3d
