import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {ContentItem, PlaceContentConfig} from './place-content-config';
import {useDomEventListener, usePropBinding} from '../utility-hooks';
import {CSSWithCustomProperties} from '../places';

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
   * See https://developers.google.com/maps/documentation/javascript/reference/places-widget#PlaceSearchElement-CSS-Properties
   */
  style?: CSSWithCustomProperties;

  /**
   * Position of attribution, defaults to TOP
   */
  attributionPosition?: google.maps.places.PlaceSearchAttributionPosition;
  /**
   * Orientation of the list, defaults to vertical
   */
  orientation?: google.maps.places.PlaceSearchOrientation;
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
   * Show all available content. If set, this overwrites any custom content config
   */
  allContent?: boolean;
  /**
   * The array lists the content elements to display.
   * If populated, a custom config will be rendered, unless allContent is true
   */
  contentItems?: Array<ContentItem>;

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
    allContent,
    contentItems,
    attributionPosition,
    orientation,
    truncationPreferred,
    selectable,
    onLoad,
    onSelect,
    onError
  } = props;

  const resolvedAttributionPosition =
    attributionPosition ??
    globalThis.google?.maps?.places?.PlaceSearchAttributionPosition.TOP;
  const resolvedOrientation =
    orientation ??
    globalThis.google?.maps?.places?.PlaceSearchOrientation.VERTICAL;

  // Load required Google Maps library for places
  const placesLibrary = useMapsLibrary('places');

  const [placeSearch, setPlaceSearch] =
    useState<google.maps.places.PlaceSearchElement | null>(null);

  usePropBinding(
    placeSearch,
    'attributionPosition',
    resolvedAttributionPosition
  );
  usePropBinding(placeSearch, 'orientation', resolvedOrientation);
  usePropBinding(
    placeSearch,
    'truncationPreferred',
    Boolean(truncationPreferred)
  );
  usePropBinding(placeSearch, 'selectable', Boolean(selectable));

  useDomEventListener(placeSearch, 'gmp-load', onLoad);
  useDomEventListener(placeSearch, 'gmp-select', onSelect);
  useDomEventListener(placeSearch, 'gmp-error', onError);

  useEffect(() => {
    if (!placesLibrary || !textSearch || !placeSearch) return;

    const textSearchRequest =
      new google.maps.places.PlaceTextSearchRequestElement();

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
      new google.maps.places.PlaceNearbySearchRequestElement();
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
      <PlaceContentConfig allContent={allContent} contentItems={contentItems} />
    </gmp-place-search>
  );
};

PlaceSearch.displayName = 'PlaceSearch';
