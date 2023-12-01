# Introduction

`@vis.gl/react-google-maps` is a collection of [React][react] components and
hooks for the Google Maps Javascript API. It was first provisioned by the
Google Maps Platform team, in order to provide solid integrations between
React and the Maps JavaScript API inspired by the integration between
`react-map-gl` and the map renderers based on `mapbox-gl-js`.

Want to contribute? See our [Developer Guide](./contributing.md)

## Design Philosophy

The Google Maps JavaScript API follows an [imperative][wiki-imperative]
programming model. That is, you instruct the map to do something, and it
will execute the command at its own pace. The map also maintains a lot of
its own state-information and logic for updating it. For example, the virtual
camera and the various ways to control it are fully contained within the
Maps API, including all event-listeners that allow users to interact with
the map.

While this is typically what you'd expect from a map renderer, it also comes
with some problems in the context of a React application. We often need a
full synchronization of the map-state with the state of the application and
other components. Some examples:

- Two maps are rendered side by side, and user interactions in one of them
  should update both maps.
- Other components and UI elements outside the map might need updating based on
  the region currently visible, or they might trigger changes of the region
  shown by the map.
- Integrations with overlays for data-visualization on top of the map, most
  notably using [deck.gl][docs-deckgl].

In all of these cases, the application must have a shared state managed by
React to be able to synchronize the components correctly. This is referred
to as having a _single source of truth_. That could be stored in a parent
component state, a Redux store, or react-hooks, and let it propagate down
to the map and any other component.

Ultimately, in the spirit of the [reactive programming paradigm]
[wiki-reactive] used in React, data from this single source of truth should
always flow down the component hierarchy. If components manage their own
state, as Google Maps is designed to do, we risk the components going out of
sync.

`@vis.gl/react-google-maps` provides a reactive wrapper for the Google Maps
JavaScript API while still leaving the map instance in charge of state
updates. In most cases, this is desirable, as controlling a map from mouse,
pointer and touch events is a complicated problem in itself which is solved
particularly well by the Maps JavaScript API.

This means that usually, the props specified for the camera are read as
initial values, and users will be able to interact with the map without
requiring the props to be updated. So by default, the map is allowed to
deviate from the specified values.

However, the [Map][docs-map] component can also be used as a fully [controlled]
[react-controlled] component. That is, the map's camera will never deviate
from the props that have been assigned. In this mode, the controls
provided by the map can still be used by listening for the appropriate
events and updating the state accordingly.

[wiki-imperative]: https://en.wikipedia.org/wiki/Imperative_programming
[wiki-reactive]: https://en.wikipedia.org/wiki/Reactive_programming
[docs-deckgl]: ./guides/deckgl-integration.md
[docs-map]: ./api-reference/components/map.md
[react]: https://react.dev/
[react-controlled]: https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components
