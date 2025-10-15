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
}
