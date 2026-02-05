# `useMap3D` Hook

The `useMap3D()` hook can be used to directly access the
[`google.maps.maps3d.Map3DElement`][gmp-map-3d-ref] instance created by a
[`Map3D`](../components/map-3d.md) component within the
[`APIProvider`](../components/api-provider.md) in your application.

## Usage

When there is only a single map within the `APIProvider`, the `useMap3D()`
hook can be called without any arguments and the `Map3D` doesn't need an id.

The same is true for components that are added as a child to the `Map3D`
component.

```tsx
const MyComponent = () => {
  const map3d = useMap3D();

  useEffect(() => {
    if (!map3d) return;

    // do something with the map3d instance
  }, [map3d]);

  return <>...</>;
};

const App = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <Map3D
        defaultCenter={{lat: 37.7749, lng: -122.4194, altitude: 500}}
        defaultRange={2000}>
        <MyComponent />
      </Map3D>
    </APIProvider>
  );
};
```

When there are multiple `Map3D` components in the `APIProvider`, they are only
retrievable using the `useMap3D()` hook when the hook is either called from a
child-component of a `Map3D` or when an explicit id is specified on both the
map and as a parameter of the `useMap3D()` hook.

```tsx
const MyComponent = () => {
  const mainMap = useMap3D('main-map');
  const miniMap = useMap3D('mini-map');

  useEffect(() => {
    if (!mainMap || !miniMap) return;

    // do something with both map instances
  }, [mainMap, miniMap]);

  return <>...</>;
};

const App = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <Map3D
        id="main-map"
        defaultCenter={{lat: 37.7749, lng: -122.4194, altitude: 500}}
        defaultRange={2000}
      />
      <Map3D
        id="mini-map"
        defaultCenter={{lat: 40.7128, lng: -74.006, altitude: 500}}
        defaultRange={5000}
      />
      <MyComponent />
    </APIProvider>
  );
};
```

### Using with Camera Animations

A common use case is triggering camera animations from child components:

```tsx
const CameraControls = () => {
  const map3d = useMap3D();

  const handleFlyAround = () => {
    if (!map3d) return;

    // Cast to access animation methods
    const map3dWithAnimations = map3d as google.maps.maps3d.Map3DElement & {
      flyCameraAround: (
        options: google.maps.maps3d.FlyAroundAnimationOptions
      ) => void;
      flyCameraTo: (options: google.maps.maps3d.FlyToAnimationOptions) => void;
      stopCameraAnimation: () => void;
    };

    map3dWithAnimations.flyCameraAround({
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

  return <button onClick={handleFlyAround}>Fly Around</button>;
};
```

:::tip

For camera animations, consider using the [`Map3DRef`](../components/map-3d.md#ref-handle)
exposed via `useRef` on the `Map3D` component instead, which provides
typed access to animation methods without casting.

:::

### Accessing Map Properties

You can read the current camera state and other map properties:

```tsx
const CameraInfo = () => {
  const map3d = useMap3D();
  const [cameraState, setCameraState] = useState<string>('');

  useEffect(() => {
    if (!map3d) return;

    const updateState = () => {
      setCameraState(
        `Center: ${JSON.stringify(map3d.center)}, ` +
          `Range: ${map3d.range}, ` +
          `Heading: ${map3d.heading}`
      );
    };

    map3d.addEventListener('gmp-centerchange', updateState);
    updateState();

    return () => {
      map3d.removeEventListener('gmp-centerchange', updateState);
    };
  }, [map3d]);

  return <div>{cameraState}</div>;
};
```

## Signature

`useMap3D(id?: string): google.maps.maps3d.Map3DElement | null`

Returns the `google.maps.maps3d.Map3DElement` instance or `null` if it can't
be found.

The returned map3d instance is determined as follows:

- If an `id` is specified, the map with that `id` is retrieved from the
  `APIProviderContext`.
  If that can't be found, return `null`.
- When no `id` is specified
  - If there is a parent map3d instance, return it
  - Otherwise, return the map3d with id `default` (maps without the `id` prop
    are registered with id `default`).

### Parameters

#### `id`: string (optional)

The id of the map3d instance to be returned. If not specified it will return
the parent map3d instance, or the default map3d instance if there is no parent.

## Source

[`src/hooks/use-map-3d.ts`][src]

[src]: https://github.com/visgl/react-google-maps/blob/main/src/hooks/use-map-3d.ts
[gmp-map-3d-ref]: https://developers.google.com/maps/documentation/javascript/reference/3d-map#Map3DElement
