# Introduction

react-google-maps is a collection of [React](https://react.dev/) components and hooks for
the Google Maps Javascript API.

Want to contribute? See our [Developer Guide](./contributing.md)

## Design Philosophy

react-google-maps was first provisioned by the Google Maps Platform team, in order to provide solid integrations between
react and the Google Maps API inspired by the integration between react-map-gl and the map renderers based on
mapbox-gl-js.

The Google Maps APIs are [imperative](https://en.wikipedia.org/wiki/Imperative_programming).
That is, you instruct the map to do something, and it will execute the command at its own pace.
The map also maintains a lot of its own state-information and logic for updating it, for example
the current viewport and the various ways to control it is fully contained within the maps API.

While this may be fine in a lot of use-cases it does not work when many components need to synchronize
with each other. We sometimes render two maps side by side, and when the user interacts with one,
update both cameras. We draw React UI outside of the map container, that moves with the camera.
We also render WebGL graphic overlays on top of the map, most notably with [deck.gl](https://deck.gl).

In these use cases, in order for all components to synchronize correctly, they must have their shared
states managed by React. We might store the **source of truth** in a parent component state, or Redux
store, or hooks, and let it propagate down to the map as well as its peers.

Ultimately, in the spirit of the [reactive programming paradigm](https://en.wikipedia.org/wiki/Reactive_programming),
data always flows **down**. As long as the map manages its own state, as Google Maps is designed to do, we risk the
components going out of sync.

@vis.gl/react-google-maps can create a fully reactive wrapper for the Google Maps JavaScript API.
The [Map](./api-reference/components/map.md) component can be fully
[controlled](https://reactjs.org/docs/forms.html#controlled-components), that is, the map's camera would
never deviate from the props that have been assigned.
