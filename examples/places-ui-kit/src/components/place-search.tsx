import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {FunctionComponent} from 'react';
import {
  ContentConfig,
  ContentItem,
  PlaceContentConfig
} from './place-content-config';
import {Orientation} from './place-details';

export const AttributionPosition = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM'
} as const;

export type AttributionPosition =
  (typeof AttributionPosition)[keyof typeof AttributionPosition];

export type TextSearchOptions = {
  textQuery: string;

  evConnectorTypes?: Array<google.maps.places.EVConnectorType>;
  evMinimumChargingRateKw?: number;
  includedType?: string;
  isOpenNow?: boolean;
  locationBias?: google.maps.places.LocationBias;
  locationRestriction?:
    | google.maps.LatLngBounds
    | google.maps.LatLngBoundsLiteral;
  maxResultCount?: number;
  minRating?: number;
  priceLevels?: Array<google.maps.places.PriceLevel>;
  rankPreference?: google.maps.places.SearchByTextRankPreference;
  useStrictTypeFiltering?: boolean;
};

export type NearbySearchOptions = {
  locationRestriction: google.maps.Circle | google.maps.CircleLiteral;

  excludedPrimaryTypes?: Array<string>;
  excludedTypes?: Array<string>;
  includedPrimaryTypes?: Array<string>;
  includedTypes?: Array<string>;
  maxResultCount?: number;
  rankPreference?: google.maps.places.SearchNearbyRankPreference;
};

export type PlaceSearchProps = {
  /**
   * Classname to pass on to gmp-place-search
   */
  className?: string;
  /**
   * CSS properties to pass on to gmp-place-search
   */
  style?: React.CSSProperties;
  /**
   * Position of attribution, defaults to TOP
   */
  attributionPosition?: AttributionPosition;
  /**
   * Orientation of the list, defaults to vertical
   */
  orientation?: Orientation;
  /**
   * Whether or not text should be truncated
   */
  truncationPreferred?: boolean;
  /**
   * Whether or not the list items should be selectable
   * Required for onSelect to work, otherwise optional
   */
  selectable?: boolean;

  /**
   * Show list of results based on either a nearby or a text search
   * text search takes priority if both are provided
   */
  textSearch?: TextSearchOptions;
  nearbySearch?: NearbySearchOptions;

  /**
   *  Content config. Defaults to 'standard'
   */
  contentConfig: ContentConfig;
  /**
   * Required only if type is 'custom'.
   * The array lists the content elements to display.
   */
  customContent?: Array<ContentItem>;

  /**
   * Fired when the search results are loaded
   */
  onLoad?: ({
    target: {places}
  }: {
    target: {places: Array<google.maps.places.Place>}; //tbd
  }) => void;
  /**
   * Fired when a place is selected from the list
   */
  onSelect?: ({place}: {place: google.maps.places.Place}) => void;
  /**
   * Fired on error
   */
  onError?: (e: Event) => void;
};

/**
 * Wrapper component for gmp-place-search
 * Properties and styling options according to https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceSearchElement
 */
export const PlaceSearch: FunctionComponent<PlaceSearchProps> = props => {
  const {
    className,
    style,
    nearbySearch,
    textSearch,
    contentConfig = ContentConfig.STANDARD,
    customContent,
    attributionPosition,
    orientation = Orientation.VERTICAL,
    truncationPreferred,
    selectable,
    onLoad,
    onSelect,
    onError
  } = props;

  // Load required Google Maps library for places
  const placesLibrary = useMapsLibrary('places');

  if (!placesLibrary || !(nearbySearch || textSearch)) return null;

  return (
    <gmp-place-search
      className={className}
      style={style}
      attributionPosition={attributionPosition}
      orientation={orientation}
      truncationPreferred={truncationPreferred}
      selectable={selectable}
      ongmp-load={onLoad}
      ongmp-select={onSelect}
      ongmp-error={onError}>
      {textSearch && (
        <gmp-place-text-search-request
          {...textSearch}></gmp-place-text-search-request>
      )}
      {nearbySearch && (
        <gmp-place-nearby-search-request
          {...nearbySearch}></gmp-place-nearby-search-request>
      )}
      <PlaceContentConfig
        contentConfig={contentConfig}
        customContent={customContent}
      />
    </gmp-place-search>
  );
};

PlaceSearch.displayName = 'PlaceSearch';
