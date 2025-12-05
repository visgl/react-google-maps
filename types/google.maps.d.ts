// eslint-disable-next-line @typescript-eslint/triple-slash-reference
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
    Polyline3DElement: typeof maps3d.Polyline3DElement;
    Polygon3DElement: typeof maps3d.Polygon3DElement;
    AltitudeMode: typeof maps3d.AltitudeMode;
    GestureHandling: typeof maps3d.GestureHandling;
    MapMode: typeof maps3d.MapMode;
  }
}
