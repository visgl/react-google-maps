# Changelog

## [1.5.1](https://github.com/visgl/react-google-maps/compare/v1.5.0...v1.5.1) (2025-01-28)


### Bug Fixes

* improve types ColorScheme and RenderingType ([#675](https://github.com/visgl/react-google-maps/issues/675)) ([785927a](https://github.com/visgl/react-google-maps/commit/785927a9b69e6a2c08ab013f607270d0dc0fc653))

## [1.5.0](https://github.com/visgl/react-google-maps/compare/v1.4.3...v1.5.0) (2025-01-10)


### Features

* add StaticMap component with SSR support ([#633](https://github.com/visgl/react-google-maps/issues/633)) ([55acea2](https://github.com/visgl/react-google-maps/commit/55acea2a0b82727e487ee30fb788a05ba7dce153))

## [1.4.3](https://github.com/visgl/react-google-maps/compare/v1.4.2...v1.4.3) (2025-01-07)


### Bug Fixes

* **deps-dev:** bump react, react-dom and corresponding types ([#650](https://github.com/visgl/react-google-maps/issues/650)) ([02fe28f](https://github.com/visgl/react-google-maps/commit/02fe28fdc0e69a3ab0b3e8555b156b4c36d7c75c))
* use deep compare effect to prevent infowindow close ([#642](https://github.com/visgl/react-google-maps/issues/642)) ([bfa85c1](https://github.com/visgl/react-google-maps/commit/bfa85c177796ac05cb626590c2467a31edab86eb))

## [1.4.2](https://github.com/visgl/react-google-maps/compare/v1.4.1...v1.4.2) (2024-11-28)


### Bug Fixes

* remove explicit types for components using forwardRef ([#620](https://github.com/visgl/react-google-maps/issues/620)) ([8448a33](https://github.com/visgl/react-google-maps/commit/8448a336fdd2e489493bc40068bfa58d23267409)), closes [#619](https://github.com/visgl/react-google-maps/issues/619) [#617](https://github.com/visgl/react-google-maps/issues/617)

## [1.4.1](https://github.com/visgl/react-google-maps/compare/v1.4.0...v1.4.1) (2024-11-22)


### Bug Fixes

* add explicit type for exported function components ([#611](https://github.com/visgl/react-google-maps/issues/611)) ([a5b0359](https://github.com/visgl/react-google-maps/commit/a5b035986872b3abb8c28d6659034c2a897476a3)), closes [#583](https://github.com/visgl/react-google-maps/issues/583)
* add support Next.js 15 ([#609](https://github.com/visgl/react-google-maps/issues/609)) ([0e673c2](https://github.com/visgl/react-google-maps/commit/0e673c262a0a704a0d85a7f34cf4409965d11a8b))

## [1.4.0](https://github.com/visgl/react-google-maps/compare/v1.3.0...v1.4.0) (2024-10-24)


### Features

* add `channel` prop to APIProvider ([#584](https://github.com/visgl/react-google-maps/issues/584)) ([6aa38e5](https://github.com/visgl/react-google-maps/commit/6aa38e52a2cf0cc856167489b879871622c74ea8))


### Bug Fixes

* adjust advanced marker markup to fix anchoring & collision behavior ([#577](https://github.com/visgl/react-google-maps/issues/577)) ([97a98b2](https://github.com/visgl/react-google-maps/commit/97a98b2a04b896a892351a178fecafa665c03113))

## [1.3.0](https://github.com/visgl/react-google-maps/compare/v1.2.0...v1.3.0) (2024-09-30)


### Features

* add new `onError` prop for api provider ([#541](https://github.com/visgl/react-google-maps/issues/541)) ([bbe5709](https://github.com/visgl/react-google-maps/commit/bbe5709e1420e7260234b11a7749ed9b7804e9b7))


### Bug Fixes

* avoid unnecessary state-updates in api-provider ([#551](https://github.com/visgl/react-google-maps/issues/551)) ([46068c9](https://github.com/visgl/react-google-maps/commit/46068c9b3f3e930d464e2314181e2f6ed32a9aa7))

## [1.2.0](https://github.com/visgl/react-google-maps/compare/v1.1.3...v1.2.0) (2024-09-16)


### Features

* add hover events and anchor points to advanced markers ([#472](https://github.com/visgl/react-google-maps/issues/472)) ([cc4a397](https://github.com/visgl/react-google-maps/commit/cc4a397f0ed2af12a28c21db6afad3a946527131))

## [1.1.3](https://github.com/visgl/react-google-maps/compare/v1.1.2...v1.1.3) (2024-09-08)


### Bug Fixes

* **types:** add types-reference to google.maps ([#520](https://github.com/visgl/react-google-maps/issues/520)) ([ed19636](https://github.com/visgl/react-google-maps/commit/ed196365821d6ac8b97baa1a900842990f1959f2)), closes [#519](https://github.com/visgl/react-google-maps/issues/519)

## [1.1.2](https://github.com/visgl/react-google-maps/compare/v1.1.1...v1.1.2) (2024-09-06)


### Bug Fixes

* **map:** undefined rendering-type and color-scheme ([#515](https://github.com/visgl/react-google-maps/issues/515)) ([c288d15](https://github.com/visgl/react-google-maps/commit/c288d15e2b4bfa5d952ae06c1f586888987f86c7))

## [1.1.1](https://github.com/visgl/react-google-maps/compare/v1.1.0...v1.1.1) (2024-09-02)


### Bug Fixes

* **map:** add support for new and missing mapOptions ([#501](https://github.com/visgl/react-google-maps/issues/501)) ([f22af50](https://github.com/visgl/react-google-maps/commit/f22af50793622c2bee0508a4b57307dd18302d1b))
* **map:** remove [@ts-expect-error](https://github.com/ts-expect-error) after @types/google.maps update ([deb2bc7](https://github.com/visgl/react-google-maps/commit/deb2bc733800cb99ad8edeb30059ad050a16ee86))

## [1.1.0](https://github.com/visgl/react-google-maps/compare/v1.0.2...v1.1.0) (2024-06-17)


### Features

* **infowindow:** add new headerContent prop ([#396](https://github.com/visgl/react-google-maps/issues/396)) ([0d40c81](https://github.com/visgl/react-google-maps/commit/0d40c81fe0d850accccf031bfb4f6f7412eea73a)), closes [#378](https://github.com/visgl/react-google-maps/issues/378)
* **map:** add padding option to defaultBounds ([#392](https://github.com/visgl/react-google-maps/issues/392)) ([9dc65dc](https://github.com/visgl/react-google-maps/commit/9dc65dc36c1d3efb17ebcfa55da3b2f3909eb63f))

## [1.0.2](https://github.com/visgl/react-google-maps/compare/v1.0.1...v1.0.2) (2024-05-30)


### Bug Fixes

* **info-window:** fix reappearing InfoWindows ([#393](https://github.com/visgl/react-google-maps/issues/393)) ([dc51eb9](https://github.com/visgl/react-google-maps/commit/dc51eb979e5db6fb57a07d52efa36ef03e83dfcf))

## [1.0.1](https://github.com/visgl/react-google-maps/compare/v1.0.0...v1.0.1) (2024-05-27)


### Bug Fixes

* **advanced-marker:** apply marker class when rendering a Pin ([#384](https://github.com/visgl/react-google-maps/issues/384)) ([e8a4cc3](https://github.com/visgl/react-google-maps/commit/e8a4cc3aca92e92c20c1e99ba19fee7d713f4785))

## [1.0.0](https://github.com/visgl/react-google-maps/compare/v0.11.2...v1.0.0) (2024-05-11)


### Miscellaneous Chores

* tag 1.0.0 release ([afb67a7](https://github.com/visgl/react-google-maps/commit/afb67a7b076e83c025a147d488a93c33150c5b15))

## [0.11.2](https://github.com/visgl/react-google-maps/compare/v0.11.1...v0.11.2) (2024-05-10)


### Bug Fixes

* **map:** set other container position to relative ([#357](https://github.com/visgl/react-google-maps/issues/357)) ([8e77d70](https://github.com/visgl/react-google-maps/commit/8e77d70c272ac243c5d53f3dd6c02f508104226f))

## [0.11.1](https://github.com/visgl/react-google-maps/compare/v0.11.0...v0.11.1) (2024-05-10)


### Bug Fixes

* **advanced-marker:** remove content element in cleanup ([#351](https://github.com/visgl/react-google-maps/issues/351)) ([128df87](https://github.com/visgl/react-google-maps/commit/128df8730b7e1549e530a108192e7bae0699f199))
* **map:** set container position to relative ([#356](https://github.com/visgl/react-google-maps/issues/356)) ([7fa2b71](https://github.com/visgl/react-google-maps/commit/7fa2b711952a2472c409c38cd39edc1866cecbe3))

## [0.11.0](https://github.com/visgl/react-google-maps/compare/v0.10.0...v0.11.0) (2024-05-08)


### ⚠ BREAKING CHANGES

* **map:** Introduction of map instance caching needed a change to the DOM-Structure produced by the map component (added a div-element owned by the Map component to contain the map instance).
* **map:** The type passed to the `onProjectionChange` is changed from `MapCameraChangedEvent` to `MapEvent`, so there are no longer camera-props available for this event

### Features

* **advanced-marker:** add support for `clickable` option ([#341](https://github.com/visgl/react-google-maps/issues/341)) ([ca96e54](https://github.com/visgl/react-google-maps/commit/ca96e540a2117f7437745e8e1f71f83ef6c04e25))
* **map:** implement initial version of map-instance caching ([#349](https://github.com/visgl/react-google-maps/issues/349)) ([4a6e83a](https://github.com/visgl/react-google-maps/commit/4a6e83a26f06131baac288e3474d0e3163715f92))


### Bug Fixes

* **map:** change event-type of projectionChanged event to MapEvent ([#346](https://github.com/visgl/react-google-maps/issues/346)) ([83f9309](https://github.com/visgl/react-google-maps/commit/83f93091c858663b0183dd62bdc212a246013072))

## [0.10.0](https://github.com/visgl/react-google-maps/compare/v0.9.0...v0.10.0) (2024-05-03)


### Features

* add solution-channel parameter ([#334](https://github.com/visgl/react-google-maps/issues/334)) ([f93e43e](https://github.com/visgl/react-google-maps/commit/f93e43ee444a86dbc1b594d0c256229e6d207957))
* **advanced-marker:** add style prop to add styles to content-element ([#337](https://github.com/visgl/react-google-maps/issues/337)) ([e942fb5](https://github.com/visgl/react-google-maps/commit/e942fb5f5543a0a27e9987ee4324825958f08fdf))
* **infowindow:** add `className` and `style` props ([92854c9](https://github.com/visgl/react-google-maps/commit/92854c9103c90a8f0ad1c16eba729402b1e36919))
* **infowindow:** add missing options and events ([92854c9](https://github.com/visgl/react-google-maps/commit/92854c9103c90a8f0ad1c16eba729402b1e36919))
* **infowindow:** InfoWindow overhaul ([#335](https://github.com/visgl/react-google-maps/issues/335)) ([92854c9](https://github.com/visgl/react-google-maps/commit/92854c9103c90a8f0ad1c16eba729402b1e36919))


### Bug Fixes

* **infowindow:** add missing cleanup for infowindow ([92854c9](https://github.com/visgl/react-google-maps/commit/92854c9103c90a8f0ad1c16eba729402b1e36919))
* **infowindow:** better dependency checks, using `useDeepCompareEffect` where needed ([92854c9](https://github.com/visgl/react-google-maps/commit/92854c9103c90a8f0ad1c16eba729402b1e36919))
* **infowindow:** removed unneeded dependency in infowindow hooks ([92854c9](https://github.com/visgl/react-google-maps/commit/92854c9103c90a8f0ad1c16eba729402b1e36919))

## [0.9.0](https://github.com/visgl/react-google-maps/compare/v0.8.3...v0.9.0) (2024-04-18)


### Features

* better handling for missing map configuration ([#308](https://github.com/visgl/react-google-maps/issues/308)) ([b318d67](https://github.com/visgl/react-google-maps/commit/b318d676088e6f0ef787ffa911c552a12ecb4895))


### Bug Fixes

* **docs:** use correct spelling of JavaScript ([#312](https://github.com/visgl/react-google-maps/issues/312)) ([f38d3c4](https://github.com/visgl/react-google-maps/commit/f38d3c4004663fd1850c00dca7ddfb7e92b8d5cf))
* omit map prop from markers ([#305](https://github.com/visgl/react-google-maps/issues/305)) ([8a38acf](https://github.com/visgl/react-google-maps/commit/8a38acf04ab665bbeeeef87a87d195bcbf44ccea))

## [0.8.3](https://github.com/visgl/react-google-maps/compare/v0.8.2...v0.8.3) (2024-04-04)


### Bug Fixes

* api-loader didn't call callback on repeat load calls ([743878a](https://github.com/visgl/react-google-maps/commit/743878a33abe2b0fb6bfe96377df07066536e51e))
* map controls crashing when invalid key is provided ([#290](https://github.com/visgl/react-google-maps/issues/290)) ([5052dfb](https://github.com/visgl/react-google-maps/commit/5052dfbf3735ff07319b7bd7108ae9448b0c2840))

## [0.8.2](https://github.com/visgl/react-google-maps/compare/v0.8.1...v0.8.2) (2024-03-29)


### Bug Fixes

* memoize context-values to avoid excessive re-renders ([#287](https://github.com/visgl/react-google-maps/issues/287)) ([bea68f9](https://github.com/visgl/react-google-maps/commit/bea68f923e9326188baebd8a89b9ad5cbf891303)), closes [#285](https://github.com/visgl/react-google-maps/issues/285)

## [0.8.1](https://github.com/visgl/react-google-maps/compare/v0.8.0...v0.8.1) (2024-03-26)


### Bug Fixes

* InfoWindow.shouldFocus doesn't work with false as value ([#278](https://github.com/visgl/react-google-maps/issues/278)) ([2f4b508](https://github.com/visgl/react-google-maps/commit/2f4b508a3da87f778496043dc7d5b40f47837d1f))

## [0.8.0](https://github.com/visgl/react-google-maps/compare/v0.7.1...v0.8.0) (2024-03-20)


### Features

* add new prop InfoWindow.shouldFocus ([#254](https://github.com/visgl/react-google-maps/issues/254)) ([c83ea37](https://github.com/visgl/react-google-maps/commit/c83ea375295699ed4e3c3a4a6f097cad1a4aca7d))

## [0.7.1](https://github.com/visgl/react-google-maps/compare/v0.7.0...v0.7.1) (2024-02-23)


### Bug Fixes

* export api-loading-status types ([#231](https://github.com/visgl/react-google-maps/issues/231)) ([9695034](https://github.com/visgl/react-google-maps/commit/9695034d3c51936c2c701b7fb8be4a864f349c3e)), closes [#230](https://github.com/visgl/react-google-maps/issues/230)

## [0.7.0](https://github.com/visgl/react-google-maps/compare/v0.6.1...v0.7.0) (2024-02-15)


### ⚠ BREAKING CHANGES

* removed the `useStreetViewPanorama()` and `useDirectionsService()` hooks.

### Features

* add example for drawing tools ([#220](https://github.com/visgl/react-google-maps/issues/220)) ([75e91c4](https://github.com/visgl/react-google-maps/commit/75e91c4a3b3893ac3d97b5689682bcca5262aac9))
* restore map state when changing mapId ([#213](https://github.com/visgl/react-google-maps/issues/213)) ([0db363f](https://github.com/visgl/react-google-maps/commit/0db363f9c0291135b31ac387d4513bbaf652517a))


### Code Refactoring

* remove obsolete hooks ([#219](https://github.com/visgl/react-google-maps/issues/219)) ([69b2373](https://github.com/visgl/react-google-maps/commit/69b23734270e8754a518790620872dc1f4136cc7))

## [0.6.1](https://github.com/visgl/react-google-maps/compare/v0.6.0...v0.6.1) (2024-02-08)


### Bug Fixes

* remove deep-link into fast-deep-equal package ([#208](https://github.com/visgl/react-google-maps/issues/208)) ([f0be380](https://github.com/visgl/react-google-maps/commit/f0be3803eeb3aa0c80b19b42977e714dcb746a2f))

## [0.6.0](https://github.com/visgl/react-google-maps/compare/v0.5.4...v0.6.0) (2024-02-07)


### ⚠ BREAKING CHANGES

* The behaviour of the props controlling camera parameters (center, zoom, heading and tilt) changed. Unless you are using controlled props, you have to change the prop names from e.g. `center` to `defaultCenter` (the same goes for `zoom`, `heading` and `tilt`).

### Code Refactoring

* improved state-handling implementation ([#181](https://github.com/visgl/react-google-maps/issues/181)) ([904b918](https://github.com/visgl/react-google-maps/commit/904b918427da071477ed4bb8c2c65006b35dff88))

## [0.5.4](https://github.com/visgl/react-google-maps/compare/v0.5.3...v0.5.4) (2024-02-01)


### Bug Fixes

* prevent passing empty parameters to ApiLoader ([#193](https://github.com/visgl/react-google-maps/issues/193)) ([0601753](https://github.com/visgl/react-google-maps/commit/0601753c03539dc1180272b31aafab911ebe9c2c))

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
