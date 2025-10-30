import 'google.maps';
import type {CustomElement} from './utils';

type Map3DProps = {
  bounds?:
    | google.maps.LatLngBounds
    | google.maps.LatLngBoundsLiteral
    | string
    | null;
  center?:
    | google.maps.LatLngAltitude
    | google.maps.LatLngAltitudeLiteral
    | string
    | null;
  heading?: number | string | null;
  mode?: google.maps.maps3d.MapMode | string | null;
  range?: number | string | null;
  roll?: number | string | null;
  tilt?: number | string | null;

  /** @deprecated */
  defaultUIDisabled?: boolean | null;
  defaultUIHidden?: boolean | null;
  maxAltitude?: number | null;
  maxHeading?: number | null;
  maxTilt?: number | null;
  minAltitude?: number | null;
  minHeading?: number | null;
  minTilt?: number | null;

  /** @deprecated */
  'default-ui-disabled'?: boolean | string;
  'default-ui-hidden'?: boolean | string;
  'max-altitude'?: string;
  'max-heading'?: string;
  'max-tilt'?: string;
  'min-altitude'?: string;
  'min-heading'?: string;
  'min-tilt'?: string;
};

type Marker3DProps = {
  extruded?: boolean | string | null;
  label?: string | null;
  position?:
    | google.maps.LatLngLiteral
    | google.maps.LatLngAltitudeLiteral
    | string
    | null;

  altitudeMode?: google.maps.maps3d.AltitudeMode | null;
  collisionBehavior?: google.maps.CollisionBehavior | null;
  drawsWhenOccluded?: boolean | null;
  sizePreserved?: boolean | null;
  zIndex?: number | null;

  'altitude-mode'?: string;
  'collision-behavior'?: string;
  'draws-when-occluded'?: boolean | string;
  'size-preserved'?: boolean | string;
  'z-index'?: string;
};

type Model3DProps = {
  orientation?:
    | google.maps.Orientation3D
    | google.maps.Orientation3DLiteral
    | string
    | null;
  position?:
    | google.maps.LatLngLiteral
    | google.maps.LatLngAltitude
    | google.maps.LatLngAltitudeLiteral
    | string
    | null;
  scale?:
    | number
    | google.maps.Vector3D
    | google.maps.Vector3DLiteral
    | string
    | null;
  src?: string | URL | null;

  altitudeMode?: google.maps.maps3d.AltitudeMode | null;

  'altitude-mode'?: string;
};

type Polyline3DProps = {
  extruded?: boolean | string | null;
  geodesic?: boolean | string | null;
  path?: string | null;

  altitudeMode?: google.maps.maps3d.AltitudeMode | null;
  coordinates?: Iterable<
    | google.maps.LatLngAltitude
    | google.maps.LatLngAltitudeLiteral
    | google.maps.LatLngLiteral
  > | null;
  drawsOccludedSegments?: boolean | null;
  outerColor?: string | null;
  outerWidth?: number | null;
  strokeColor?: string | null;
  strokeWidth?: number | null;
  zIndex?: number | null;

  'altitude-mode'?: string;
  'draws-occluded-segments'?: boolean | string;
  'outer-color'?: string;
  'outer-width'?: string;
  'stroke-color'?: string;
  'stroke-width'?: string;
  'z-index'?: string;
};

type Polygon3DProps = {
  extruded?: boolean | string | null;
  geodesic?: boolean | string | null;
  path?: string | null;

  altitudeMode?: google.maps.maps3d.AltitudeMode | null;
  drawsOccludedSegments?: boolean | null;
  fillColor?: string | null;
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

  'altitude-mode'?: string;
  'draws-occluded-segments'?: boolean | string;
  'fill-color'?: string;
  'inner-paths'?: string;
  'stroke-color'?: string;
  'stroke-width'?: string;
  'z-index'?: string;
};

type PopoverProps = {
  open?: boolean | string | null;

  altitudeMode?: google.maps.maps3d.AltitudeMode | null;
  lightDismissDisabled?: boolean | null;
  positionAnchor?:
    | google.maps.LatLngLiteral
    | google.maps.LatLngAltitudeLiteral
    | google.maps.maps3d.Marker3DInteractiveElement
    | string
    | null;

  'altitude-mode'?: string;
  'light-dismiss-disabled'?: boolean | string;
  'position-anchor'?: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map-3d': CustomElement<Map3DProps, google.maps.Map3DElement>;

      'gmp-marker-3d': CustomElement<
        Marker3DProps,
        google.maps.Marker3DElement
      >;

      'gmp-marker-3d-interactive': CustomElement<
        Marker3DProps & {
          title?: string;
          gmpPopoverTargetElement?: google.maps.maps3d.PopoverElement | null;
          'gmp-popover-target-element'?: string;
        },
        google.maps.Marker3DInteractiveElement
      >;

      'gmp-model-3d': CustomElement<Model3DProps, google.maps.Model3DElement>;

      'gmp-model-3d-interactive': CustomElement<
        Model3DProps,
        google.maps.Model3DInteractiveElement
      >;

      'gmp-polyline-3d': CustomElement<
        Polyline3DProps,
        google.maps.Polyline3DElement
      >;

      'gmp-polyline-3d-interactive': CustomElement<
        Polyline3DProps,
        google.maps.Polyline3DInteractiveElement
      >;

      'gmp-polygon-3d': CustomElement<
        Polygon3DProps,
        google.maps.Polygon3DElement
      >;

      'gmp-polygon-3d-interactive': CustomElement<
        Polygon3DProps,
        google.maps.Polygon3DInteractiveElement
      >;

      'gmp-popover': CustomElement<PopoverProps, google.maps.PopoverElement>;
    }
  }
}
