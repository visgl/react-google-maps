import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {FunctionComponent} from 'react';
import {
  ContentConfig,
  ContentItem,
  PlaceContentConfig
} from './place-content-config';

export const Orientation = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL'
} as const;

export type Orientation = (typeof Orientation)[keyof typeof Orientation];

export type PlaceDetailsProps = {
  /**
   * Classname to pass on to gmp-place-details (compact and non-compact)
   */
  className?: string;
  /**
   * CSS properties to pass on to gmp-place-details (compact and non-compact)
   */
  style?: React.CSSProperties;

  /**
   * If true, shows the compact version of place-details
   */
  compact?: boolean;

  /**
   * Show details for a place via its place id or via its location.
   * the place id takes priority if both are provided
   */
  placeId?: string;
  /**
   * Location of the place.
   */
  location?:
    | google.maps.LatLng
    | google.maps.LatLngLiteral
    | google.maps.LatLngAltitude
    | google.maps.LatLngAltitudeLiteral
    | null;

  /**
   * Content config. Defaults to 'standard'
   */
  contentConfig: ContentConfig;
  /**
   * Required only if type is 'custom'.
   * The array lists the content elements to display.
   */
  customContent?: Array<ContentItem>;

  // compact only
  /**
   * Orientation of the displayed information. Defaults to vertical.
   */
  orientation?: Orientation;
  /**
   * Whether or not text should be truncated.
   */
  truncationPreferred?: boolean;

  /**
   * Fired when the place details are loaded.
   */
  onLoad?: ({
    target: {place}
  }: {
    target: {place: google.maps.places.Place};
  }) => void;
  /**
   * Fired on error.
   */
  onError?: (e: Event) => void;
};

/**
 * Wrapper component for gmp-place-details / gmp-place-details-compact
 * Properties and styling options according to https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsElement
 * and https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement
 */
export const PlaceDetails: FunctionComponent<PlaceDetailsProps> = props => {
  const {
    className,
    style,
    compact = false,
    placeId,
    location,
    contentConfig = ContentConfig.STANDARD,
    customContent,
    orientation = Orientation.VERTICAL,
    truncationPreferred,
    onLoad,
    onError
  } = props;

  // Load required Google Maps library for places
  const placesLibrary = useMapsLibrary('places');

  if (!placesLibrary || !(placeId || location)) return null;

  return compact ? (
    <gmp-place-details-compact
      className={className}
      style={style}
      ongmp-load={onLoad}
      ongmp-error={onError}
      orientation={orientation}
      truncationPreferred={truncationPreferred}>
      <gmp-place-details-place-request
        place={placeId}></gmp-place-details-place-request>
      <gmp-place-details-location-request
        location={location}></gmp-place-details-location-request>
      <PlaceContentConfig
        contentConfig={contentConfig}
        customContent={customContent}
      />
    </gmp-place-details-compact>
  ) : (
    <gmp-place-details
      className={className}
      style={style}
      ongmp-load={onLoad}
      ongmp-error={onError}>
      <gmp-place-details-location-request
        location={location}></gmp-place-details-location-request>
      <gmp-place-details-place-request
        place={placeId}></gmp-place-details-place-request>
      <PlaceContentConfig
        contentConfig={contentConfig}
        customContent={customContent}
      />
    </gmp-place-details>
  );
};

PlaceDetails.displayName = 'PlaceDetails';
