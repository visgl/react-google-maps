import 'google.maps';
import type {CustomElement} from './utils';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-air-quality': CustomElement<
        {
          location?:
            | google.maps.LatLng
            | google.maps.LatLngLiteral
            | google.maps.LatLngAltitude
            | google.maps.LatLngAltitudeLiteral
            | string
            | null;

          requestedLanguage?: string | null;

          // html-attribute versions
          'requested-language'?: string;
        },
        google.maps.airQuality.AirQualityElement
      >;
    }
  }
}
