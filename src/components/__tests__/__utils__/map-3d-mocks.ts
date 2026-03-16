/**
 * Mock implementations for Google Maps 3D Web Components.
 *
 * These mocks follow the pattern established by @googlemaps/jest-mocks
 * and are designed to be submitted upstream to that package.
 *
 * @see https://github.com/googlemaps/js-jest-mocks
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Base class for 3D marker elements that implements common properties.
 * Uses getter/setter for 'title' to avoid JSDOM conflicts with built-in HTML attribute.
 */
class BaseMock3DMarker extends HTMLElement {
  position?: google.maps.LatLngLiteral;
  altitudeMode?: string;
  label?: string;
  collisionBehavior?: string;
  drawsWhenOccluded?: boolean;
  extruded?: boolean;
  sizePreserved?: boolean;
  zIndex?: number;
  private _title = '';

  // Use getter/setter for title to avoid JSDOM conflicts
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }
}

/**
 * Mock implementation of google.maps.maps3d.Marker3DElement
 * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DElement
 */
export class Marker3DElement extends BaseMock3DMarker {
  constructor(options?: google.maps.maps3d.Marker3DElementOptions) {
    super();

    // Apply options if provided
    if (options) {
      Object.assign(this, options);
    }
  }
}

/**
 * Mock implementation of google.maps.maps3d.Marker3DInteractiveElement
 * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DInteractiveElement
 */
export class Marker3DInteractiveElement extends BaseMock3DMarker {
  gmpPopoverTargetElement?: google.maps.maps3d.PopoverElement;

  constructor(options?: google.maps.maps3d.Marker3DInteractiveElementOptions) {
    super();

    // Apply options if provided
    if (options) {
      Object.assign(this, options);
    }
  }
}

/**
 * Mock implementation of google.maps.maps3d.PopoverElement
 * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#PopoverElement
 */
export class PopoverElement extends HTMLElement {
  open?: boolean;
  positionAnchor?:
    | google.maps.LatLngLiteral
    | google.maps.LatLngAltitudeLiteral
    | google.maps.maps3d.Marker3DInteractiveElement
    | string;
  altitudeMode?: string;
  lightDismissDisabled?: boolean;
  autoPanDisabled?: boolean;

  constructor(options?: google.maps.maps3d.PopoverElementOptions) {
    super();

    // Apply options if provided
    if (options) {
      Object.assign(this, options);
    }
  }
}

/**
 * Mock implementation of google.maps.maps3d.Map3DElement
 * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Map3DElement
 */
export class Map3DElement extends HTMLElement {
  center?: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;
  heading?: number;
  tilt?: number;
  range?: number;
  roll?: number;
  mode?: string;
  gestureHandling?: string;
  defaultLabelsDisabled?: boolean;

  constructor(options?: google.maps.maps3d.Map3DElementOptions) {
    super();

    // Apply options if provided
    if (options) {
      Object.assign(this, options);
    }
  }

  flyCameraAround(options: google.maps.maps3d.FlyAroundAnimationOptions): void {
    // Mock implementation
  }

  flyCameraTo(options: google.maps.maps3d.FlyToAnimationOptions): void {
    // Mock implementation
  }

  stopCameraAnimation(): void {
    // Mock implementation
  }

  // HTMLElement methods for child management
  appendChild<T extends Node>(node: T): T {
    return super.appendChild(node);
  }

  removeChild<T extends Node>(node: T): T {
    return super.removeChild(node);
  }
}

/**
 * Registers all 3D web component mocks with their correct tag names.
 * Call this function once per test file to ensure the custom elements are available.
 *
 * This function is idempotent - it will only register elements that aren't already defined.
 */
export function register3DWebComponentMocks(): void {
  if (!customElements.get('gmp-marker-3d')) {
    customElements.define('gmp-marker-3d', Marker3DElement);
  }

  if (!customElements.get('gmp-marker-3d-interactive')) {
    customElements.define(
      'gmp-marker-3d-interactive',
      Marker3DInteractiveElement
    );
  }

  if (!customElements.get('gmp-popover')) {
    customElements.define('gmp-popover', PopoverElement);
  }

  if (!customElements.get('gmp-map-3d')) {
    customElements.define('gmp-map-3d', Map3DElement);
  }
}
