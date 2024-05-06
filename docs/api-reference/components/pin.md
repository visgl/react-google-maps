# `<Pin>` Component

The `Pin` component can be used to customize the appearance of an
[`AdvancedMarker`](./advanced-marker.md) component.

## Usage

```tsx
const CustomizedMarker = () => (
  <AdvancedMarker position={{lat: 53.54992, lng: 10.00678}}>
    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
  </AdvancedMarker>
);
```

## Props

The `PinProps` type mirrors the [`google.maps.PinElementOptions` interface][gmp-pin-element-options]
and includes all possible options available for a Pin Element instance.

[gmp-pin-element]: https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElement
[gmp-pin-element-options]: https://developers.google.com/maps/documentation/javascript/reference/advanced-markers#PinElementOptions
