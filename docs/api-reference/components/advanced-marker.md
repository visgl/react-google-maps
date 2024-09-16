# `<AdvancedMarker>` Component

A component to add an [`AdvancedMarkerElement`][gmp-adv-marker]
to a map. By default, an AdvancedMarker will appear as a balloon-shaped,
red maps-pin at the specified position on the map, but the appearance of the
markers can be fully customized.

:::info

The `AdvancedMarker` can only be used on maps using cloud-based map styling
(i.e. the `Map`-component has a [`mapId`][gmp-mapid] specified).

:::

## Usage

By default, the marker will be rendered as the default red balloon pin.
This can be customized in two ways: by specifying custom colors, an icon and
such via a [`Pin`](./pin.md) component, or by creating the complete marker with
html/css (images, svg, animations are all supported).

For this, the `AdvancedMarker` component optionally accepts child components that
will be rendered instead of the default pin-element on the map, making it
possible to create simple labels and infowindows with it.

```tsx
import {AdvancedMarker} from './advanced-marker';

<Map {...mapProps}>
  {/* red default marker */}
  <AdvancedMarker position={{lat: 29.5, lng: -81.2}} />

  {/* customized green marker */}
  <AdvancedMarker position={{lat: 29.5, lng: -81.2}}>
    <Pin
      background={'#0f9d58'}
      borderColor={'#006425'}
      glyphColor={'#60d98f'}
    />
  </AdvancedMarker>

  {/* fully customized marker */}
  <AdvancedMarker position={{lat: 29.5, lng: -81.2}}>
    <img src={markerImage} width={32} height={32} />
  </AdvancedMarker>
</Map>;
```

When anything other than a `Pin` component is specified for the marker, a
div element (the "content element") will be created and the children will be
rendered into that content element via a [portal][react-portal]. The `style`
and `className` props can be used to configure the styling of this content
element.

:::tip

When custom html is specified, the marker will be positioned such that the
`position` on the map is at the bottom center of the content-element.
If you need it positioned differently, you can use the [`anchorPoint`](#anchorpoint-advancedmarkeranchorpoint--string-string) property of the `AdvancedMarker`. For example, to have the anchor point in the top-left
corner of the marker:

```tsx
import {AdvancedMarker, AdvancedMarkerAnchorPoint} from '@vis.gl/react-google-maps';

<AdvancedMarker position={...} anchorPoint={AdvancedMarkerAnchorPoint.TOP_LEFT}>
    ...
</AdvancedMarker>
```

:::

## Props

The `AdvancedMarker` component supports most of the options in
[`google.maps.marker.AdvancedMarkerElementOptions`][gmp-adv-marker-opts]
as props, as well as a couple of others that are specific to React.

### Required

There are no strictly required props for the AdvancedMarker component,
but – for obvious reasons – the position has to be set for the marker to be
shown on the map.

### Content Props

#### `className`: string

A className to be added to the markers content-element. The content-element is
either an element that contains the custom HTML content or the DOM
representation of the `google.maps.marker.PinElement` when a Pin or an
empty AdvancedMarker component is rendered.

#### `style`: [CSSProperties][react-dev-styling]

Additional style-rules to apply to the content-element. Since the
content-element isn't created when using the default-pin, this option is
only available when using custom HTML markers.

#### `title`: string

The title of the marker. If provided, an accessibility text (e.g. for use
with screen readers) will be added to the AdvancedMarkerElement with the
provided value.

### Positioning Props

#### `position`: [google.maps.LatLngLiteral][gmp-ll] | [google.maps.LatLngAltitudeLiteral][gmp-lla]

The position of the marker. For maps with tilt enabled, an `AdvancedMarker`
can also be placed at an altitude using the `{lat: number, lng: number,
altitude: number}` format.

#### `zIndex`: number

All markers are displayed on the map in order of their zIndex, with higher
values in front of lower values.

By default, `AdvancedMarker`s are displayed according to their vertical
position on screen, with lower AdvancedMarkerElements appearing in front of
AdvancedMarkerElements farther up the screen.

:::note

The `zIndex` is also used to help determine relative
priority between multiple markers when using collision
behavior `CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY`.
A higher `zIndex` value indicates higher priority.

:::

#### `collisionBehavior`: CollisionBehavior

Defines how the marker behaves when it collides with another marker or with
the basemap labels on a vector map. Specified as one of the
`CollisionBehaviour` constants.

Collision between multiple markers works on both raster and vector
maps; however, hiding labels and default-markers of the base map to make
room for the markers will only work on vector maps.

:::note

You should always import the `CollisionBehavior` enum from the
`@vis.gl/react-google-maps` package instead of using the
`google.maps.CollisionBehavior` constants. This will help avoid problems
with using the constants before the maps API has finished loading.

```tsx
import {AdvancedMarker, CollisionBehavior} from '@vis.gl/react-google-maps';

// ...

<AdvancedMarker
  collisionBehavior={CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL}>
  ...
</AdvancedMarker>;
```

:::

See the documentation on [Marker Collision Management][gmp-collisions]
for more information.

#### `anchorPoint`: AdvancedMarkerAnchorPoint | [string, string]

Defines the point on the marker which should align with the geo position of the marker.
The default anchor point is `BOTTOM_CENTER`. That means for a standard map marker, the bottom of the pin is on the exact geo location of the marker

Either use one of the predefined anchor points from the `AdvancedMarkerAnchorPoint` export
or provide a string tuple in the form of `["xPosition", "yPosition"]`.

The position is measured from the top-left corner and
can be anything that can be consumed by a CSS translate() function.
For example in percent `[10%, 90%]` or in pixels `[10px, 20px]`.

### Other Props

#### `clickable`: boolean

Controls if the marker should be clickable. If true, the
marker will be clickable and will be interactive for accessibility purposes
(e.g., allowing keyboard navigation via arrow keys).

By default, this will automatically be set to true when the `onClick` prop
is specified.

#### `draggable`: boolean

Controls if the marker can be repositioned by dragging.

By default, this will be set to true if any of the corresponding
event-handlers (`onDragStart`, `onDrag`, `onDragEnd`) are specified.

:::note

Dragging is only available in 2D. Markers that have an altitude
specified in the position can't be dragged.

:::

### Events

#### `onClick`: (e: [google.maps.marker.AdvancedMarkerClickEvent][gmp-adv-marker-click-ev]) => void

This event is fired when the marker is clicked.

#### `onMouseEnter`: (e: [google.maps.MapMouseEvent['domEvent']][gmp-map-mouse-ev-dom]) => void

This event is fired when the mouse enters the marker.

#### `onMouseLeave`: (e: [google.maps.MapMouseEvent['domEvent']][gmp-map-mouse-ev-dom]) => void

This event is fired when the mouse leaves the marker.

#### `onDragStart`: (e: [google.maps.MapMouseEvent][gmp-map-mouse-ev]) => void

This event is fired when the user starts dragging the marker.

#### `onDrag`: (e: [google.maps.MapMouseEvent][gmp-map-mouse-ev]) => void

This event is repeatedly fired while the user drags the marker.

#### `onDragEnd`: (e: [google.maps.MapMouseEvent][gmp-map-mouse-ev]) => void

This event is fired when the user stops dragging the marker.

## Context

## Hooks

### `useAdvancedMarkerRef()`

A hook that can be used to simplify the connection between a marker and an
infowindow. Returns an array containing both a `RefCallback` that can be passed
to the `ref`-prop of the `AdvancedMarker` and the value of the ref as state
variable to be passed to the anchor prop of the `InfoWindow`.

```tsx
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

const MarkerWithInfoWindow = props => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker position={props.position} ref={markerRef} />
      <InfoWindow anchor={marker}>Infowindow Content</InfoWindow>
    </>
  );
};
```

## Source

[`./src/components/advanced-marker.tsx`][adv-marker-src]

[gmp-adv-marker]: https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement
[gmp-adv-marker-opts]: https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElementOptions
[gmp-mapid]: https://developers.google.com/maps/documentation/get-map-id
[gmp-ll]: https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngLiteral
[gmp-lla]: https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngAltitudeLiteral
[gmp-collisions]: https://developers.google.com/maps/documentation/javascript/examples/marker-collision-management
[gmp-adv-marker-click-ev]: https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerClickEvent
[gmp-map-mouse-ev]: https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent
[gmp-map-mouse-ev-dom]: https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent.domEvent
[adv-marker-src]: https://github.com/visgl/react-google-maps/tree/main/src/components/advanced-marker.tsx
[react-portal]: https://react.dev/reference/react-dom/createPortal
[react-dev-styling]: https://react.dev/reference/react-dom/components/common#applying-css-styles
