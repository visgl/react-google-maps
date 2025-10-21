# What's New

This page provides a summary of the new features and significant updates in
recent versions of the library. For a complete list of changes, including bug
fixes, please refer to
the [Changelog](https://github.com/visgl/react-google-maps/blob/main/CHANGELOG.md).

## Version 1.6 (October 2025)

### New Anchoring Props for Advanced Markers

To provide more direct control over marker positioning, the `<AdvancedMarker>`
component now includes `anchorLeft` and `anchorTop` props. These allow you to
specify the anchor point using CSS length-percentage values, which is
particularly useful for custom markers where the anchor isn't the default
bottom-center.

The existing `anchorPoint` prop is now deprecated in favor of these new props.

Here's a quick example of how to position a custom marker so that its top-left
corner is aligned with the geographical coordinates:

```tsx
<AdvancedMarker
  position={{lat: 37.77, lng: -122.41}}
  anchorLeft={'0%'}
  anchorTop={'0%'}>
  <img src="/my-custom-marker.png" width={32} height={32} />
</AdvancedMarker>
```

### Usage Attribution

The library now automatically includes usage attribution information for the
React wrapper. This helps Google understand how the Maps Platform APIs are being
used and prioritize future development efforts. This is handled internally and
requires no changes to your code.

When copying code from examples or generated using AI tools, there will
sometimes be an additional attribution passed to the Map component. Keeping
this attribution is encouraged, but not required. Values other than
those provided by official Google sources will be ignored.

To opt-out of sending usage-attribution data along with Maps API requests, you
can set the `disableUsageAttribution` prop to `true` on the `<APIProvider>`
component:

```tsx
<APIProvider apiKey={YOUR_API_KEY} disableUsageAttribution>
  {/* ... */}
</APIProvider>
```

## Version 1.5 (January 2025)

### Static Maps with Server-Side Rendering

A new `<StaticMap>` component has been added, providing support for server-side
rendering (SSR). This is a great way to embed a simple map image in your page
without the overhead of the full interactive map.

```tsx
<APIProvider apiKey={YOUR_API_KEY}>
  <StaticMap center={{lat: 53.55, lng: 10}} zoom={12} />
</APIProvider>
```

## Version 1.4 (October 2024)

### API Provider Updates

The `<APIProvider>` component now includes a `channel` prop, which can be used
to specify a release channel for the Google Maps API.

```tsx
<APIProvider apiKey={YOUR_API_KEY} channel="beta">
  {/* ... your map components */}
</APIProvider>
```

## Version 1.3 (September 2024)

### New Error Handling for API Provider

A new `onError` prop has been added to the `<APIProvider>` to make it easier to
handle errors that might occur during the API loading process.

```tsx
const handleApiError = error => {
  console.error('Google Maps API Error:', error);
};

<APIProvider apiKey={YOUR_API_KEY} onError={handleApiError}>
  {/* ... your map components */}
</APIProvider>;
```

## Version 1.2 (September 2024)

### Advanced Marker Enhancements

The `<AdvancedMarker>` component has been updated to support hover events (
`onMouseEnter`, `onMouseLeave`) and custom anchor points via the `anchorPoint`
prop.

```tsx
<AdvancedMarker
  position={{lat: 37.77, lng: -122.41}}
  onMouseEnter={() => console.log('Marker hovered!')}
/>
```

## Version 1.1 (June 2024)

### InfoWindow and Map Enhancements

The `<InfoWindow>` component now has a `headerContent` prop to allow for more
complex header content. The `<Map>` component also now supports a `padding`
option for `defaultBounds`.

```tsx
<InfoWindow headerContent={<h3>Custom Header</h3>}>
    <p>InfoWindow content.</p>
</InfoWindow>

<Map
    defaultBounds={{north: 40.7, south: 40.6, east: -73.9, west: -74}}
    padding={50}
/>
```

## Version 1.0 (May 2024)

This was the first major stable release of the library.
