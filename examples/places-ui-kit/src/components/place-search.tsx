import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {useDomEventListener} from '../../../../src/hooks/use-dom-event-listener';
import {usePropBinding} from '../../../../src/hooks/use-prop-binding';
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
   * nearby search takes priority if both are provided
   */
  nearbySearch?: NearbySearchOptions;
  textSearch?: TextSearchOptions;

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

  const [placeSearch, setPlaceSearch] =
    // @ts-ignore
    useState<google.maps.places.PlaceSearchElement | null>(null);

  usePropBinding(placeSearch, 'attributionPosition', attributionPosition);
  usePropBinding(placeSearch, 'orientation', orientation);
  usePropBinding(placeSearch, 'truncationPreferred', truncationPreferred);
  usePropBinding(placeSearch, 'selectable', selectable);

  useDomEventListener(placeSearch, 'gmp-load', onLoad);
  useDomEventListener(placeSearch, 'gmp-select', onSelect);
  useDomEventListener(placeSearch, 'gmp-error', onError);

  useEffect(() => {
    if (!placesLibrary || !textSearch || !placeSearch) return;

    const textSearchRequest =
      // @ts-ignore types are not up to date here
      new placesLibrary.PlaceTextSearchRequestElement();

    textSearchRequest.textQuery = textSearch.textQuery;
    textSearchRequest.evConnectorTypes = textSearch.evConnectorTypes;
    textSearchRequest.evMinimumChargingRateKw =
      textSearch.evMinimumChargingRateKw;
    textSearchRequest.includedType = textSearch.includedType;
    textSearchRequest.isOpenNow = textSearch.isOpenNow;
    textSearchRequest.locationBias = textSearch.locationBias;
    textSearchRequest.locationRestriction = textSearch.locationRestriction;
    textSearchRequest.maxResultCount = textSearch.maxResultCount;
    textSearchRequest.minRating = textSearch.minRating;
    textSearchRequest.priceLevels = textSearch.priceLevels;
    textSearchRequest.rankPreference = textSearch.rankPreference;
    textSearchRequest.useStrictTypeFiltering =
      textSearch.useStrictTypeFiltering;

    placeSearch.appendChild(textSearchRequest);

    return () => {
      if (placeSearch.contains(textSearchRequest)) {
        placeSearch.removeChild(textSearchRequest);
      }
    };
  }, [placesLibrary, textSearch, placeSearch]);

  useEffect(() => {
    if (!placesLibrary || !nearbySearch || !placeSearch) return;
    const {
      locationRestriction,
      excludedPrimaryTypes,
      excludedTypes,
      includedPrimaryTypes,
      includedTypes,
      maxResultCount,
      rankPreference
    } = nearbySearch;

    const nearbySearchRequest =
      // @ts-ignore
      new placesLibrary.PlaceNearbySearchRequestElement();
    nearbySearchRequest.locationRestriction = locationRestriction;
    nearbySearchRequest.excludedPrimaryTypes = excludedPrimaryTypes;
    nearbySearchRequest.excludedTypes = excludedTypes;
    nearbySearchRequest.includedPrimaryTypes = includedPrimaryTypes;
    nearbySearchRequest.includedTypes = includedTypes;
    nearbySearchRequest.maxResultCount = maxResultCount;
    nearbySearchRequest.rankPreference = rankPreference;

    placeSearch.appendChild(nearbySearchRequest);

    return () => {
      if (placeSearch.contains(nearbySearchRequest)) {
        placeSearch.removeChild(nearbySearchRequest);
      }
    };
  }, [placesLibrary, nearbySearch, placeSearch]);

  if (!placesLibrary || !(nearbySearch || textSearch)) return null;

  return (
    <gmp-place-search ref={setPlaceSearch} className={className} style={style}>
      <PlaceContentConfig
        contentConfig={contentConfig}
        customContent={customContent}
      />
    </gmp-place-search>
  );
};

PlaceSearch.displayName = 'PlaceSearch';
