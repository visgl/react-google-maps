# `<Pin>` Component

React component to display
a [Pin Element](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement)
instance.
The Pin Element Component can only be used together with the Advanced Marker. To see how to implement an Advanced
Marker, please check: [Advanced Marker](advanced-marker.md).

## Usage

The Pin Element component needs to be wrapped inside an Advanced Marker Element component.

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

## Props

The Pin Props type mirrors
the [google.maps.PinElementOptions interface](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions)
and includes all possible options available for a Pin Element instance.

```tsx
type PinProps = google.maps.marker.PinElementOptions;
```

To see a Pin on the Map, it has to be wrapped inside an Advanced Marker Element
and the `position` of the marker needs to be set.
