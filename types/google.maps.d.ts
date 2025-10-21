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
}