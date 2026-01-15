/* eslint-disable
     @typescript-eslint/triple-slash-reference,
     @typescript-eslint/no-empty-object-type */

/// <reference path="../node_modules/@types/google.maps/index.d.ts" />

/**
 * Type extensions for @types/google.maps to include newer properties
 * not yet available in the published type definitions.
 */

declare namespace google.maps {
  interface MapOptions {
    /**
     * Attribution IDs for internal usage tracking.
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.internalUsageAttributionIds
     */
    internalUsageAttributionIds?: Iterable<string> | null;
  }

  namespace marker {
    interface AdvancedMarkerElementOptions {
      /**
       * A CSS length-percentage value which is used to offset the anchor point of the marker from the top left corner of the marker. This is useful when using a visual which has an anchor point that is different than the typical bottom center point of the default marker. The default value is "-%50".
       */
      anchorLeft?: string;
      /**
       * A CSS length-percentage value which is used to offset the anchor point of the marker from the top left corner of the marker. This is useful when using a visual which has an anchor point that is different than the typical bottom center point of the default marker. The default value is "-%100".
       */
      anchorTop?: string;
    }

    interface AdvancedMarkerElement {
      /**
       * A CSS length-percentage value which is used to offset the anchor point of the marker from the top left corner of the marker. This is useful when using a visual which has an anchor point that is different than the typical bottom center point of the default marker. The default value is "-%50".
       */
      anchorLeft?: string;
      /**
       * A CSS length-percentage value which is used to offset the anchor point of the marker from the top left corner of the marker. This is useful when using a visual which has an anchor point that is different than the typical bottom center point of the default marker. The default value is "-%100".
       */
      anchorTop?: string;
    }
  }

  /**
   * Namespace for 3D Maps functionality.
   * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map
   */
  namespace maps3d {
    /**
     * Map3DElement is an HTML interface for the 3D Map view.
     * Note that the mode must be set for the 3D Map to start rendering.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Map3DElement
     */
    class Map3DElement extends HTMLElement implements Map3DElementOptions {
      constructor(options?: Map3DElementOptions);

      /**
       * When set, restricts the position of the camera within the specified lat/lng bounds.
       */
      bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;

      /**
       * The center of the map given as a LatLngAltitude, where altitude is in meters above ground level.
       */
      center?: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;

      /**
       * When true, all default UI buttons are hidden.
       * @default false
       */
      defaultUIHidden?: boolean;

      /**
       * Specifies how gesture events should be handled on the map element.
       * @default GestureHandling.AUTO
       */
      gestureHandling?: GestureHandling;

      /**
       * The compass heading of the map, in degrees, where due north is zero.
       */
      heading?: number;

      /**
       * Attribution IDs for internal usage tracking.
       */
      internalUsageAttributionIds?: Iterable<string>;

      /**
       * The maximum altitude above the ground which will be displayed on the map.
       * A valid value is between 0 and 63170000 meters (Earth radius multiplied by 10).
       */
      maxAltitude?: number;

      /**
       * The maximum angle of heading (rotation) of the map.
       * A valid value is between 0 and 360 degrees.
       */
      maxHeading?: number;

      /**
       * The maximum angle of incidence of the map.
       * A valid value is between 0 and 90 degrees.
       */
      maxTilt?: number;

      /**
       * The minimum altitude above the ground which will be displayed on the map.
       * A valid value is between 0 and 63170000 meters (Earth radius multiplied by 10).
       */
      minAltitude?: number;

      /**
       * The minimum angle of heading (rotation) of the map.
       * A valid value is between 0 and 360 degrees.
       */
      minHeading?: number;

      /**
       * The minimum angle of incidence of the map.
       * A valid value is between 0 and 90 degrees.
       */
      minTilt?: number;

      /**
       * Specifies a mode the map should be rendered in.
       * If not set, the map won't be rendered.
       */
      mode?: MapMode;

      /**
       * The distance from camera to the center of the map, in meters.
       */
      range?: number;

      /**
       * The roll of the camera around the view vector in degrees.
       */
      roll?: number;

      /**
       * The tilt of the camera's view vector in degrees.
       */
      tilt?: number;

      /**
       * @deprecated Please use Map3DElement.defaultUIHidden instead.
       * When true, all default UI buttons are disabled.
       * @default false
       */
      defaultUIDisabled?: boolean;

      /**
       * This method orbits the camera around a given location for a given duration.
       */
      flyCameraAround(options: FlyAroundAnimationOptions): void;

      /**
       * This method moves the camera parabolically from the current location to a given end location.
       */
      flyCameraTo(options: FlyToAnimationOptions): void;

      /**
       * This method stops any fly animation that might happen to be running.
       */
      stopCameraAnimation(): void;

      addEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | AddEventListenerOptions
      ): void;

      removeEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | EventListenerOptions
      ): void;
    }

    /**
     * Map3DElementOptions object used to define the properties that can be set on a Map3DElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Map3DElementOptions
     */
    interface Map3DElementOptions {
      bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
      center?: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;
      /** @deprecated Please use defaultUIHidden instead. */
      defaultUIDisabled?: boolean;
      defaultUIHidden?: boolean;
      heading?: number;
      internalUsageAttributionIds?: Iterable<string>;
      maxAltitude?: number;
      maxHeading?: number;
      maxTilt?: number;
      minAltitude?: number;
      minHeading?: number;
      minTilt?: number;
      mode?: MapMode;
      range?: number;
      roll?: number;
      tilt?: number;
    }

    /**
     * Specifies a mode the map should be rendered in.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#MapMode
     */
    enum MapMode {
      /** This map mode displays a transparent layer of major streets on satellite imagery. */
      HYBRID = 'HYBRID',
      /** This map mode displays satellite or photorealistic imagery. */
      SATELLITE = 'SATELLITE'
    }

    /**
     * Specifies how gesture events should be handled on the map element.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#GestureHandling
     */
    enum GestureHandling {
      /**
       * This lets the map choose whether to use cooperative or greedy gesture handling.
       * This is the default behavior if not specified.
       * This will cause the map to enter cooperative mode if the map is dominating its
       * scroll parent (usually the host page) to where the user cannot scroll away from
       * the map to other content.
       */
      AUTO = 'AUTO',
      /**
       * This forces cooperative mode, where modifier keys or two-finger gestures
       * are required to scroll the map.
       */
      COOPERATIVE = 'COOPERATIVE',
      /**
       * This forces greedy mode, where the host page cannot be scrolled from user
       * events on the map element.
       */
      GREEDY = 'GREEDY'
    }

    /**
     * Customization options for the FlyCameraAround Animation.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#FlyAroundAnimationOptions
     */
    interface FlyAroundAnimationOptions {
      /**
       * The central point at which the camera should look at during the orbit animation.
       */
      camera: CameraOptions;
      /**
       * The duration of one animation cycle in milliseconds.
       */
      durationMillis?: number;
      /**
       * Specifies the number of times an animation should repeat.
       * If the number is zero, the animation will complete immediately after it starts.
       */
      repeatCount?: number;
      /**
       * @deprecated Please use repeatCount instead.
       */
      rounds?: number;
    }

    /**
     * Customization options for the FlyCameraTo Animation.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#FlyToAnimationOptions
     */
    interface FlyToAnimationOptions {
      /**
       * The location at which the camera should point at the end of the animation.
       */
      endCamera: CameraOptions;
      /**
       * The duration of the animation in milliseconds.
       * A duration of 0 will teleport the camera straight to the end position.
       */
      durationMillis?: number;
    }

    /**
     * CameraOptions object used to define the properties that can be set on a camera object.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#CameraOptions
     */
    interface CameraOptions {
      center?: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;
      heading?: number;
      range?: number;
      roll?: number;
      tilt?: number;
    }

    /**
     * This event is created from monitoring a steady state of Map3DElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#SteadyChangeEvent
     */
    class SteadyChangeEvent extends Event {
      /**
       * Indicates whether Map3DElement is steady (i.e. all rendering for the current scene has completed) or not.
       */
      isSteady: boolean;
    }

    /**
     * This event is created from clicking a Map3DElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#LocationClickEvent
     */
    class LocationClickEvent extends Event {
      /**
       * The latitude/longitude/altitude that was below the cursor when the event occurred.
       */
      position?: google.maps.LatLngAltitude;
    }

    /**
     * This event is created from clicking on a place icon on a Map3DElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#PlaceClickEvent
     */
    class PlaceClickEvent extends LocationClickEvent {
      /**
       * The place id of the map feature.
       */
      placeId: string;

      /**
       * Fetches a Place for this place id.
       */
      fetchPlace(): Promise<google.maps.places.Place>;
    }

    /**
     * Shows a position on a 3D map.
     * Note that the position must be set for the Marker3DElement to display.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DElement
     */
    class Marker3DElement
      extends HTMLElement
      implements Marker3DElementOptions
    {
      constructor(options?: Marker3DElementOptions);

      /**
       * Specifies how the altitude component of the position is interpreted.
       * @default AltitudeMode.CLAMP_TO_GROUND
       */
      altitudeMode?: AltitudeMode;

      /**
       * An enumeration specifying how a Marker3DElement should behave when it collides with another Marker3DElement or with the basemap labels.
       * @default CollisionBehavior.REQUIRED
       */
      collisionBehavior?: google.maps.marker.CollisionBehavior;

      /**
       * Specifies whether this marker should be drawn or not when it's occluded.
       * @default false
       */
      drawsWhenOccluded?: boolean;

      /**
       * Specifies whether to connect the marker to the ground.
       * @default false
       */
      extruded?: boolean;

      /**
       * Text to be displayed by this marker.
       */
      label?: string;

      /**
       * The location of the tip of the marker.
       */
      position?:
        | google.maps.LatLngLiteral
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral;

      /**
       * Specifies whether this marker should preserve its size or not regardless of distance from camera.
       * @default false
       */
      sizePreserved?: boolean;

      /**
       * The zIndex compared to other markers.
       */
      zIndex?: number;

      addEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | AddEventListenerOptions
      ): void;

      removeEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | EventListenerOptions
      ): void;
    }

    /**
     * Marker3DElementOptions object used to define the properties that can be set on a Marker3DElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DElementOptions
     */
    interface Marker3DElementOptions {
      altitudeMode?: AltitudeMode;
      collisionBehavior?: google.maps.marker.CollisionBehavior;
      drawsWhenOccluded?: boolean;
      extruded?: boolean;
      label?: string;
      position?:
        | google.maps.LatLngLiteral
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral;
      sizePreserved?: boolean;
      zIndex?: number;
    }

    /**
     * Shows a position on a 3D map with interactive capabilities.
     * Unlike Marker3DElement, Marker3DInteractiveElement receives a gmp-click event.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DInteractiveElement
     */
    class Marker3DInteractiveElement
      extends Marker3DElement
      implements Marker3DInteractiveElementOptions
    {
      constructor(options?: Marker3DInteractiveElementOptions);

      /**
       * When set, the popover element will be open on this marker's click.
       */
      gmpPopoverTargetElement?: PopoverElement;

      /**
       * Rollover text.
       */
      title: string;
    }

    /**
     * Marker3DInteractiveElementOptions object used to define the properties that can be set on a Marker3DInteractiveElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Marker3DInteractiveElementOptions
     */
    interface Marker3DInteractiveElementOptions extends Marker3DElementOptions {
      gmpPopoverTargetElement?: PopoverElement;
      title?: string;
    }

    /**
     * A 3D model which allows the rendering of gLTF models.
     * Note that the position and the src must be set for the Model3DElement to display.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Model3DElement
     */
    class Model3DElement extends HTMLElement implements Model3DElementOptions {
      constructor(options?: Model3DElementOptions);

      /**
       * Specifies how altitude in the position is interpreted.
       * @default AltitudeMode.CLAMP_TO_GROUND
       */
      altitudeMode?: AltitudeMode;

      /**
       * Describes rotation of a 3D model's coordinate system to position the model on the 3D Map.
       */
      orientation?:
        | google.maps.Orientation3D
        | google.maps.Orientation3DLiteral;

      /**
       * Sets the Model3DElement's position.
       */
      position?:
        | google.maps.LatLngLiteral
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral;

      /**
       * Scales the model along the x, y, and z axes in the model's coordinate space.
       * @default 1
       */
      scale?: number | google.maps.Vector3D | google.maps.Vector3DLiteral;

      /**
       * Specifies the url of the 3D model. At this time, only models in the .glb format are supported.
       */
      src?: string | URL;

      addEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | AddEventListenerOptions
      ): void;

      removeEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | EventListenerOptions
      ): void;
    }

    /**
     * Model3DElementOptions object used to define the properties that can be set on a Model3DElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Model3DElementOptions
     */
    interface Model3DElementOptions {
      altitudeMode?: AltitudeMode;
      orientation?:
        | google.maps.Orientation3D
        | google.maps.Orientation3DLiteral;
      position?:
        | google.maps.LatLngLiteral
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral;
      scale?: number | google.maps.Vector3D | google.maps.Vector3DLiteral;
      src?: string | URL;
    }

    /**
     * A 3D model with interactive capabilities.
     * Unlike Model3DElement, Model3DInteractiveElement receives a gmp-click event.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Model3DInteractiveElement
     */
    class Model3DInteractiveElement
      extends Model3DElement
      implements Model3DInteractiveElementOptions
    {
      constructor(options?: Model3DElementOptions);
    }

    /**
     * Model3DInteractiveElementOptions object used to define the properties that can be set on a Model3DInteractiveElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Model3DInteractiveElementOptions
     */
    interface Model3DInteractiveElementOptions extends Model3DElementOptions {}

    /**
     * A 3D polyline is a linear overlay of connected line segments on a 3D map.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polyline3DElement
     */
    class Polyline3DElement
      extends HTMLElement
      implements Polyline3DElementOptions
    {
      constructor(options?: Polyline3DElementOptions);

      /**
       * Specifies how altitude components in the coordinates are interpreted.
       * @default AltitudeMode.CLAMP_TO_GROUND
       */
      altitudeMode?: AltitudeMode;

      /**
       * Specifies whether parts of the polyline which could be occluded are drawn or not.
       * @default false
       */
      drawsOccludedSegments?: boolean;

      /**
       * Specifies whether to connect the polyline to the ground.
       * @default false
       */
      extruded?: boolean;

      /**
       * When true, edges of the polyline are interpreted as geodesic.
       * @default false
       */
      geodesic?: boolean;

      /**
       * The outer color. All CSS3 colors are supported.
       */
      outerColor?: string;

      /**
       * The outer width is between 0.0 and 1.0. This is a percentage of the strokeWidth.
       */
      outerWidth?: number;

      /**
       * The ordered sequence of coordinates of the Polyline.
       */
      path?: Iterable<
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral
        | google.maps.LatLngLiteral
      >;

      /**
       * The stroke color. All CSS3 colors are supported.
       */
      strokeColor?: string;

      /**
       * The stroke width in pixels.
       */
      strokeWidth?: number;

      /**
       * The zIndex compared to other polys.
       */
      zIndex?: number;

      /**
       * @deprecated Use path instead.
       */
      coordinates?: Iterable<
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral
        | google.maps.LatLngLiteral
      >;

      addEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | AddEventListenerOptions
      ): void;

      removeEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | EventListenerOptions
      ): void;
    }

    /**
     * Polyline3DElementOptions object used to define the properties that can be set on a Polyline3DElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polyline3DElementOptions
     */
    interface Polyline3DElementOptions {
      altitudeMode?: AltitudeMode;
      /** @deprecated Use path instead. */
      coordinates?: Iterable<
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral
        | google.maps.LatLngLiteral
      >;
      drawsOccludedSegments?: boolean;
      extruded?: boolean;
      geodesic?: boolean;
      outerColor?: string;
      outerWidth?: number;
      strokeColor?: string;
      strokeWidth?: number;
      zIndex?: number;
    }

    /**
     * A 3D polyline with interactive capabilities.
     * Unlike Polyline3DElement, Polyline3DInteractiveElement receives a gmp-click event.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polyline3DInteractiveElement
     */
    class Polyline3DInteractiveElement
      extends Polyline3DElement
      implements Polyline3DInteractiveElementOptions
    {
      constructor(options?: Polyline3DElementOptions);
    }

    /**
     * Polyline3DInteractiveElementOptions object used to define the properties that can be set on a Polyline3DInteractiveElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polyline3DInteractiveElementOptions
     */
    interface Polyline3DInteractiveElementOptions
      extends Polyline3DElementOptions {}

    /**
     * A 3D polygon defines a series of connected coordinates in an ordered sequence.
     * Polygons form a closed loop and define a filled region.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polygon3DElement
     */
    class Polygon3DElement
      extends HTMLElement
      implements Polygon3DElementOptions
    {
      constructor(options?: Polygon3DElementOptions);

      /**
       * Specifies how altitude components in the coordinates are interpreted.
       * @default AltitudeMode.CLAMP_TO_GROUND
       */
      altitudeMode?: AltitudeMode;

      /**
       * Specifies whether parts of the polygon which could be occluded are drawn or not.
       * @default false
       */
      drawsOccludedSegments?: boolean;

      /**
       * Specifies whether to connect the polygon to the ground.
       * @default false
       */
      extruded?: boolean;

      /**
       * The fill color. All CSS3 colors are supported.
       */
      fillColor?: string;

      /**
       * When true, edges of the polygon are interpreted as geodesic.
       * @default false
       */
      geodesic?: boolean;

      /**
       * The ordered sequence of coordinates that designates a closed loop.
       */
      innerPaths?: Iterable<
        Iterable<
          | google.maps.LatLngAltitude
          | google.maps.LatLngAltitudeLiteral
          | google.maps.LatLngLiteral
        >
      >;

      /**
       * The ordered sequence of coordinates that designates a closed loop.
       */
      path?: Iterable<
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral
        | google.maps.LatLngLiteral
      >;

      /**
       * The stroke color. All CSS3 colors are supported.
       */
      strokeColor?: string;

      /**
       * The stroke width in pixels.
       */
      strokeWidth?: number;

      /**
       * The zIndex compared to other polys.
       */
      zIndex?: number;

      /**
       * @deprecated Use path instead.
       */
      outerCoordinates?: Iterable<
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral
        | google.maps.LatLngLiteral
      >;

      /**
       * @deprecated Use innerPaths instead.
       */
      innerCoordinates?: Iterable<
        Iterable<
          | google.maps.LatLngAltitude
          | google.maps.LatLngAltitudeLiteral
          | google.maps.LatLngLiteral
        >
      >;

      addEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | AddEventListenerOptions
      ): void;

      removeEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | EventListenerOptions
      ): void;
    }

    /**
     * Polygon3DElementOptions object used to define the properties that can be set on a Polygon3DElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polygon3DElementOptions
     */
    interface Polygon3DElementOptions {
      altitudeMode?: AltitudeMode;
      drawsOccludedSegments?: boolean;
      extruded?: boolean;
      fillColor?: string;
      geodesic?: boolean;
      /** @deprecated Use innerPaths instead. */
      innerCoordinates?: Iterable<
        Iterable<
          | google.maps.LatLngAltitude
          | google.maps.LatLngAltitudeLiteral
          | google.maps.LatLngLiteral
        >
      >;
      /** @deprecated Use path instead. */
      outerCoordinates?: Iterable<
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral
        | google.maps.LatLngLiteral
      >;
      strokeColor?: string;
      strokeWidth?: number;
      zIndex?: number;
    }

    /**
     * A 3D polygon with interactive capabilities.
     * Unlike Polygon3DElement, Polygon3DInteractiveElement receives a gmp-click event.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polygon3DInteractiveElement
     */
    class Polygon3DInteractiveElement
      extends Polygon3DElement
      implements Polygon3DInteractiveElementOptions
    {
      constructor(options?: Polygon3DElementOptions);
    }

    /**
     * Polygon3DInteractiveElementOptions object used to define the properties that can be set on a Polygon3DInteractiveElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Polygon3DInteractiveElementOptions
     */
    interface Polygon3DInteractiveElementOptions
      extends Polygon3DElementOptions {}

    /**
     * A custom HTML element that renders a popover.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#PopoverElement
     */
    class PopoverElement extends HTMLElement implements PopoverElementOptions {
      constructor(options?: PopoverElementOptions);

      /**
       * Specifies how the altitude component of the position is interpreted.
       * @default AltitudeMode.CLAMP_TO_GROUND
       */
      altitudeMode?: AltitudeMode;

      /**
       * Specifies whether this popover should be "light dismissed" or not.
       * @default false
       */
      lightDismissDisabled?: boolean;

      /**
       * Specifies whether this popover should be open or not.
       * @default false
       */
      open?: boolean;

      /**
       * The position at which to display this popover.
       */
      positionAnchor?:
        | google.maps.LatLngLiteral
        | google.maps.LatLngAltitudeLiteral
        | Marker3DInteractiveElement
        | string;

      addEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | AddEventListenerOptions
      ): void;

      removeEventListener(
        type: string,
        listener: EventListener | EventListenerObject,
        options?: boolean | EventListenerOptions
      ): void;
    }

    /**
     * PopoverElementOptions object used to define the properties that can be set on a PopoverElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#PopoverElementOptions
     */
    interface PopoverElementOptions {
      altitudeMode?: AltitudeMode;
      lightDismissDisabled?: boolean;
      open?: boolean;
      positionAnchor?:
        | google.maps.LatLngLiteral
        | google.maps.LatLngAltitudeLiteral
        | string
        | Marker3DInteractiveElement;
    }

    /**
     * Specifies how altitude components in the coordinates are interpreted.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#AltitudeMode
     */
    enum AltitudeMode {
      /**
       * Allows to express objects relative to the average mean sea level.
       */
      ABSOLUTE = 'ABSOLUTE',
      /**
       * Allows to express objects placed on the ground.
       */
      CLAMP_TO_GROUND = 'CLAMP_TO_GROUND',
      /**
       * Allows to express objects relative to the ground surface.
       */
      RELATIVE_TO_GROUND = 'RELATIVE_TO_GROUND',
      /**
       * Allows to express objects relative to the highest of ground+building+water surface.
       */
      RELATIVE_TO_MESH = 'RELATIVE_TO_MESH'
    }
  }

  /**
   * Maps3D Library interface for use with importLibrary('maps3d').
   */
  interface Maps3DLibrary {
    Map3DElement: typeof maps3d.Map3DElement;
    Marker3DElement: typeof maps3d.Marker3DElement;
    Marker3DInteractiveElement: typeof maps3d.Marker3DInteractiveElement;
    Model3DElement: typeof maps3d.Model3DElement;
    Model3DInteractiveElement: typeof maps3d.Model3DInteractiveElement;
    Polyline3DElement: typeof maps3d.Polyline3DElement;
    Polyline3DInteractiveElement: typeof maps3d.Polyline3DInteractiveElement;
    Polygon3DElement: typeof maps3d.Polygon3DElement;
    Polygon3DInteractiveElement: typeof maps3d.Polygon3DInteractiveElement;
    PopoverElement: typeof maps3d.PopoverElement;
    AltitudeMode: typeof maps3d.AltitudeMode;
    GestureHandling: typeof maps3d.GestureHandling;
    MapMode: typeof maps3d.MapMode;
  }
}

namespace google.maps.marker {
  interface AdvancedMarkerElementOptions {
    anchorLeft?: string;
    anchorTop?: string;
  }

  interface AdvancedMarkerElement {
    anchorLeft?: string;
    anchorTop?: string;
  }

  interface PinElementOptions {
    /** @deprecated use glyphSrc or glyphText instead */
    glyph?: string | Element | URL | null;
    /** @deprecated use DOM children instead */
    readonly element?: HTMLElement | null;

    glyphColor?: string | null;
    glyphSrc?: string | URL | null;
    glyphText?: string | null;
  }

  interface PinElement {
    /** @deprecated use glyphSrc or glyphText instead */
    glyph?: string | Element | URL | null;
    glyphColor?: string | null;
    glyphSrc?: string | URL | null;
    glyphText?: string | null;
  }
}

declare namespace google.maps.maps3d {
  export enum AltitudeMode {
    ABSOLUTE = 'ABSOLUTE',
    CLAMP_TO_GROUND = 'CLAMP_TO_GROUND',
    RELATIVE_TO_GROUND = 'RELATIVE_TO_GROUND',
    RELATIVE_TO_MESH = 'RELATIVE_TO_MESH'
  }

  export interface CameraOptions {
    center?:
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    heading?: number | null;
    range?: number | null;
    roll?: number | null;
    tilt?: number | null;
  }

  export interface FlyAroundAnimationOptions {
    camera: google.maps.maps3d.CameraOptions;
    durationMillis?: number;
    rounds?: number;
  }

  export interface FlyToAnimationOptions {
    durationMillis?: number;
    endCamera: google.maps.maps3d.CameraOptions;
  }

  export class Map3DElement
    extends HTMLElement
    implements google.maps.maps3d.Map3DElementOptions
  {
    constructor(options?: google.maps.maps3d.Map3DElementOptions);
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | null;
    center?:
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    defaultUIDisabled?: boolean | null;
    heading?: number | null;
    maxAltitude?: number | null;
    maxHeading?: number | null;
    maxTilt?: number | null;
    minAltitude?: number | null;
    minHeading?: number | null;
    minTilt?: number | null;
    mode?: google.maps.maps3d.MapMode | null;
    range?: number | null;
    roll?: number | null;
    tilt?: number | null;
    flyCameraAround(
      options: google.maps.maps3d.FlyAroundAnimationOptions
    ): void;
    flyCameraTo(options: google.maps.maps3d.FlyToAnimationOptions): void;
    stopCameraAnimation(): void;
  }

  export interface Map3DElementOptions {
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | null;
    center?:
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    defaultUIDisabled?: boolean | null;
    heading?: number | null;
    maxAltitude?: number | null;
    maxHeading?: number | null;
    maxTilt?: number | null;
    minAltitude?: number | null;
    minHeading?: number | null;
    minTilt?: number | null;
    mode?: google.maps.maps3d.MapMode | null;
    range?: number | null;
    roll?: number | null;
    tilt?: number | null;
  }

  export enum MapMode {
    HYBRID = 'HYBRID',
    SATELLITE = 'SATELLITE'
  }

  export class Marker3DElement
    extends HTMLElement
    implements google.maps.maps3d.Marker3DElementOptions
  {
    constructor(options?: google.maps.maps3d.Marker3DElementOptions);
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    collisionBehavior?: google.maps.CollisionBehavior | null;
    drawsWhenOccluded?: boolean | null;
    extruded?: boolean | null;
    label?: string | null;
    position?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    sizePreserved?: boolean | null;
    zIndex?: number | null;
  }

  export interface Marker3DElementOptions {
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    collisionBehavior?: google.maps.CollisionBehavior | null;
    drawsWhenOccluded?: boolean | null;
    extruded?: boolean | null;
    label?: string | null;
    position?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    sizePreserved?: boolean | null;
    zIndex?: number | null;
  }

  export class Marker3DInteractiveElement
    extends google.maps.maps3d.Marker3DElement
    implements google.maps.maps3d.Marker3DInteractiveElementOptions
  {
    constructor(options?: google.maps.maps3d.Marker3DInteractiveElementOptions);
    gmpPopoverTargetElement?: google.maps.maps3d.PopoverElement | null;
    title: string;
  }

  export interface Marker3DInteractiveElementOptions
    extends google.maps.maps3d.Marker3DElementOptions {
    gmpPopoverTargetElement?: google.maps.maps3d.PopoverElement | null;
    title?: string;
  }

  export class Model3DElement
    extends HTMLElement
    implements google.maps.maps3d.Model3DElementOptions
  {
    constructor(options?: google.maps.maps3d.Model3DElementOptions);
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    orientation?:
      | google.maps.Orientation3D
      | google.maps.Orientation3DLiteral
      | null;
    position?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    scale?: number | google.maps.Vector3D | google.maps.Vector3DLiteral | null;
    src?: string | URL | null;
  }

  export interface Model3DElementOptions {
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    orientation?:
      | google.maps.Orientation3D
      | google.maps.Orientation3DLiteral
      | null;
    position?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    scale?: number | google.maps.Vector3D | google.maps.Vector3DLiteral | null;
    src?: string | URL | null;
  }

  export class Model3DInteractiveElement
    extends google.maps.maps3d.Model3DElement
    implements google.maps.maps3d.Model3DInteractiveElementOptions
  {
    constructor(options?: google.maps.maps3d.Model3DElementOptions);
  }

  export interface Model3DInteractiveElementOptions
    extends google.maps.maps3d.Model3DElementOptions {}

  export class Polygon3DElement
    extends HTMLElement
    implements google.maps.maps3d.Polygon3DElementOptions
  {
    constructor(options?: google.maps.maps3d.Polygon3DElementOptions);
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    drawsOccludedSegments?: boolean | null;
    extruded?: boolean | null;
    fillColor?: string | null;
    geodesic?: boolean | null;
    innerCoordinates?: Iterable<
      Iterable<
        | google.maps.LatLngAltitude
        | google.maps.LatLngAltitudeLiteral
        | google.maps.LatLngLiteral
      >
    > | null;
    outerCoordinates?: Iterable<
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | google.maps.LatLngLiteral
    > | null;
    strokeColor?: string | null;
    strokeWidth?: number | null;
    zIndex?: number | null;
  }

  export interface Polygon3DElementOptions {
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    drawsOccludedSegments?: boolean | null;
    extruded?: boolean | null;
    fillColor?: string | null;
    geodesic?: boolean | null;
    innerCoordinates?: Iterable<
      | Iterable<google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral>
      | Iterable<google.maps.LatLngLiteral>
    > | null;
    outerCoordinates?: Iterable<
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | google.maps.LatLngLiteral
    > | null;
    strokeColor?: string | null;
    strokeWidth?: number | null;
    zIndex?: number | null;
  }

  export class Polygon3DInteractiveElement
    extends google.maps.maps3d.Polygon3DElement
    implements google.maps.maps3d.Polygon3DInteractiveElementOptions
  {
    constructor(options?: google.maps.maps3d.Polygon3DElementOptions);
  }

  export interface Polygon3DInteractiveElementOptions
    extends google.maps.maps3d.Polygon3DElementOptions {}

  export class Polyline3DElement
    extends HTMLElement
    implements google.maps.maps3d.Polyline3DElementOptions
  {
    constructor(options?: google.maps.maps3d.Polyline3DElementOptions);
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    coordinates?: Iterable<
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | google.maps.LatLngLiteral
    > | null;
    drawsOccludedSegments?: boolean | null;
    extruded?: boolean | null;
    geodesic?: boolean | null;
    outerColor?: string | null;
    outerWidth?: number | null;
    strokeColor?: string | null;
    strokeWidth?: number | null;
    zIndex?: number | null;
  }

  export interface Polyline3DElementOptions {
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    coordinates?: Iterable<
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | google.maps.LatLngLiteral
    > | null;
    drawsOccludedSegments?: boolean | null;
    extruded?: boolean | null;
    geodesic?: boolean | null;
    outerColor?: string | null;
    outerWidth?: number | null;
    strokeColor?: string | null;
    strokeWidth?: number | null;
    zIndex?: number | null;
  }

  export class Polyline3DInteractiveElement
    extends google.maps.maps3d.Polyline3DElement
    implements google.maps.maps3d.Polyline3DInteractiveElementOptions
  {
    constructor(options?: google.maps.maps3d.Polyline3DElementOptions);
  }

  export interface Polyline3DInteractiveElementOptions
    extends google.maps.maps3d.Polyline3DElementOptions {}

  export class PopoverElement
    extends HTMLElement
    implements google.maps.maps3d.PopoverElementOptions
  {
    constructor(options?: google.maps.maps3d.PopoverElementOptions);
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    lightDismissDisabled?: boolean | null;
    open?: boolean | null;
    positionAnchor?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitudeLiteral
      | google.maps.maps3d.Marker3DInteractiveElement
      | string
      | null;
  }

  export interface PopoverElementOptions {
    altitudeMode?: google.maps.maps3d.AltitudeMode | null;
    lightDismissDisabled?: boolean | null;
    open?: boolean | null;
    positionAnchor?:
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitudeLiteral
      | string
      | google.maps.maps3d.Marker3DInteractiveElement
      | null;
  }
}

declare namespace google.maps.places {
  export class AccessibilityOptions {
    hasWheelchairAccessibleEntrance: boolean | null;
    hasWheelchairAccessibleParking: boolean | null;
    hasWheelchairAccessibleRestroom: boolean | null;
    hasWheelchairAccessibleSeating: boolean | null;
  }

  export class AddressComponent {
    longText: string | null;
    shortText: string | null;
    types: string[];
  }

  export class Attribution {
    provider: string | null;
    providerURI: string | null;
  }

  export enum AttributionColor {
    BLACK = 'BLACK',
    GRAY = 'GRAY',
    WHITE = 'WHITE'
  }

  export class AuthorAttribution {
    displayName: string;
    photoURI: string | null;
    uri: string | null;
  }

  export class AutocompleteSessionToken {
    constructor();
  }

  export enum BusinessStatus {
    CLOSED_PERMANENTLY = 'CLOSED_PERMANENTLY',
    CLOSED_TEMPORARILY = 'CLOSED_TEMPORARILY',
    OPERATIONAL = 'OPERATIONAL'
  }

  export interface ComponentRestrictions {
    country: string | string[] | null;
  }

  export class ConnectorAggregation {
    availabilityLastUpdateTime: Date | null;
    availableCount: number | null;
    count: number;
    maxChargeRateKw: number;
    outOfServiceCount: number | null;
    type: google.maps.places.EVConnectorType | null;
  }

  export class EVChargeOptions {
    connectorAggregations: google.maps.places.ConnectorAggregation[];
    connectorCount: number;
  }

  export enum EVConnectorType {
    CCS_COMBO_1 = 'CCS_COMBO_1',
    CCS_COMBO_2 = 'CCS_COMBO_2',
    CHADEMO = 'CHADEMO',
    J1772 = 'J1772',
    NACS = 'NACS',
    OTHER = 'OTHER',
    TESLA = 'TESLA',
    TYPE_2 = 'TYPE_2',
    UNSPECIFIED_GB_T = 'UNSPECIFIED_GB_T',
    UNSPECIFIED_WALL_OUTLET = 'UNSPECIFIED_WALL_OUTLET'
  }

  export interface EVSearchOptions {
    connectorTypes?: google.maps.places.EVConnectorType[];
    minimumChargingRateKw?: number;
  }

  export interface FetchFieldsRequest {
    fields: string[];
  }

  export class FormattableText {
    matches: google.maps.places.StringRange[];
    text: string;
  }

  export class FuelOptions {
    fuelPrices: google.maps.places.FuelPrice[];
  }

  export class FuelPrice {
    price: google.maps.places.Money | null;
    type: google.maps.places.FuelType | null;
    updateTime: Date | null;
  }

  export enum FuelType {
    BIO_DIESEL = 'BIO_DIESEL',
    DIESEL = 'DIESEL',
    DIESEL_PLUS = 'DIESEL_PLUS',
    E100 = 'E100',
    E80 = 'E80',
    E85 = 'E85',
    LPG = 'LPG',
    METHANE = 'METHANE',
    MIDGRADE = 'MIDGRADE',
    PREMIUM = 'PREMIUM',
    REGULAR_UNLEADED = 'REGULAR_UNLEADED',
    SP100 = 'SP100',
    SP91 = 'SP91',
    SP91_E10 = 'SP91_E10',
    SP92 = 'SP92',
    SP95 = 'SP95',
    SP95_E10 = 'SP95_E10',
    SP98 = 'SP98',
    SP99 = 'SP99',
    TRUCK_DIESEL = 'TRUCK_DIESEL'
  }

  export type LocationBias =
    | google.maps.LatLng
    | google.maps.LatLngLiteral
    | google.maps.LatLngBounds
    | google.maps.LatLngBoundsLiteral
    | google.maps.Circle
    | google.maps.CircleLiteral
    | string;

  export type LocationRestriction =
    | google.maps.LatLngBounds
    | google.maps.LatLngBoundsLiteral;

  export class Money {
    currencyCode: string;
    nanos: number;
    units: number;
    toString(): string;
  }

  export class OpeningHours {
    periods: google.maps.places.OpeningHoursPeriod[];
    weekdayDescriptions: string[];
  }

  export class OpeningHoursPeriod {
    close: google.maps.places.OpeningHoursPoint | null;
    open: google.maps.places.OpeningHoursPoint;
  }

  export class OpeningHoursPoint {
    day: number;
    hour: number;
    minute: number;
  }

  export class ParkingOptions {
    hasFreeGarageParking: boolean | null;
    hasFreeParkingLot: boolean | null;
    hasFreeStreetParking: boolean | null;
    hasPaidGarageParking: boolean | null;
    hasPaidParkingLot: boolean | null;
    hasPaidStreetParking: boolean | null;
    hasValetParking: boolean | null;
  }

  export class PaymentOptions {
    acceptsCashOnly: boolean | null;
    acceptsCreditCards: boolean | null;
    acceptsDebitCards: boolean | null;
    acceptsNFC: boolean | null;
  }

  export class Photo {
    authorAttributions: google.maps.places.AuthorAttribution[];
    heightPx: number;
    widthPx: number;
    getURI(options?: google.maps.places.PhotoOptions): string;
  }

  export interface PhotoOptions {
    maxHeight?: number | null;
    maxWidth?: number | null;
  }

  export class Place implements google.maps.places.PlaceOptions {
    constructor(options: google.maps.places.PlaceOptions);
    accessibilityOptions?: google.maps.places.AccessibilityOptions | null;
    addressComponents?: google.maps.places.AddressComponent[];
    adrFormatAddress?: string | null;
    allowsDogs?: boolean | null;
    attributions?: google.maps.places.Attribution[];
    businessStatus?: google.maps.places.BusinessStatus | null;
    displayName?: string | null;
    displayNameLanguageCode?: string | null;
    editorialSummary?: string | null;
    editorialSummaryLanguageCode?: string | null;
    evChargeOptions?: google.maps.places.EVChargeOptions | null;
    formattedAddress?: string | null;
    fuelOptions?: google.maps.places.FuelOptions | null;
    googleMapsURI?: string | null;
    hasCurbsidePickup?: boolean | null;
    hasDelivery?: boolean | null;
    hasDineIn?: boolean | null;
    hasLiveMusic?: boolean | null;
    hasMenuForChildren?: boolean | null;
    hasOutdoorSeating?: boolean | null;
    hasRestroom?: boolean | null;
    hasTakeout?: boolean | null;
    iconBackgroundColor?: string | null;
    id: string;
    internationalPhoneNumber?: string | null;
    isGoodForChildren?: boolean | null;
    isGoodForGroups?: boolean | null;
    isGoodForWatchingSports?: boolean | null;
    isReservable?: boolean | null;
    location?: google.maps.LatLng | null;
    nationalPhoneNumber?: string | null;
    parkingOptions?: google.maps.places.ParkingOptions | null;
    paymentOptions?: google.maps.places.PaymentOptions | null;
    photos?: google.maps.places.Photo[];
    plusCode?: google.maps.places.PlusCode | null;
    postalAddress?: google.maps.places.PostalAddress | null;
    priceLevel?: google.maps.places.PriceLevel | null;
    priceRange?: google.maps.places.PriceRange | null;
    primaryType?: string | null;
    primaryTypeDisplayName?: string | null;
    primaryTypeDisplayNameLanguageCode?: string | null;
    rating?: number | null;
    regularOpeningHours?: google.maps.places.OpeningHours | null;
    requestedLanguage?: string | null;
    requestedRegion?: string | null;
    reviews?: google.maps.places.Review[];
    servesBeer?: boolean | null;
    servesBreakfast?: boolean | null;
    servesBrunch?: boolean | null;
    servesCocktails?: boolean | null;
    servesCoffee?: boolean | null;
    servesDessert?: boolean | null;
    servesDinner?: boolean | null;
    servesLunch?: boolean | null;
    servesVegetarianFood?: boolean | null;
    servesWine?: boolean | null;
    svgIconMaskURI?: string | null;
    types?: string[];
    userRatingCount?: number | null;
    utcOffsetMinutes?: number | null;
    viewport?: google.maps.LatLngBounds | null;
    websiteURI?: string | null;
    openingHours?: google.maps.places.OpeningHours | null;
    hasWiFi?: boolean | null;
    static searchByText(
      request: google.maps.places.SearchByTextRequest
    ): Promise<{places: google.maps.places.Place[]}>;
    static searchNearby(
      request: google.maps.places.SearchNearbyRequest
    ): Promise<{places: google.maps.places.Place[]}>;
    fetchFields(
      options: google.maps.places.FetchFieldsRequest
    ): Promise<{place: google.maps.places.Place}>;
    getNextOpeningTime(date?: Date): Promise<Date | undefined>;
    isOpen(date?: Date): Promise<boolean | undefined>;
    toJSON(): object;
  }

  export class PlaceAccessibleEntranceIconElement
    extends HTMLElement
    implements google.maps.places.PlaceAccessibleEntranceIconElementOptions
  {
    constructor(
      options?: google.maps.places.PlaceAccessibleEntranceIconElementOptions
    );
  }

  export interface PlaceAccessibleEntranceIconElementOptions {}

  export class PlaceAddressElement
    extends HTMLElement
    implements google.maps.places.PlaceAddressElementOptions
  {
    constructor(options?: google.maps.places.PlaceAddressElementOptions);
  }

  export interface PlaceAddressElementOptions {}

  export class PlaceAllContentElement
    extends HTMLElement
    implements google.maps.places.PlaceAllContentElementOptions
  {
    constructor(options?: google.maps.places.PlaceAllContentElementOptions);
  }

  export interface PlaceAllContentElementOptions {}

  export interface PlaceAspectRating {
    rating: number;
    type: string;
  }

  export class PlaceAttributionElement
    extends HTMLElement
    implements google.maps.places.PlaceAttributionElementOptions
  {
    constructor(options?: google.maps.places.PlaceAttributionElementOptions);
    darkSchemeColor?: google.maps.places.AttributionColor | null;
    lightSchemeColor?: google.maps.places.AttributionColor | null;
  }

  export interface PlaceAttributionElementOptions {
    darkSchemeColor?: google.maps.places.AttributionColor | null;
    lightSchemeColor?: google.maps.places.AttributionColor | null;
  }

  export class PlaceAutocompleteElement
    extends HTMLElement
    implements google.maps.places.PlaceAutocompleteElementOptions
  {
    constructor(options: google.maps.places.PlaceAutocompleteElementOptions);
    includedPrimaryTypes: string[] | null;
    includedRegionCodes: string[] | null;
    locationBias: google.maps.places.LocationBias | null;
    locationRestriction: google.maps.places.LocationRestriction | null;
    name: string | null;
    origin?:
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
    requestedLanguage: string | null;
    requestedRegion: string | null;
    unitSystem?: google.maps.UnitSystem | null;
  }

  export interface PlaceAutocompleteElementOptions {
    locationBias?: google.maps.places.LocationBias | null;
    locationRestriction?: google.maps.places.LocationRestriction | null;
    name?: string | null;
    requestedLanguage?: string | null;
  }

  export class PlaceContentConfigElement
    extends HTMLElement
    implements google.maps.places.PlaceContentConfigElementOptions
  {
    constructor(options?: google.maps.places.PlaceContentConfigElementOptions);
  }

  export interface PlaceContentConfigElementOptions {}

  export class PlaceContextualElement
    extends HTMLElement
    implements google.maps.places.PlaceContextualElementOptions
  {
    contextToken?: string | null;
  }

  export interface PlaceContextualElementOptions {
    contextToken?: string | null;
  }

  export class PlaceContextualListConfigElement
    extends HTMLElement
    implements google.maps.places.PlaceContextualListConfigElementOptions
  {
    layout?: google.maps.places.PlaceContextualListLayout | null;
    mapHidden?: boolean | null;
  }

  export interface PlaceContextualListConfigElementOptions {
    layout?: google.maps.places.PlaceContextualListLayout | null;
    mapHidden?: boolean | null;
  }

  export enum PlaceContextualListLayout {
    COMPACT = 'COMPACT',
    VERTICAL = 'VERTICAL'
  }

  export class PlaceDetailsCompactElement
    extends HTMLElement
    implements google.maps.places.PlaceDetailsCompactElementOptions
  {
    constructor(options?: google.maps.places.PlaceDetailsCompactElementOptions);
    orientation?: google.maps.places.PlaceDetailsOrientation | null;
    place?: google.maps.places.Place;
    truncationPreferred: boolean;
  }

  export interface PlaceDetailsCompactElementOptions {
    orientation?: google.maps.places.PlaceDetailsOrientation | null;
    truncationPreferred?: boolean | null;
  }

  export class PlaceDetailsElement
    extends HTMLElement
    implements google.maps.places.PlaceDetailsElementOptions
  {
    place?: google.maps.places.Place;
  }

  export interface PlaceDetailsElementOptions {}

  export class PlaceDetailsLocationRequestElement
    extends HTMLElement
    implements google.maps.places.PlaceDetailsLocationRequestElementOptions
  {
    constructor(
      options?: google.maps.places.PlaceDetailsLocationRequestElementOptions
    );
    location?:
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
  }

  export interface PlaceDetailsLocationRequestElementOptions {
    location?:
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | google.maps.LatLngAltitude
      | google.maps.LatLngAltitudeLiteral
      | null;
  }

  export enum PlaceDetailsOrientation {
    HORIZONTAL = 'HORIZONTAL',
    VERTICAL = 'VERTICAL'
  }

  export class PlaceDetailsPlaceRequestElement
    extends HTMLElement
    implements google.maps.places.PlaceDetailsPlaceRequestElementOptions
  {
    constructor(
      options?: google.maps.places.PlaceDetailsPlaceRequestElementOptions
    );
    place: google.maps.places.Place | null;
  }

  export interface PlaceDetailsPlaceRequestElementOptions {
    place?: google.maps.places.Place | string | null;
  }

  export interface PlaceDetailsRequest {
    fields?: string[];
    language?: string | null;
    placeId: string;
    region?: string | null;
    sessionToken?: google.maps.places.AutocompleteSessionToken;
  }

  export class PlaceFeatureListElement
    extends HTMLElement
    implements google.maps.places.PlaceFeatureListElementOptions {}

  export interface PlaceFeatureListElementOptions {}

  export interface PlaceGeometry {
    location?: google.maps.LatLng;
    viewport?: google.maps.LatLngBounds;
  }

  export class PlaceListElement
    extends HTMLElement
    implements google.maps.places.PlaceListElementOptions
  {
    constructor(options?: google.maps.places.PlaceListElementOptions);
    places: google.maps.places.Place[];
    selectable: boolean;
    configureFromSearchByTextRequest(
      request: google.maps.places.SearchByTextRequest
    ): Promise<void>;
    configureFromSearchNearbyRequest(
      request: google.maps.places.SearchNearbyRequest
    ): Promise<void>;
  }

  export interface PlaceListElementOptions {
    selectable?: boolean | null;
  }

  export class PlaceMediaElement
    extends HTMLElement
    implements google.maps.places.PlaceMediaElementOptions
  {
    constructor(options?: google.maps.places.PlaceMediaElementOptions);
    lightboxPreferred?: boolean | null;
  }

  export interface PlaceMediaElementOptions {
    lightboxPreferred?: boolean | null;
  }

  export class PlaceOpenNowStatusElement
    extends HTMLElement
    implements google.maps.places.PlaceOpenNowStatusElementOptions
  {
    constructor(options?: google.maps.places.PlaceOpenNowStatusElementOptions);
  }

  export interface PlaceOpenNowStatusElementOptions {}

  export interface PlaceOpeningHours {
    periods?: google.maps.places.PlaceOpeningHoursPeriod[];
    weekday_text?: string[];
    open_now?: boolean;
    isOpen(date?: Date): boolean | undefined;
  }

  export class PlaceOpeningHoursElement
    extends HTMLElement
    implements google.maps.places.PlaceOpeningHoursElementOptions {}

  export interface PlaceOpeningHoursElementOptions {}

  export interface PlaceOpeningHoursPeriod {
    close?: google.maps.places.PlaceOpeningHoursTime;
    open: google.maps.places.PlaceOpeningHoursTime;
  }

  export interface PlaceOpeningHoursTime {
    day: number;
    hours: number;
    minutes: number;
    nextDate?: number;
    time: string;
  }

  export interface PlaceOptions {
    id: string;
    requestedLanguage?: string | null;
    requestedRegion?: string | null;
  }

  export class PlacePhoneNumberElement
    extends HTMLElement
    implements google.maps.places.PlacePhoneNumberElementOptions {}

  export interface PlacePhoneNumberElementOptions {}

  export interface PlacePhoto {
    height: number;
    html_attributions: string[];
    width: number;
    getUrl(opts?: google.maps.places.PhotoOptions): string;
  }

  export interface PlacePlusCode {
    compound_code?: string;
    global_code: string;
  }

  export class PlacePlusCodeElement
    extends HTMLElement
    implements google.maps.places.PlacePlusCodeElementOptions {}

  export interface PlacePlusCodeElementOptions {}

  export class PlacePrediction {
    distanceMeters: number | null;
    mainText: google.maps.places.FormattableText | null;
    placeId: string;
    secondaryText: google.maps.places.FormattableText | null;
    text: google.maps.places.FormattableText;
    types: string[];
    fetchAddressValidation(
      request: google.maps.addressValidation.AddressValidationRequest
    ): Promise<google.maps.addressValidation.AddressValidation>;
    toPlace(): google.maps.places.Place;
  }

  export class PlacePriceElement
    extends HTMLElement
    implements google.maps.places.PlacePriceElementOptions
  {
    constructor(options?: google.maps.places.PlacePriceElementOptions);
  }

  export interface PlacePriceElementOptions {}

  export class PlaceRatingElement
    extends HTMLElement
    implements google.maps.places.PlaceRatingElementOptions
  {
    constructor(options?: google.maps.places.PlaceRatingElementOptions);
  }

  export interface PlaceRatingElementOptions {}

  export interface PlaceResult {
    address_components?: google.maps.GeocoderAddressComponent[];
    adr_address?: string;
    aspects?: google.maps.places.PlaceAspectRating[];
    business_status?: google.maps.places.BusinessStatus;
    formatted_address?: string;
    formatted_phone_number?: string;
    geometry?: google.maps.places.PlaceGeometry;
    html_attributions?: string[];
    icon?: string;
    icon_background_color?: string;
    icon_mask_base_uri?: string;
    international_phone_number?: string;
    name?: string;
    opening_hours?: google.maps.places.PlaceOpeningHours;
    photos?: google.maps.places.PlacePhoto[];
    place_id?: string;
    plus_code?: google.maps.places.PlacePlusCode;
    price_level?: number;
    rating?: number;
    reviews?: google.maps.places.PlaceReview[];
    types?: string[];
    url?: string;
    user_ratings_total?: number;
    utc_offset_minutes?: number;
    vicinity?: string;
    website?: string;
    utc_offset?: number;
    permanently_closed?: boolean;
  }

  export interface PlaceReview {
    author_name: string;
    author_url?: string;
    language: string;
    profile_photo_url: string;
    rating?: number;
    relative_time_description: string;
    text: string;
    time: number;
    aspects?: google.maps.places.PlaceAspectRating[];
  }

  export class PlaceReviewsElement
    extends HTMLElement
    implements google.maps.places.PlaceReviewsElementOptions {}

  export interface PlaceReviewsElementOptions {}

  export interface PlaceSearchPagination {
    hasNextPage: boolean;
    nextPage(): void;
  }

  export interface PlaceSearchRequest {
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    keyword?: string;
    language?: string | null;
    location?: google.maps.LatLng | google.maps.LatLngLiteral;
    maxPriceLevel?: number;
    minPriceLevel?: number;
    openNow?: boolean;
    radius?: number;
    rankBy?: google.maps.places.RankBy;
    type?: string;
    name?: string;
  }

  export class PlaceStandardContentElement
    extends HTMLElement
    implements google.maps.places.PlaceStandardContentElementOptions
  {
    constructor(
      options?: google.maps.places.PlaceStandardContentElementOptions
    );
  }

  export interface PlaceStandardContentElementOptions {}

  export class PlaceSummaryElement
    extends HTMLElement
    implements google.maps.places.PlaceSummaryElementOptions {}

  export interface PlaceSummaryElementOptions {}

  export class PlaceTypeElement
    extends HTMLElement
    implements google.maps.places.PlaceTypeElementOptions
  {
    constructor(options?: google.maps.places.PlaceTypeElementOptions);
  }

  export interface PlaceTypeElementOptions {}

  export class PlaceTypeSpecificHighlightsElement
    extends HTMLElement
    implements google.maps.places.PlaceTypeSpecificHighlightsElementOptions {}

  export interface PlaceTypeSpecificHighlightsElementOptions {}

  export class PlaceWebsiteElement
    extends HTMLElement
    implements google.maps.places.PlaceWebsiteElementOptions {}

  export interface PlaceWebsiteElementOptions {}

  export class PlusCode {
    compoundCode: string | null;
    globalCode: string | null;
  }

  export class PostalAddress
    implements google.maps.places.PostalAddressLiteral
  {
    addressLines: string[];
    administrativeArea: string | null;
    languageCode: string | null;
    locality: string | null;
    organization: string | null;
    postalCode: string | null;
    recipients: string[];
    regionCode: string;
    sortingCode: string | null;
    sublocality: string | null;
  }

  export interface PostalAddressLiteral {
    addressLines?: Iterable<string>;
    administrativeArea?: string | null;
    languageCode?: string | null;
    locality?: string | null;
    organization?: string | null;
    postalCode?: string | null;
    recipients?: Iterable<string>;
    regionCode: string;
    sortingCode?: string | null;
    sublocality?: string | null;
  }

  export interface PredictionSubstring {
    length: number;
    offset: number;
  }

  export interface PredictionTerm {
    offset: number;
    value: string;
  }

  export enum PriceLevel {
    EXPENSIVE = 'EXPENSIVE',
    FREE = 'FREE',
    INEXPENSIVE = 'INEXPENSIVE',
    MODERATE = 'MODERATE',
    VERY_EXPENSIVE = 'VERY_EXPENSIVE'
  }

  export class PriceRange {
    endPrice: google.maps.places.Money | null;
    startPrice: google.maps.places.Money;
  }

  export enum RankBy {
    DISTANCE = 0.0,
    PROMINENCE = 1.0
  }

  export class Review {
    authorAttribution: google.maps.places.AuthorAttribution | null;
    publishTime: Date | null;
    rating: number | null;
    relativePublishTimeDescription: string | null;
    text: string | null;
    textLanguageCode: string | null;
  }

  export enum SearchByTextRankPreference {
    DISTANCE = 'DISTANCE',
    RELEVANCE = 'RELEVANCE'
  }

  export interface SearchByTextRequest {
    evSearchOptions?: google.maps.places.EVSearchOptions;
    fields?: string[];
    includedType?: string;
    isOpenNow?: boolean;
    language?: string;
    locationBias?:
      | google.maps.LatLng
      | google.maps.LatLngLiteral
      | google.maps.LatLngBounds
      | google.maps.LatLngBoundsLiteral
      | google.maps.CircleLiteral
      | google.maps.Circle;
    locationRestriction?:
      | google.maps.LatLngBounds
      | google.maps.LatLngBoundsLiteral;
    maxResultCount?: number;
    minRating?: number;
    priceLevels?: google.maps.places.PriceLevel[];
    rankPreference?: google.maps.places.SearchByTextRankPreference;
    region?: string;
    textQuery?: string;
    useStrictTypeFiltering?: boolean;
    query?: string;
    rankBy?: google.maps.places.SearchByTextRankPreference;
  }

  export enum SearchNearbyRankPreference {
    DISTANCE = 'DISTANCE',
    POPULARITY = 'POPULARITY'
  }

  export interface SearchNearbyRequest {
    excludedPrimaryTypes?: string[];
    excludedTypes?: string[];
    fields?: string[];
    includedPrimaryTypes?: string[];
    includedTypes?: string[];
    language?: string;
    locationRestriction: google.maps.Circle | google.maps.CircleLiteral;
    maxResultCount?: number;
    rankPreference?: google.maps.places.SearchNearbyRankPreference;
    region?: string;
  }

  export class StringRange {
    endOffset: number;
    startOffset: number;
  }

  export interface StructuredFormatting {
    main_text: string;
    main_text_matched_substrings: google.maps.places.PredictionSubstring[];
    secondary_text: string;
  }

  export interface TextSearchRequest {
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    language?: string | null;
    location?: google.maps.LatLng | google.maps.LatLngLiteral;
    query?: string;
    radius?: number;
    region?: string | null;
    type?: string;
  }
}

declare namespace google.maps.elevation {
  export class ElevationElement
    extends HTMLElement
    implements google.maps.elevation.ElevationElementOptions
  {
    constructor(options?: google.maps.elevation.ElevationElementOptions);
    path?:
      | (
          | google.maps.LatLng
          | google.maps.LatLngLiteral
          | google.maps.LatLngAltitude
        )[]
      | null;
    unitSystem?: google.maps.UnitSystem | null;
  }

  export interface ElevationElementOptions {
    path?: (google.maps.LatLng | google.maps.LatLngLiteral)[] | null;
    unitSystem?: google.maps.UnitSystem | null;
  }
}
