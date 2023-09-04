# `<AdvancedMarker>` Component

React component to display
a [Google Maps Advanced Marker Element](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#AdvancedMarkerElement)
instance.

## Setup

To use the Advanced Marker View component, it is necessary to add a custom `mapId`
to the map options. To see how this works, check out the following tutorial:
[Use Map IDs](https://developers.google.com/maps/documentation/get-map-id).

### APIProvider and Map setup to implement the Advanced Marker View component

```tsx
<APIProvider apiKey={loadingOptions.apiKey}>
    <Map
        zoom={10}
        center={{lat, lng}}
        mapId={'<Your custom MapId here>'}>

        <AdvancedMarker position={{...}} />
    </Map>
</APIProvider>
```

## Usage

Advanced Marker Element can either be as a standalone component or be customized with
the [Pin Element component](./pin.md) or be displayed with custom HTML.

### Simple Advanced Marker Element implementation

See also: https://developers.google.com/maps/documentation/javascript/adding-a-google-map

```tsx
const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map
      zoom={12}
      center={{lat: 53.54992, lng: 10.00678}}
      mapId={'<Your custom MapId here>'}>
      <AdvancedMarker position={{lat: 53.54992, lng: 10.00678}} />
    </Map>
  </APIProvider>
);
export default App;
```

### Advanced Marker Element with Pin Element component implementation

See also: https://developers.google.com/maps/documentation/javascript/advanced-markers/basic-customization

```tsx
const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map
      zoom={12}
      center={{lat: 53.54992, lng: 10.00678}}
      mapId={'<Your custom MapId here>'}>
      <AdvancedMarker position={{lat: 53.54992, lng: 10.00678}}>
        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
      </AdvancedMarker>
    </Map>
  </APIProvider>
);
export default App;
```

### Advanced Marker Element component with custom HTML implementation

See also: https://developers.google.com/maps/documentation/javascript/advanced-markers/html-markers

```tsx
const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map
      zoom={12}
      center={{lat: 53.54992, lng: 10.00678}}
      mapId={'<Your custom MapId here>'}>
      <AdvancedMarker
        className={customMarker}
        position={{lat: 53.54992, lng: 10.00678}}>
        <h2>I am so customized</h2>
        <p>That is pretty awesome!</p>
      </AdvancedMarker>
    </Map>
  </APIProvider>
);
export default App;
```

To apply style to the custom HTML marker, it is possible to add a class via the className property which will add
styling to the Advanced Marker Element container.

### Draggable Advanced Marker Element component implementation

see
also: https://developers.google.com/maps/documentation/javascript/advanced-markers/accessible-markers#make_a_marker_draggable

```tsx
const App = () => (
  <APIProvider apiKey={'Your API key here'}>
    <Map
      zoom={12}
      center={{lat: 53.54992, lng: 10.00678}}
      mapId={'<Your custom MapId here>'}>
      <AdvancedMarker
        position={{lat: 53.58675649147477, lng: 10.045572975464376}}
        draggable={true}></AdvancedMarker>
    </Map>
  </APIProvider>
);
export default App;
```

To see an Advanced Marker Element on the map, the `position` property needs to be set.
