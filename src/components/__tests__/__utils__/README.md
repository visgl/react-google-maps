# Test Utilities for Google Maps 3D Components

This directory contains mock implementations for Google Maps 3D web components that follow the pattern established by [`@googlemaps/jest-mocks`](https://github.com/googlemaps/js-jest-mocks).

## Files

- **`map-3d-mocks.ts`** - Mock implementations of Google Maps 3D web components

## Usage in Tests

### Basic Pattern

The mocks are designed to work with Jest and React Testing Library. Here's the recommended pattern:

```typescript
import {
  Marker3DElement,
  Marker3DInteractiveElement,
  register3DWebComponentMocks
} from '../../__test-utils__/map-3d-mocks';

// Extend mock classes to add spy functionality
class SpyMarker3DElement extends Marker3DElement {
  constructor(options?: google.maps.maps3d.Marker3DElementOptions) {
    super(options);
    if (typeof (globalThis as any).__marker3dFactory === 'function') {
      (globalThis as any).__marker3dFactory(this);
    }
  }
}

// Register the spy-enabled version
if (!customElements.get('gmp-marker-3d')) {
  customElements.define('gmp-marker-3d', SpyMarker3DElement);
}

// In beforeEach:
beforeEach(() => {
  const spy = jest.fn();
  (globalThis as any).__marker3dFactory = (instance: any) => spy(instance);
});
```

### Why This Pattern?

1. **Custom Elements Can't Be Unregistered**: Once a custom element is defined, it persists for the entire JSDOM instance
2. **Factory Pattern for Fresh Spies**: By using a factory function on `globalThis`, we can create fresh spies for each test
3. **Separation of Concerns**: Base mocks live in `__test-utils__`, test-specific spy wrappers live in test files

## Mocked Components

### Marker3DElement

Mock for `google.maps.maps3d.Marker3DElement`

- Tag name: `gmp-marker-3d`
- Properties: position, altitudeMode, label, collisionBehavior, drawsWhenOccluded, extruded, sizePreserved, zIndex, title

### Marker3DInteractiveElement

Mock for `google.maps.maps3d.Marker3DInteractiveElement`

- Tag name: `gmp-marker-3d-interactive`
- Extends: Marker3DElement
- Additional properties: gmpPopoverTargetElement

### PopoverElement

Mock for `google.maps.maps3d.PopoverElement`

- Tag name: `gmp-popover`
- Properties: open, positionAnchor, altitudeMode, lightDismissDisabled, autoPanDisabled

### Map3DElement

Mock for `google.maps.maps3d.Map3DElement`

- Tag name: `gmp-map-3d`
- Properties: center, heading, tilt, range, roll, mode, gestureHandling, defaultLabelsDisabled
- Methods: flyCameraAround, flyCameraTo, stopCameraAnimation

## Key Implementation Details

### Title Property Handling

The `title` property uses a getter/setter pattern to avoid conflicts with JSDOM's built-in HTML `title` attribute:

```typescript
private _title = '';

get title(): string {
  return this._title;
}

set title(value: string) {
  this._title = value;
}
```

### Base Class Pattern

`BaseMock3DMarker` contains common properties shared between `Marker3DElement` and `Marker3DInteractiveElement` to reduce repetition.

## Future Plans

These mocks are designed to be contributed upstream to `@googlemaps/jest-mocks`. They follow the same patterns as the existing mocks in that package:

- Extend `HTMLElement`
- Accept options in constructor
- Use `Object.assign` to apply options
- Define custom elements with correct tag names

## Related Issues

- Google Maps 3D web components: https://developers.google.com/maps/documentation/javascript/reference/3d-map
- `@googlemaps/jest-mocks`: https://github.com/googlemaps/js-jest-mocks
