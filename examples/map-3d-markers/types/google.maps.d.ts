/* eslint-disable @typescript-eslint/no-empty-object-type */
declare namespace google.maps {
  /**
   * Namespace for 3D Maps functionality.
   * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map
   */
  namespace maps3d {
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
    interface Polyline3DInteractiveElementOptions extends Polyline3DElementOptions {}

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
    interface Polygon3DInteractiveElementOptions extends Polygon3DElementOptions {}

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

    /**
     * Map3DElementOptions object used to define the properties that can be set on a Map3DElement.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Map3DElementOptions
     */
    interface Map3DElementOptions {
      bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
      center?: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;
      defaultLabelsDisabled?: boolean;
      defaultUIDisabled?: boolean;
      gestureHandling?: GestureHandling;
      heading?: number;
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
     * Augmentation for Map3DElement to add animation methods.
     * The base Map3DElement class is defined in @types/google.maps.
     * @see https://developers.google.com/maps/documentation/javascript/reference/3d-map#Map3DElement
     */
    interface Map3DElement {
      /**
       * Starts an animation that makes the camera orbit around a point.
       * @param options Configuration options for the animation
       */
      flyCameraAround(options: FlyAroundAnimationOptions): void;

      /**
       * Starts an animation that moves the camera to a new position.
       * @param options Configuration options for the animation
       */
      flyCameraTo(options: FlyToAnimationOptions): void;

      /**
       * Stops any currently running camera animation.
       */
      stopCameraAnimation(): void;
    }
  }
}
