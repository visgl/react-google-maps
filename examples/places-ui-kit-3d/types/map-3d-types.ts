/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-explicit-any */

import React, {DOMAttributes, RefAttributes} from 'react';

interface GmpPopoverAttributes
  // @ts-expect-error not in official types yet
  extends React.HTMLAttributes<google.maps.maps3d.PopoverElement> {
  open: boolean;
  'position-anchor': string;
  'altitude-mode'?: google.maps.maps3d.AltitudeMode;
  'light-dismiss-disabled'?: boolean;
}

// add an overload signature for the useMapsLibrary hook, so typescript
// knows what the 'maps3d' library is.
declare module '@vis.gl/react-google-maps' {
  export function useMapsLibrary(
    name: 'maps3d'
  ): typeof google.maps.maps3d | null;
}

// temporary fix until @types/google.maps is updated with the latest changes
declare global {
  namespace google.maps.maps3d {
    interface Map3DElement extends HTMLElement {
      mode?: 'HYBRID' | 'SATELLITE';
    }

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

    export interface Marker3DInteractiveElementOptions
      extends Marker3DElementOptions {}

    export class Marker3DInteractiveElement
      extends Marker3DElement
      implements Marker3DInteractiveElementOptions
    {
      constructor(options?: Marker3DInteractiveElementOptions);
    }
  }
}

// add the <gmp-map-3d> custom-element to the JSX.IntrinsicElements
// interface, so it can be used in jsx
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ['gmp-map-3d']: CustomElement<
        google.maps.maps3d.Map3DElement,
        google.maps.maps3d.Map3DElement
      >;
      ['gmp-popover']: React.DetailedHTMLProps<
        GmpPopoverAttributes,
        // @ts-expect-error not in official types yet
        google.maps.maps3d.PopoverElement
      >;
    }
  }
}

// a helper type for CustomElement definitions
type CustomElement<TElem, TAttr> = Partial<
  TAttr &
    DOMAttributes<TElem> &
    RefAttributes<TElem> & {
      // for whatever reason, anything else doesn't work as children
      // of a custom element, so we allow `any` here
      children: any;
    }
>;
