# `<InfoWindow>` Component

[InfoWindows][gmp-infowindow] are small, temporary overlays on the map that
are typically used to display additional bits of information for locations on
the map – for example, to add a label or image to a marker. They can be
freely positioned on the map, or they can be "anchored" to a marker.

When an `InfoWindow` is shown, the map will make sure to reposition the viewport
such that the InfoWindow is well visible within the map container.

InfoWindows always use the same well-known styling and are limited in how much
their look and feel can be customized. Any JSX element added to the
InfoWindow component as children will get rendered into the content of the 
InfoWindow.

:::note

The rendered InfoWindow includes a close-button that can't be removed or
controlled via the Maps JavaScript API. This means that the application can't
fully control the visibility of the InfoWindow.

To keep your state in sync with the map, you have to provide a listener for the 
`onClose` event so the application knows when then InfoWindow was closed by 
the map or the user.

:::

:::tip

If you need more control over an InfoWindow than can be offered by the
`InfoWindow` component, you can use the [`AdvancedMarker`](./advanced-marker.md)
component with html-content to create a custom implementation.

:::

## Usage

### Minimal Example

In this example, the InfoWindow will be initially shown when the map is
rendered, but the user can close it and there wouldn't be a way to get it back.

```tsx
const MapWithInfoWindow = () => {
  return (
    <Map {...mapProps}>
      <InfoWindow position={infoWindowPosition}>
        The content of the info window is here.
      </InfoWindow>
    </Map>
  );
};
```

### Infowindow Attached to Marker

A more typical use-case is to have an InfoWindow shown on click for a marker.
One way to implement this is to write a custom component
`MarkerWithInfoWindow` that can then be added to any `Map`.

```tsx
const MarkerWithInfoWindow = ({position}) => {
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(() =>
    setInfoWindowShown(isShown => !isShown),
    []
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={position}
        onClick={handleMarkerClick}
      />

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <h2>InfoWindow content!</h2>
          <p>Some arbitrary html to be rendered into the InfoWindow.</p>
        </InfoWindow>
      )}
    </>
  );
};
```

## Props

The InfoWindowProps interface roughly extends the [`google.maps.InfoWindowOptions`
interface][gmp-infowindow-options] and includes all the options available for a
InfoWindow as props. All supported options are listed below.

### Required

There are no strictly required props for the InfoWindow component, but it is
required to set either a `position` or an `anchor` to show the infowindow.

### General Props

#### `position`: google.maps.LatLngLiteral

The LatLng at which to display this InfoWindow.

:::note

When an `anchor` is specified, the `position` prop will be ignored.

:::

#### `anchor`: google.maps.Marker | google.maps.marker.AdvancedMarkerElement

A Marker or AdvancedMarker instance to be used as an anchor. If specified, the
InfoWindow will be positioned at the top-center of the anchor.

#### `zIndex`: number

All InfoWindows are displayed on the map in order of their zIndex, with
higher values displaying in front of InfoWindows with lower values. By
default, InfoWindows are displayed according to their latitude, with
InfoWindows of lower latitudes appearing in front of InfoWindows at higher
latitudes. InfoWindows are always displayed in front of markers.

#### `pixelOffset`: [number, number]

The offset, in pixels, from the tip of the info window to the point on the
map at whose geographical coordinates the info window is anchored.
If an InfoWindow is opened with an anchor, the `pixelOffset` will be
calculated from the anchor's top/center.

#### `disableAutoPan`: boolean

Disable panning the map to make the InfoWindow fully visible when it opens.

#### `shouldFocus`: boolean

Whether focus should be moved inside the InfoWindow when it is opened. When
this property isn't set, a heuristic is used to decide whether focus should
be moved.

It is recommended to explicitly set this property to fit your needs as the
heuristic is subject to change and may not work well for all use cases.

### Content Props

#### `className`: string

A className to be assigned to the topmost element in the infowindow content.

#### `style`: [CSSProperties][react-dev-styling]

A style declaration to be added to the topmost element in the infowindow
content. This works exactly as the style property for any other
html element.

#### `ariaLabel`: string

AriaLabel to assign to the InfoWindow.

#### `minWidth`: number

Minimum width of the InfoWindow, regardless of the content's width. When
using this property, it is strongly recommended to set the minWidth to a
value less than the width of the map (in pixels).

:::note

The `minWidth` can't be changed while the InfoWindow is open.

:::

#### `maxWidth`: number

Maximum width of the InfoWindow, regardless of content's width.

:::note

The `minWidth` can't be changed while the InfoWindow is open.

:::

### Events

#### `onClose`: () => void

This event is fired whenever the InfoWindow closes. This could be from
unmouting the InfoWindow component, pressing the escape key to close the
InfoWindow, or clicking the close button or removing the marker the
InfoWindow was anchored to.

#### `onCloseClick`: () => void

This event is fired when the close button was clicked.

[gmp-infowindow]: https://developers.google.com/maps/documentation/javascript/infowindows
[gmp-infowindow-options]: https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions
[react-dev-styling]: https://react.dev/reference/react-dom/components/common#applying-css-styles
