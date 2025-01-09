# `<Map>` Component

React component to render a [Google map][gmp-map]. It can be placed as a child
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

:::note

By default, the intrinsic height of a Google map is 0.
To prevent this from causing confusion, the Map component uses a
default-style of `width: 100%; height: 100%;` for the div-element containing
the map, assuming that the parent element will establish a size for the map.
If that doesn't work in your case, you can adjust the styling of the map
container using the [`style`](#style-reactcssproperties) and
[`className`](#classname-string) props.

:::

## Controlled and Uncontrolled Props

The props controlling the camera parameters for the map (center, zoom,
heading and tilt) can all be specified via controlled or uncontrolled values.
For example, the center of the map can be specified via either `center` or
`defaultCenter`. This can even be mixed for the different parameters (for
example, only the zoom value is controlled, while others are free).

As is the case with React form elements, the default-values will only be
applied when the map is first initialized, while the regular parameters will
make sure the map stays synchronized with the value specified.

```tsx
const UncontrolledMap = () => {
  return <Map defaultCenter={{lat: 40.7, lng: -74}} defaultZoom={12}></Map>;
};
```

When only controlled props are used, the map will always exactly reflect the
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

## Map Instance Caching

If your application renders the map on a subpage or otherwise mounts and
unmounts the `Map` component a lot, this can cause new map instances to be
created with every mount of the component. Since the pricing of the Google
Maps JavaScript API is based on map-views (effectively calls to the
`google.maps.Map` constructor), this can quickly cause a problem.

The `Map` component can be configured to re-use already created maps with
the [`reuseMaps`](#reusemaps-boolean) prop.
When enabled, all `Map` components created with the same [`mapId`](#mapid-string),
[`colorScheme`](#colorscheme-googlemapscolorscheme) and
[`renderingType`](#renderingtype-googlemapsrenderingtype) will reuse
previously created instances instead of creating new ones.

:::warning

In the current version, support for map-caching is still a bit experimental, and
there are some known issues when maps are being reused with different sets
of options applied. In most simpler situations, like when showing the very
same component multiple times, it should work fine.

If you experience any problems using this feature, please file a
[bug-report][rgm-new-issue] or [start a discussion][rgm-discussions] on GitHub.

:::

## Props

The `MapProps` type extends the [`google.maps.MapOptions` interface][gmp-map-options]
and includes all possible options available for a Google map as props.

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
- by specifying both the `defaultCenter` and `defaultZoom` props,
- or by specifying the map-region to be shown with the `defaultBounds` prop.

### General Props

:::info

The Maps JavaScript API doesn't allow changing the Map ID, the color scheme
or the rendering-type of a map after it has been created. This isn't the
case for this component. However, the internal `google.maps.Map` instance
has to be recreated when the `mapId`, `colorScheme` or `renderingType` props
are changed, **which will cause additional cost**.

See the [`reuseMaps`](#reusemaps-boolean) prop if your application has to
dynamically switch between multiple Map IDs, color schemes or rendering types.

:::

#### `id`: string

A string that identifies the map component. This is required when multiple
maps are present in the same APIProvider context to be able to access them using the
[`useMap`](../hooks/use-map.md) hook.

#### `mapId`: string

The [Map ID][gmp-mapid] of the map. This is required if you want to make use
of the [Cloud-based maps styling][gmp-map-styling].

#### `colorScheme`: [google.maps.ColorScheme][gmp-color-scheme-type]

The [color-scheme][gmp-color-scheme] to be used by the map. Can be
`'LIGHT'`, `'DARK'`, `'FOLLOW_SYSTEM'` or one of the
`ColorScheme` constants
(`import {ColorScheme} from '@vis.gl/react-google-maps';`).

:::note

Custom styles that use Map IDs only apply to the light color scheme for roadmap map types.

:::

#### `renderingType`: [google.maps.RenderingType][gmp-rendering-type]

The desired rendering type the renderer should use. Can be `'RASTER'` or
`'VECTOR'` or one of the `RenderingType` constants
(`import {RenderingType} from '@vis.gl/react-google-maps';`).

If not set, the cloud configuration for the map ID will determine the
rendering type (if available). Please note that vector maps may not be
available for all devices and browsers, and the map will fall back to a
raster map as needed.

#### `style`: React.CSSProperties

Additional style rules to apply to the map dom-element. By default, this will
only contain `{width: '100%', height: '100%'}`.

#### `className`: string

Additional css class-name to apply to the element containing the map.
When a classname is specified, the default width and height of the map from the
style-prop is no longer applied.

#### `reuseMaps`: boolean

Enable map-instance caching for this component. When caching is enabled,
this component will reuse map instances created with the same `mapId`,
`colorScheme` and `renderingType`.

See also the section [Map Instance Caching](#map-instance-caching) above.

### Camera Control

#### `center`: [google.maps.LatLngLiteral][gmp-ll]

Coordinates for the center of the map.

#### `zoom`: number

The initial resolution at which to display the map.
The values range from 0 to 22, the level of detail for different zoom-levels
is approximately:

- `1`: Entire World
- `5`: Landmass/continent
- `10`: City
- `15`: Streets
- `20`: Buildings

The Maps JavaScript API Documentation [has some more information on this topic][gmp-coordinates].

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

#### `defaultCenter`, `defaultZoom`, `defaultHeading`, `defaultTilt`

The initial state of the camera. This can be used to leave the map
component in uncontrolled mode. When both a default-value and a controlled
value are present for a parameter, the controlled value takes precedence.

#### `defaultBounds`: object

An alternative way to specify the region that should initially be visible on
the map. Has otherwise the same effect as `defaultCenter` and `defaultZoom`.

The `defaultBounds` type is an extension of [google.maps.LatLngBoundsLiteral][gmp-llb]
that can also contain the optional property `padding`: number | [google.maps.Padding][gmp-pad]
that represents padding in pixels for the initial view.
The bounds will be fit in the part of the map that remains after padding is removed.
A number value will yield the same padding on all 4 sides.

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

See [the table below](#mapping-of-maps-javascript-api-event-names-to-react-props)
for the full list of events and corresponding prop names.

All event callbacks receive a single argument of type `MapEvent` with the
following properties and methods:

- **`event.type`: string** The event type of the event from the Maps JavaScript API.
- **`event.map`: google.maps.Map** The map instance that dispatched the event.
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

#### Mapping of Maps JavaScript API Event names to React props

| Google Maps Event                 | React Prop                              | Event Type              |
| --------------------------------- | --------------------------------------- | ----------------------- |
| `bounds_changed`                  | `onBoundsChanged` and `onCameraChanged` | `MapCameraChangedEvent` |
| `center_changed`                  | `onCenterChanged`                       | `MapCameraChangedEvent` |
| `zoom_changed`                    | `onZoomChanged`                         | `MapCameraChangedEvent` |
| `heading_changed`                 | `onHeadingChanged`                      | `MapCameraChangedEvent` |
| `tilt_changed`                    | `onTiltChanged`                         | `MapCameraChangedEvent` |
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
| `projection_changed`              | `onProjectionChanged`                   | `MapEvent`              |
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
[gmp-pad]: https://developers.google.com/maps/documentation/javascript/reference/coordinates#Padding
[gmp-ll]: https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngLiteral
[gmp-coordinates]: https://developers.google.com/maps/documentation/javascript/coordinates
[gmp-color-scheme]: https://developers.google.com/maps/documentation/javascript/mapcolorscheme
[gmp-color-scheme-type]: https://developers.google.com/maps/documentation/javascript/reference/map#ColorScheme
[gmp-mapid]: https://developers.google.com/maps/documentation/get-map-id
[gmp-map-styling]: https://developers.google.com/maps/documentation/javascript/cloud-customization
[gmp-rendering-type]: https://developers.google.com/maps/documentation/javascript/reference/map#RenderingType
[api-provider]: ./api-provider.md
[get-max-tilt]: https://github.com/visgl/react-google-maps/blob/4319bd3b68c40b9aa9b0ce7f377b52d20e824849/src/libraries/limit-tilt-range.ts#L4-L19
[map-source]: https://github.com/visgl/react-google-maps/tree/main/src/components/map
[rgm-new-issue]: https://github.com/visgl/react-google-maps/issues/new/choose
[rgm-discussions]: https://github.com/visgl/react-google-maps/discussions
