import React, {
  CSSProperties,
  forwardRef,
  PropsWithChildren,
  useContext,
  useImperativeHandle,
  useMemo
} from 'react';

import {APIProviderContext} from '../api-provider';
import {useMap3DInstance} from './use-map-3d-instance';
import {useMap3DCameraParams} from './use-map-3d-camera-params';
import {Map3DEventProps, useMap3DEvents} from './use-map-3d-events';
import {useMap3DOptions} from './use-map-3d-options';

/**
 * Augment React's JSX namespace to include the gmp-map-3d custom element.
 */
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map-3d': React.DetailedHTMLProps<
        React.HTMLAttributes<google.maps.maps3d.Map3DElement>,
        google.maps.maps3d.Map3DElement
      >;
    }
  }
}

// Re-export event types for consumers
export type {
  Map3DEvent,
  Map3DCameraChangedEvent,
  Map3DClickEvent,
  Map3DSteadyChangeEvent,
  Map3DEventProps
} from './use-map-3d-events';

/**
 * Extended Map3DElement type with animation methods that may not be in @types/google.maps yet.
 * These methods are part of the Maps JavaScript API but type definitions may lag behind.
 */
interface Map3DElementWithAnimations extends google.maps.maps3d.Map3DElement {
  flyCameraAround(options: google.maps.maps3d.FlyAroundAnimationOptions): void;
  flyCameraTo(options: google.maps.maps3d.FlyToAnimationOptions): void;
  stopCameraAnimation(): void;
}

/**
 * Context value for Map3D, providing access to the Map3DElement instance.
 */
export interface GoogleMaps3DContextValue {
  map3d: google.maps.maps3d.Map3DElement | null;
}

/**
 * React context for accessing the Map3D instance from child components.
 */
export const GoogleMaps3DContext =
  React.createContext<GoogleMaps3DContextValue | null>(null);

/**
 * Ref handle exposed by Map3D for imperative actions.
 */
export interface Map3DRef {
  /** The underlying Map3DElement instance. */
  map3d: google.maps.maps3d.Map3DElement | null;
  /** Fly the camera around a center point. */
  flyCameraAround: (
    options: google.maps.maps3d.FlyAroundAnimationOptions
  ) => void;
  /** Fly the camera to a destination. */
  flyCameraTo: (options: google.maps.maps3d.FlyToAnimationOptions) => void;
  /** Stop any ongoing camera animation. */
  stopCameraAnimation: () => void;
}

/**
 * Props for the Map3D component.
 */
export type Map3DProps = PropsWithChildren<
  Omit<google.maps.maps3d.Map3DElementOptions, 'center'> &
    Map3DEventProps & {
      /**
       * An id for the map, this is required when multiple maps are present
       * in the same APIProvider context.
       */
      id?: string;

      /**
       * Additional style rules to apply to the map container element.
       */
      style?: CSSProperties;

      /**
       * Additional CSS class name to apply to the map container element.
       */
      className?: string;

      /**
       * The center of the map. Can be a LatLngAltitude or LatLngAltitudeLiteral.
       */
      center?: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;

      // Default values for uncontrolled usage
      defaultCenter?: google.maps.LatLngAltitudeLiteral;
      defaultHeading?: number;
      defaultTilt?: number;
      defaultRange?: number;
      defaultRoll?: number;
    }
>;

/**
 * Default styles for the map container.
 */
const DEFAULT_CONTAINER_STYLE: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative'
};

/**
 * A React component that renders a 3D map using the Google Maps JavaScript API.
 *
 * @example
 * ```tsx
 * <APIProvider apiKey={API_KEY}>
 *   <Map3D
 *     defaultCenter={{ lat: 37.7749, lng: -122.4194, altitude: 1000 }}
 *     defaultRange={5000}
 *     defaultHeading={0}
 *     defaultTilt={45}
 *   />
 * </APIProvider>
 * ```
 */
export const Map3D = forwardRef<Map3DRef, Map3DProps>((props, ref) => {
  const {children, id, className, style} = props;

  // Verify we're inside an APIProvider
  const context = useContext(APIProviderContext);
  if (!context) {
    throw new Error(
      '<Map3D> can only be used inside an <APIProvider> component.'
    );
  }

  // Set up the map instance
  const [map3d, containerRef, map3dRef, cameraStateRef, isReady] =
    useMap3DInstance(props);

  // Set up camera params tracking and updates
  useMap3DCameraParams(map3d, cameraStateRef, props);

  // Set up event handlers
  useMap3DEvents(map3d, props);

  // Set up options updates
  useMap3DOptions(map3d, props);

  // Expose imperative handle for animations
  // Cast to extended type since @types/google.maps may not have animation methods yet
  const map3dWithAnimations = map3d as Map3DElementWithAnimations | null;
  useImperativeHandle(
    ref,
    () => ({
      map3d,
      flyCameraAround: (
        options: google.maps.maps3d.FlyAroundAnimationOptions
      ) => {
        map3dWithAnimations?.flyCameraAround(options);
      },
      flyCameraTo: (options: google.maps.maps3d.FlyToAnimationOptions) => {
        map3dWithAnimations?.flyCameraTo(options);
      },
      stopCameraAnimation: () => {
        map3dWithAnimations?.stopCameraAnimation();
      }
    }),
    [map3d, map3dWithAnimations]
  );

  // Combine styles
  const combinedStyle = useMemo(
    () => ({
      ...DEFAULT_CONTAINER_STYLE,
      ...style
    }),
    [style]
  );

  // Context value for child components
  const contextValue = useMemo<GoogleMaps3DContextValue>(
    () => ({map3d}),
    [map3d]
  );

  // Apply default mode if not specified
  const mode = props.mode ?? google.maps?.maps3d?.MapMode?.HYBRID ?? 'HYBRID';

  // Don't render the custom element until everything is ready
  if (!isReady) {
    return (
      <div
        ref={containerRef}
        data-testid="map-3d"
        style={className ? undefined : combinedStyle}
        className={className}
        {...(id ? {id} : {})}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      data-testid="map-3d"
      style={className ? undefined : combinedStyle}
      className={className}
      {...(id ? {id} : {})}>
      <gmp-map-3d ref={map3dRef} style={{width: '100%', height: '100%'}} />

      {map3d && (
        <GoogleMaps3DContext.Provider value={contextValue}>
          {children}
        </GoogleMaps3DContext.Provider>
      )}
    </div>
  );
});

Map3D.displayName = 'Map3D';
