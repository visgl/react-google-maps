# `<Map>` Component

React component to render a [Google Map][gmp-map]. It can be placed as a child
into any other component, but it has to be somewhere inside an
[`<APIProvider>`][api-provider] container.

The main props to control are the camera parameters – `center`,
`zoom`, `heading` and `tilt`. At least the center and zoom props have to be
specified for the map to be shown.

```tsx
import {APIProvider, Map} from '@vis.gl/react-google-maps';

const App = () => (
  <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
    <Map zoom={10} center={{lat: 53.54992, lng: 10.00678}} />
  </APIProvider>
);
```

## Controlled and Uncontrolled modes

The map can operate in three different modes: uncontrolled mode, controlled
mode, (both very similar to form-elements in React), and externally
controlled mode.

### Uncontrolled mode

The simplest mode can be used if there is no need
for much integration of the map with the rest of your application.
In this mode, the map just receives the `initialCameraProps` and allows
full user-control after that.

In this mode (i.e., as long as `initialCameraProps` is present in the props),
the other camera props will be ignored completely.

```tsx
const INITIAL_CAMERA = {
  center: {lat: 40.7, lng: -74},
  zoom: 12
};

const UncontrolledMap = () => {
  return <Map initialCameraProps={INITIAL_CAMERA}></Map>;
};
```

### Controlled mode

In this mode, the map will always exactly reflect the
values specified for the camera parameters. When interactions occur, the new
camera parameters will be published with a `cameraChanged` event and the
application can use them to update the values passed to the props of the map.

```tsx
import {MapCameraChangedEvent, MapCameraProps} from '@vis.gl/react-google-maps';

const INITIAL_CAMERA = {
  center: {lat: 40.7, lng: -74},
  zoom: 12
};

const ControlledMap = () => {
  const [cameraProps, setCameraProps] =
    useState<MapCameraProps>(INITIAL_CAMERA);
  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) =>
    setCameraProps(ev.detail)
  );

  return <Map {...cameraProps} onCameraChanged={handleCameraChange}></Map>;
};
```

In addition to this, there is also the **externally controlled mode**,
enabled by the [`controlled` prop](#controlled-boolean). When this mode is
active, the map will disable all control inputs and will reject to render
anything not specified in the camera props.

## Props

The `MapProps` type extends the [`google.maps.MapOptions` interface]
[gmp-map-options] and includes all possible options available for a Google 
Map as props.

The most important of these options are also listed below along with the
properties added for the react-library.

:::note

When specifying the props, the classes provided by the Google
Maps API (like `google.maps.LatLng` or `google.maps.LatLngBounds`) cannot
be used, since the API will only be available after the initial
creation of the React components takes place. Instead, the
corresponding literal types (`google.maps.LatLngLiteral` or
`google.maps.LatLngBoundsLiteral`) have to be used.

:::

### Required

The map doesn't have any strictly required props, but center and zoom-level have
to be provided in some way for the map to render. This can be done

- by specifying both the `center` and `zoom` props,
- by specifying the `initialCameraProps` prop with `center` and `zoom`,
- or by specifying the map-region to be shown with the `initialBounds` prop.

### General Props

#### `id`: string

A string that identifies the map component. This is required when multiple
maps are present in the same APIProvider context to be able to access them using the
[`useMap`](../hooks/use-map.md) hook.

#### `style`: React.CSSProperties

Additional style rules to apply to the map dom-element. By default, this will
only contain `{width: '100%', height: '100%'}`.

#### `className`: string

Additional css class-name to apply to the element containing the map.
When a classname is specified, the default height of the map from the
style-prop is no longer applied.

### Camera Control

#### `center`: [google.maps.LatLngLiteral][gmp-ll]

Coordinates for the center of the map.

The Google Maps API Documentation [has some more information on this topic]
[gmp-coordinates].

#### `zoom`: number

The initial resolution at which to display the map.
The values range from 0 to 22, the level of detail for different zoom-levels
is approximately:

- `1`: Entire World
- `5`: Landmass/continent
- `10`: City
- `15`: Streets
- `20`: Buildings

#### `heading`: number

The heading of the map in degrees, measured clockwise from cardinal direction
North.

#### `tilt`: number

For vector maps, sets the angle of incidence for the map, in degrees from the
viewport plane to the map plane. A value of 0

The allowed values are restricted depending on the zoom level of the map:

- for zoom-levels below 10, the maximum value is 30,
- for zoom above 15.5, the maximum value is 67.5
- between 10 and 15.5, it is a piecewise linear interpolation
  ([see here][get-max-tilt] for details)

#### `initialCameraProps`: MapCameraProps

The initial state of the camera. This can be specified to leave the map
component in uncontrolled mode. [See above](#uncontrolled-mode) for more
information about the uncontrolled mode. The `MapCameraProps` type is just
an object with the four properties `center`, `zoom`, `heading` and `tilt` as
described above.

#### `initialBounds`: [google.maps.LatLngBoundsLiteral][gmp-llb]

An alternative way to specify the region that should initially be visible on
the map. Has otherwise the same effect as `initialCameraProps`.

#### `controlled`: boolean

This Indicates that the map will be controlled externally. Disables all controls
provided by the map itself.

### Events

The map component supports [all events emitted by the `google.maps.Map`
instance][gmp-map-events] in a React-typical way. Here is an example:

```tsx
const MapWithEventHandler = props => {
  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    console.log('camera changed: ', ev.detail);
  });

  return <Map {...props} onCameraChanged={handleCameraChange}></Map>;
};
```

See [the table below](#mapping-of-google-maps-event-names-to-react-props)
for the full list of props and corresponding prop names.

All event callbacks receive a single argument of type `MapEvent` with the
following properties and methods:

- **`event.type`: string** The Google Maps event type of the event.
- **`event.map`: google.maps.Map** The Map instance that dispatched the event.
- **`event.stoppable`: boolean** Indicates if the event can be stopped in
  the event-handler. This is only the case for the `MapMouseEvent` type.
- **`event.stop()`: () => void** for stoppable events, this will cause the
  event to stop being processed. Other event-types also have this method,
  but it doesn't do anything.
- **`event.domEvent`: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent
  | Event** For a `MapMouseEvent` this contains the original DOM event being
  handled. For other events, this is undefined.

Based on the specific event, there is also additional information in the
**`event.detail`** property:

- **`MapCameraChangedEvent`**
  - **`center`**, **`zoom`**, **`heading`**, **`tilt`** the current
    camera-parameters of the map
  - **`bounds`: google.maps.LatLngBoundsLiteral** the currently
    visible bounding box
- **`MapMouseEvent`** details contain
  - **`latLng`: google.maps.LatLngLiteral | null** the map coordinates of the
    mouse
  - **`placeId`: string | null** when a place marker on the map is clicked,
    this will contain the placeId of the Google Places API for that place.

#### Mapping of Google Maps Event names to React props

| Google Maps Event                 | React Prop                              | Event Type              |
| --------------------------------- | --------------------------------------- | ----------------------- |
| `bounds_changed`                  | `onBoundsChanged` and `onCameraChanged` | `MapCameraChangedEvent` |
| `center_changed`                  | `onCenterChanged`                       | `MapCameraChangedEvent` |
| `zoom_changed`                    | `onZoomChanged`                         | `MapCameraChangedEvent` |
| `heading_changed`                 | `onHeadingChanged`                      | `MapCameraChangedEvent` |
| `tilt_changed`                    | `onTiltChanged`                         | `MapCameraChangedEvent` |
| `projection_changed`              | `onProjectionChanged`                   | `MapCameraChangedEvent` |
| `click`                           | `onClick`                               | `MapMouseEvent`         |
| `contextmenu`                     | `onContextmenu`                         | `MapMouseEvent`         |
| `dblclick`                        | `onDblclick`                            | `MapMouseEvent`         |
| `mousemove`                       | `onMousemove`                           | `MapMouseEvent`         |
| `mouseover`                       | `onMouseover`                           | `MapMouseEvent`         |
| `mouseout`                        | `onMouseout`                            | `MapMouseEvent`         |
| `drag`                            | `onDrag`                                | `MapEvent`              |
| `dragend`                         | `onDragend`                             | `MapEvent`              |
| `dragstart`                       | `onDragstart`                           | `MapEvent`              |
| `idle`                            | `onIdle`                                | `MapEvent`              |
| `isfractionalzoomenabled_changed` | `onIsFractionalZoomEnabledChanged`      | `MapEvent`              |
| `mapcapabilities_changed`         | `onMapCapabilitiesChanged`              | `MapEvent`              |
| `maptypeid_changed`               | `onMapTypeIdChanged`                    | `MapEvent`              |
| `renderingtype_changed`           | `onRenderingTypeChanged`                | `MapEvent`              |
| `tilesloaded`                     | `onTilesLoaded`                         | `MapEvent`              |

## Context

The Map creates a context value `GoogleMapsContext` to be used by the hooks and
components in this library, containing a reference to the `google.maps.Map`
instance.

:::note

Client code should never need to interact with the context directly, always
use the corresponding hooks instead.
If you feel like you need to directly access the context, please file a
bug report about this.

:::

## Hooks

You can use the [`useMap()`](../hooks/use-map.md) hook in other components
to get access to the `google.maps.Map` object rendered in the `<Map>` component.

## Source

[`./src/components/map`][map-source]

[gmp-map]: https://developers.google.com/maps/documentation/javascript/reference/map#Map
[gmp-map-options]: https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
[gmp-map-events]: https://developers.google.com/maps/documentation/javascript/reference/map#Map-Events
[gmp-llb]: https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBoundsLiteral
[gmp-ll]: https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngLiteral
[gmp-coordinates]: https://developers.google.com/maps/documentation/javascript/coordinates
[api-provider]: ./api-provider.md
[get-max-tilt]: https://github.com/visgl/react-google-maps/blob/4319bd3b68c40b9aa9b0ce7f377b52d20e824849/src/libraries/limit-tilt-range.ts#L4-L19
[map-source]: https://github.com/visgl/react-google-maps/tree/main/src/components/map
