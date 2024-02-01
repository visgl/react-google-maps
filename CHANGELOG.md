# Changelog

## [0.5.3](https://github.com/visgl/react-google-maps/compare/v0.5.2...v0.5.3) (2024-02-01)


### Bug Fixes

* add `loading=async` to maps API url ([cb1336f](https://github.com/visgl/react-google-maps/commit/cb1336fc97dda8b3ad99c3f9a9a560cf8186056b))
* use parameter `v` instead of `version` ([0626fb6](https://github.com/visgl/react-google-maps/commit/0626fb6411ada3293d0f4a640dff07d0e19fc805))

## [0.5.2](https://github.com/visgl/react-google-maps/compare/v0.5.1...v0.5.2) (2024-02-01)


### Bug Fixes

* trigger release for new library function from commit 31f2655 ([b5a13e5](https://github.com/visgl/react-google-maps/commit/b5a13e598d97ae65304df6f79d05247b847e670b))

## [0.5.1](https://github.com/visgl/react-google-maps/compare/v0.5.0...v0.5.1) (2024-01-31)


### Bug Fixes

* infowindow double rendering and eslint warnings ([#185](https://github.com/visgl/react-google-maps/issues/185)) ([404cc06](https://github.com/visgl/react-google-maps/commit/404cc06253a92f120f97f72179949a8f4c0fc87b))

## [0.5.0](https://github.com/visgl/react-google-maps/compare/v0.4.3...v0.5.0) (2024-01-18)


### Features

* handle API-key errors in map-component ([#165](https://github.com/visgl/react-google-maps/issues/165)) ([26ccc15](https://github.com/visgl/react-google-maps/commit/26ccc15d640346ce71157d387fbc56720234fa4c))


### Bug Fixes

* don't use potentially unreliable addListener functions ([#158](https://github.com/visgl/react-google-maps/issues/158)) ([7309efa](https://github.com/visgl/react-google-maps/commit/7309efa1db8b392ebe2840e5d527a92419c9fc2a))
* export event-types ([#167](https://github.com/visgl/react-google-maps/issues/167)) ([cdd6b72](https://github.com/visgl/react-google-maps/commit/cdd6b72f848bf5b54618862788e1a3a221fcdce1))
* export type properly ([#170](https://github.com/visgl/react-google-maps/issues/170)) ([e561031](https://github.com/visgl/react-google-maps/commit/e56103149f15977ae0e7f62dd359cd3759b71fc9))

## [0.4.3](https://github.com/visgl/react-google-maps/compare/v0.4.2...v0.4.3) (2024-01-05)


### Bug Fixes

* allow AdvancedMarker to accept space-separated multiple class names ([#143](https://github.com/visgl/react-google-maps/issues/143)) ([eab53e2](https://github.com/visgl/react-google-maps/commit/eab53e2ffa69325fb927b16d59f6aa7faa589a49))

## [0.4.2](https://github.com/visgl/react-google-maps/compare/v0.4.1...v0.4.2) (2023-12-22)


### Bug Fixes

* avoid re-render on every importLibrary() call ([#135](https://github.com/visgl/react-google-maps/issues/135)) ([32b5894](https://github.com/visgl/react-google-maps/commit/32b5894518a22793c236bcab33291f25b48f7367))

## [0.4.1](https://github.com/visgl/react-google-maps/compare/v0.4.0...v0.4.1) (2023-12-01)


### Bug Fixes

* move @types/google.maps to dependencies ([#115](https://github.com/visgl/react-google-maps/issues/115)) ([9b788e1](https://github.com/visgl/react-google-maps/commit/9b788e10722ecbc8d483313c7d746b90f67afc87)), closes [#106](https://github.com/visgl/react-google-maps/issues/106)
* output an error when useMap is called outside APIProvider ([#117](https://github.com/visgl/react-google-maps/issues/117)) ([5c30c3d](https://github.com/visgl/react-google-maps/commit/5c30c3d5a36af57a649ca3201f7dd0c3819e6035))

## [0.4.0](https://github.com/visgl/react-google-maps/compare/v0.3.3...v0.4.0) (2023-11-28)


### Features

* Allow &lt;Pin&gt; glyphs to be passed as children (close [#98](https://github.com/visgl/react-google-maps/issues/98)) ([#99](https://github.com/visgl/react-google-maps/issues/99)) ([6374453](https://github.com/visgl/react-google-maps/commit/637445313c8c9364cbf1f32346d3438fc0589d74))

## [0.3.3](https://github.com/visgl/react-google-maps/compare/v0.3.2...v0.3.3) (2023-11-13)


### Bug Fixes

* add map camera state tracking ([#84](https://github.com/visgl/react-google-maps/issues/84)) ([1dc1584](https://github.com/visgl/react-google-maps/commit/1dc158436c4ffde60548486da5410b46e989fc5b))

## [0.3.2](https://github.com/visgl/react-google-maps/compare/v0.3.1...v0.3.2) (2023-11-09)


### Bug Fixes

* use moveCamera and useLayoutEffect for faster map-updates ([e493d5f](https://github.com/visgl/react-google-maps/commit/e493d5ffa350efebddd5ef63bb57495954478877))

## [0.3.1](https://github.com/visgl/react-google-maps/compare/v0.3.0...v0.3.1) (2023-11-09)


### Bug Fixes

* update ControlPosition values ([#71](https://github.com/visgl/react-google-maps/issues/71)) ([1dd144a](https://github.com/visgl/react-google-maps/commit/1dd144ac3deac53a77d870ba8cf1e4623786a620))

## [0.3.0](https://github.com/visgl/react-google-maps/compare/v0.2.1...v0.3.0) (2023-11-09)


### ⚠ BREAKING CHANGES

* removed MapProps.onLoadMap

### Features

* cleanup map, remove onLoadMap prop ([d5e7dfd](https://github.com/visgl/react-google-maps/commit/d5e7dfdf74d76395ffbc1bcd2afda62a12eb7e57))
* implement props for all map-events with custom MapEvent type ([820a301](https://github.com/visgl/react-google-maps/commit/820a301e4a30e2b7bbbe7c82c69675f9c410813e))
* update map viewport when props are changed ([0b1d800](https://github.com/visgl/react-google-maps/commit/0b1d800dc5e4b9bf0b1ddb42b9fed392b23b8dae))

## [0.2.1](https://github.com/visgl/react-google-maps/compare/v0.2.0...v0.2.1) (2023-11-07)


### Bug Fixes

* add types to package exports ([#62](https://github.com/visgl/react-google-maps/issues/62)) ([1ab493a](https://github.com/visgl/react-google-maps/commit/1ab493a71ddaeff3b31caec10be1fd4728d51362))

## [0.2.0](https://github.com/visgl/react-google-maps/compare/v0.1.2...v0.2.0) (2023-11-07)


### Features

* new MapControl component ([#51](https://github.com/visgl/react-google-maps/issues/51)) ([7eb49ed](https://github.com/visgl/react-google-maps/commit/7eb49ed55eb548c342f83bcdbf9dc655655bafe7))
* standalone examples (CodeSandbox) ([#48](https://github.com/visgl/react-google-maps/issues/48)) ([959c6e3](https://github.com/visgl/react-google-maps/commit/959c6e3d57d896d4f76640e01b3ad0a33dea3fae))


### Bug Fixes

* replace prop `gmpDraggable` with `draggable` in AdvancedMarker ([#53](https://github.com/visgl/react-google-maps/issues/53)) ([1dbf477](https://github.com/visgl/react-google-maps/commit/1dbf477dfa2e471edf9a9daacd5e5e384a48d8de))
* update usage of useMapsLibrary in AdvancedMarker ([#55](https://github.com/visgl/react-google-maps/issues/55)) ([b01fc8b](https://github.com/visgl/react-google-maps/commit/b01fc8bbafae569fbb21a3175deb5b66762eb083))

## [0.1.2](https://github.com/visgl/react-google-maps/compare/v0.1.1...v0.1.2) (2023-11-01)


### Miscellaneous Chores

* add registry-url to release action ([9fa403b](https://github.com/visgl/react-google-maps/commit/9fa403bd4d6dfc31b84683543868b0bfbe70e2b9))

## [0.1.1](https://github.com/visgl/react-google-maps/compare/v0.1.0...v0.1.1) (2023-11-01)


### Bug Fixes

* empty commit to trigger release-please ([b04a942](https://github.com/visgl/react-google-maps/commit/b04a9421fc290c3ca6eacc02391726beab4bba4b))

## [0.1.0](https://github.com/visgl/react-google-maps/compare/v0.0.5...v0.1.0) (2023-10-27)


### ⚠ BREAKING CHANGES

* loading multiple libraries at once is no longer supported, changed the return type of useMapsLibrary.

### Features

* useMapsLibrary returns API object instead of boolean ([#26](https://github.com/visgl/react-google-maps/issues/26)) ([a3aa4c5](https://github.com/visgl/react-google-maps/commit/a3aa4c5e10228003206c8de3305f857df50d73d1))
