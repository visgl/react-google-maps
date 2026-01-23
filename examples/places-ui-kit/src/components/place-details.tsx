import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {FunctionComponent, useState} from 'react';
import {
  ConfigPreset,
  ContentItem,
  PlaceContentConfig
} from './place-content-config';
import {useDomEventListener} from '../../../../src/hooks/use-dom-event-listener';
import {usePropBinding} from '../../../../src/hooks/use-prop-binding';

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
   * See https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsElement-CSS-Properties
   * and https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceDetailsCompactElement-CSS-Properties
   */
  style?: React.CSSProperties & {
    [key: `--${string}`]: string | number;
  };

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
   * The config preset to use in case no custom config is wanted
   * Allowed values are standard and all, default is standard.
   */
  configPreset?: ConfigPreset;
  /**
   * The array lists the content elements to display.
   * If populated, a custom config will be rendered
   */
  contentItems?: Array<ContentItem>;

  // compact only
  /**
   * Orientation of the displayed information. Defaults to vertical.
   */
  orientation?: google.maps.places.PlaceDetailsOrientation;
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
  // Load required Google Maps library for places
  const placesLibrary = useMapsLibrary('places');

  const {
    className,
    style,
    compact = false,
    placeId,
    location,
    configPreset,
    contentItems,
    orientation,
    truncationPreferred = false,
    onLoad,
    onError
  } = props;

  const [compactDetailsElement, setCompactDetailsElement] =
    useState<google.maps.places.PlaceDetailsCompactElement | null>(null);
  const [standardDetailsElement, setStandardDetailsElement] =
    useState<google.maps.places.PlaceDetailsElement | null>(null);
  const detailsElement = compact
    ? compactDetailsElement
    : standardDetailsElement;

  usePropBinding(compactDetailsElement, 'orientation', orientation);
  usePropBinding(
    compactDetailsElement,
    'truncationPreferred',
    truncationPreferred
  );

  useDomEventListener(detailsElement, 'gmp-load', onLoad);
  useDomEventListener(detailsElement, 'gmp-error', onError);

  if (!placesLibrary || !(placeId || location)) return null;

  return compact ? (
    <gmp-place-details-compact
      ref={setCompactDetailsElement}
      className={className}
      style={style}>
      <gmp-place-details-place-request
        place={placeId}></gmp-place-details-place-request>
      <gmp-place-details-location-request
        location={location}></gmp-place-details-location-request>
      <PlaceContentConfig preset={configPreset} contentItems={contentItems} />
    </gmp-place-details-compact>
  ) : (
    <gmp-place-details
      ref={setStandardDetailsElement}
      className={className}
      style={style}>
      <gmp-place-details-location-request
        location={location}></gmp-place-details-location-request>
      <gmp-place-details-place-request
        place={placeId}></gmp-place-details-place-request>
      <PlaceContentConfig preset={configPreset} contentItems={contentItems} />
    </gmp-place-details>
  );
};

PlaceDetails.displayName = 'PlaceDetails';
