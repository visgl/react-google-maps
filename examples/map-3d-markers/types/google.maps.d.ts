declare namespace google.maps.maps3d {
  //
  // --- <gmp-model-3d>
  //

  export class Model3DElement
    extends HTMLElement
    implements Model3DElementOptions
  {
    constructor(options?: Model3DElementOptions);

    position: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;
    src: string | URL;

    altitudeMode?: google.maps.maps3d.AltitudeMode;
    orientation?: google.maps.Orientation3D | google.maps.Orientation3DLiteral;
    scale?: number | google.maps.Vector3D | google.maps.Vector3DLiteral;
  }

  export interface Model3DElementOptions {
    position: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;
    src: string | URL;

    altitudeMode?: google.maps.maps3d.AltitudeMode;
    orientation?: google.maps.Orientation3D | google.maps.Orientation3DLiteral;
    scale?: number | google.maps.Vector3D | google.maps.Vector3DLiteral;
  }

  //
  // --- <gmp-marker-3d>
  //

  export class Marker3DElement
    extends HTMLElement
    implements Marker3DElementOptions
  {
    constructor(options?: Marker3DElementOptions);

    position: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;
    altitudeMode?: google.maps.maps3d.AltitudeMode;
    collisionBehavior?: google.maps.CollisionBehavior;
    extruded?: boolean;
    drawsWhenOccluded?: boolean;
    label?: string;
    sizePreserved?: boolean;
    zIndex?: number;
  }

  export interface Marker3DElementOptions {
    position: google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral;
    altitudeMode?: google.maps.maps3d.AltitudeMode;
    collisionBehavior?: google.maps.CollisionBehavior;
    extruded?: boolean;
    drawsWhenOccluded?: boolean;
    label?: string;
    sizePreserved?: boolean;
    zIndex?: number;
  }
}
