import 'google.maps';
import type {CustomElement} from './utils';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-elevation': CustomElement<
        {
          path?: Array<
            | google.maps.LatLng
            | google.maps.LatLngLiteral
            | google.maps.LatLngAltitude
            | google.maps.LatLngAltitudeLiteral
          > | null;
          unitSystem?: google.maps.UnitSystem | null;

          // html-attribute versions
          'unit-system'?: string;

          // emits 'gmp-requesterror' and 'gmp-load' events
        },
        google.maps.elevation.ElevationElement
      >;
    }
  }
}
