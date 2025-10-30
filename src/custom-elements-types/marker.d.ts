import 'google.maps';
import type {CustomElement} from './utils';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-advanced-marker': CustomElement<
        {
          position?: google.maps.LatLngLiteral | string | null;
          title?: string | null;
          anchorLeft?: string | null;
          anchorTop?: string | null;
          collisionBehavior?: google.maps.CollisionBehavior | null;
          gmpClickable?: boolean | null;
          gmpDraggable?: boolean | null;
          map?: google.maps.Map | null;
          zIndex?: number | null;

          /** @deprecated */
          readonly element?: HTMLElement;

          /** @deprecated */
          content?: string;

          'gmp-clickable'?: boolean;
          'anchor-left'?: string;
          'anchor-top'?: string;
        },
        google.maps.marker.AdvancedMarkerElement
      >;

      'gmp-pin': CustomElement<
        {
          background?: string | null;
          borderColor?: string | null;
          glyphColor?: string | null;
          glyphSrc?: URL | string | null;
          glyphText?: string | null;

          scale?: number | string;
          readonly element?: HTMLElement;

          /** @deprecated */
          glyph?: string | Element | URL | null;

          'border-color'?: string;
          'glyph-color'?: string;
          'glyph-src'?: string;
          'glyph-text'?: string;
        },
        google.maps.marker.PinElement
      >;
    }
  }
}
