import 'google.maps';
import type {CustomElement} from './utils';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type NoAttributes = {};
type NoChildren = {children?: never};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      // ================================
      // ======== Places Widgets ========
      // ================================

      'gmp-place-autocomplete': CustomElement<
        // FIXME: the PlaceAutocompleteElementOptions type in @types/google.maps isn't the one defined in the docs.
        //   https://developers.google.com/maps/documentation/javascript/reference/places-widget
        {
          includedPrimaryTypes?: string[] | null;
          includedRegionCodes?: string[] | null;
          locationBias?: google.maps.places.LocationBias | null;
          locationRestriction?: google.maps.places.LocationRestriction | null;
          name?: string | null;
          origin?:
            | google.maps.LatLng
            | google.maps.LatLngLiteral
            | google.maps.LatLngAltitude
            | google.maps.LatLngAltitudeLiteral
            | string
            | null;
          requestedLanguage?: string | null;
          requestedRegion?: string | null;
          unitSystem?: google.maps.UnitSystem | null;

          // html-attribute versions for props
          'included-primary-types'?: string;
          'included-region-codes'?: string;
          'requested-language'?: string;
          'requested-region'?: string;
          'unit-system'?: string;

          // emits 'gmp-error' and 'gmp-select'
        },
        google.maps.places.PlaceAutocompleteElement
      >;

      // FIXME: this doesn't exist in types, not sure of its relevance. In types, it seems
      //   identical to the gmp-place-autocomplete. See
      //   https://developers.google.com/maps/documentation/javascript/reference/places-widget
      'gmp-basic-place-autocomplete': JSX.IntrinsicElements['gmp-place-autocomplete'];

      // alpha only
      'gmp-place-contextual': CustomElement<
        {
          contextToken?: string | null;
          // html-attribute versions
          'context-token'?: string;
        },
        google.maps.places.PlaceContextualElement
      >;

      // alpha only
      'gmp-place-contextual-list-config': CustomElement<
        {
          layout?: google.maps.places.PlaceContextualListLayout | string | null;
          mapHidden?: boolean | null;

          'map-hidden'?: string | boolean;
        },
        google.maps.places.PlaceContextualListConfigElement
      >;

      'gmp-place-details': CustomElement<
        {readonly place?: google.maps.places.Place | null},
        google.maps.places.PlaceDetailsElement

        // emits 'gmp-error' and 'gmp-load' events
      >;

      'gmp-place-details-compact': CustomElement<
        {
          readonly place?: google.maps.places.Place | null;
          orientation?:
            | google.maps.places.PlaceDetailsOrientation
            | string
            | null;
          truncationPreferred?: boolean | null;

          // html-attribute versions
          'truncation-preferred'?: string | boolean;
        },
        google.maps.places.PlaceDetailsCompactElement
      >;

      'gmp-place-details-place-request': CustomElement<
        {
          place?: google.maps.places.Place | string | null;
        },
        google.maps.places.PlaceDetailsPlaceRequestElement
      >;

      'gmp-place-details-location-request': CustomElement<
        {
          location?:
            | google.maps.LatLng
            | google.maps.LatLngLiteral
            | google.maps.LatLngAltitude
            | google.maps.LatLngAltitudeLiteral
            | string
            | null;
        },
        google.maps.places.PlaceDetailsLocationRequestElement
      >;

      'gmp-place-search': CustomElement<
        {
          attributionPosition?: google.maps.places.PlaceSearchAttributionPosition | null;
          orientation?:
            | google.maps.places.PlaceSearchOrientation
            | string
            | null;
          places?: google.maps.places.Place[] | null;
          selectable?: boolean | null;
          truncationPreferred?: boolean | null;

          'attribution-position'?: string;
          'truncation-preferred'?: string | boolean;

          // emits 'gmp-error', 'gmp-load' and 'gmp-select'
        },
        google.maps.places.PlaceSearchElement
      >;

      'gmp-place-nearby-search-request': CustomElement<
        {
          excludedPrimaryTypes?: string[] | null;
          excludedTypes?: string[] | null;
          includedPrimaryTypes?: string[] | null;
          includedTypes?: string[] | null;
          locationRestriction?:
            | google.maps.Circle
            | google.maps.CircleLiteral
            | null;
          maxResultCount?: number | null;
          rankPreference?: google.maps.places.SearchNearbyRankPreference | null;

          // html-attribute versions
          'excluded-primary-types'?: string;
          'excluded-types'?: string;
          'included-primary-types'?: string;
          'included-types'?: string;
          'max-result-count'?: string | number;
          'rank-preference'?: string;
        },
        google.maps.places.PlaceNearbySearchRequestElement
      >;

      'gmp-place-text-search-request': CustomElement<
        {
          evConnectorTypes?: google.maps.places.EVConnectorType[] | null;
          evMinimumChargingRateKw?: number | null;
          includedType?: string | null;
          isOpenNow?: boolean | null;
          locationBias?: google.maps.places.LocationBias | null;
          locationRestriction?:
            | google.maps.LatLngBounds
            | google.maps.LatLngBoundsLiteral
            | null;
          maxResultCount?: number | null;
          minRating?: number | null;
          priceLevels?: google.maps.places.PriceLevel[] | null;
          rankPreference?: google.maps.places.SearchByTextRankPreference | null;
          textQuery?: string | null;
          useStrictTypeFiltering?: boolean | null;

          // html-attribute versions
          'ev-connector-types'?: string;
          'ev-minimum-charging-rate-kw'?: string | number;
          'included-type'?: string;
          'is-open-now'?: string | boolean;
          'location-bias'?: string;
          'location-restriction'?: string;
          'max-result-count'?: string | number;
          'min-rating'?: string | number;
          'price-levels'?: string;
          'rank-preference'?: string;
          'use-strict-type-filtering'?: string | boolean;
        },
        google.maps.places.PlaceTextSearchRequestElement
      >;

      // ====================================================
      // ======== Place Widget Content Customization ========
      // ====================================================

      'gmp-place-content-config': CustomElement<
        NoAttributes,
        google.maps.places.PlaceContentConfigElement
      >;

      'gmp-place-all-content': CustomElement<
        NoChildren,
        google.maps.places.PlaceAllContentElement
      >;

      'gmp-place-standard-content': CustomElement<
        NoChildren,
        google.maps.places.PlaceStandardContentElement
      >;

      'gmp-place-media': CustomElement<
        {
          lightboxPreferred?: boolean | null;
          preferredSize?: google.maps.places.MediaSize | null;

          // html-attribute versions
          'lightbox-preferred'?: string | boolean;
          'preferred-size'?: string;
        },
        google.maps.places.PlaceMediaElement
      >;

      'gmp-place-address': CustomElement<
        NoChildren,
        google.maps.places.PlaceAddressElement
      >;

      'gmp-place-rating': CustomElement<
        NoChildren,
        google.maps.places.PlaceRatingElement
      >;

      'gmp-place-type': CustomElement<
        NoChildren,
        google.maps.places.PlaceTypeElement
      >;

      'gmp-place-price': CustomElement<
        NoChildren,
        google.maps.places.PlacePriceElement
      >;

      'gmp-place-accessible-entrance-icon': CustomElement<
        NoChildren,
        google.maps.places.PlaceAccessibleEntranceIconElement
      >;

      'gmp-place-open-now-status': CustomElement<
        NoChildren,
        google.maps.places.PlaceOpenNowStatusElement
      >;

      'gmp-place-reviews': CustomElement<
        NoChildren,
        google.maps.places.PlaceReviewsElement
      >;

      'gmp-place-summary': CustomElement<
        NoChildren,
        google.maps.places.PlaceSummaryElement
      >;

      'gmp-place-feature-list': CustomElement<
        NoChildren,
        google.maps.places.PlaceFeatureListElement
      >;

      'gmp-place-opening-hours': CustomElement<
        NoChildren,
        google.maps.places.PlaceOpeningHoursElement
      >;

      'gmp-place-phone-number': CustomElement<
        NoChildren,
        google.maps.places.PlacePhoneNumberElement
      >;

      'gmp-place-plus-code': CustomElement<
        NoChildren,
        google.maps.places.PlacePlusCodeElement
      >;

      'gmp-place-type-specific-highlights': CustomElement<
        NoChildren,
        google.maps.places.PlaceTypeSpecificHighlightsElement
      >;

      'gmp-place-website': CustomElement<
        NoChildren,
        google.maps.places.PlaceWebsiteElement
      >;

      'gmp-place-attribution': CustomElement<
        {
          darkSchemeColor?: google.maps.places.AttributionColor | null;
          lightSchemeColor?: google.maps.places.AttributionColor | null;

          // html-attribute versions
          'dark-scheme-color'?: string;
          'light-scheme-color'?: string;
        },
        google.maps.places.PlaceAttributionElement
      >;
    }
  }
}
