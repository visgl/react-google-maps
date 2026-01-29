import React, {FunctionComponent, useEffect, useRef} from 'react';

// --- 2. Custom Element Options ---
// These are the possible children for gmp-place-content-config when type is 'custom'.
// Note: We've made these specific to PlaceDetailsElement as per the prompt.
export const BasicContentItem = {
  ADDRESS: 'address',
  ACCESSIBLE_ENTRANCE_ICON: 'accessible-entrance-icon',
  OPEN_NOW_STATUS: 'open-now-status',
  PRICE: 'price',
  RATING: 'rating',
  TYPE: 'type',
  FEATURE_LIST: 'feature-list',
  OPENING_HOURS: 'opening-hours',
  PHONE_NUMBER: 'phone-number',
  PLUS_CODE: 'plus-code',
  REVIEWS: 'reviews',
  SUMMARY: 'summary',
  TYPE_SPECIFIC_HIGHLIGHTS: 'type-specific-highlights',
  WEBSITE: 'website'
} as const;

export type BasicContentItem =
  (typeof BasicContentItem)[keyof typeof BasicContentItem];

type AttributionProps = {
  lightSchemeColor?: google.maps.places.AttributionColor | null;
  darkSchemeColor?: google.maps.places.AttributionColor | null;
};

type MediaProps = {
  lightboxPreferred?: boolean;
  // FIXME: update to google.maps.places.MediaSize
  preferredSize?: 'SMALL' | 'MEDIUM' | 'LARGE';
};

type AttributionContentItem = {
  type: 'attribution';
  options?: AttributionProps;
};

type MediaContentItem = {
  type: 'media';
  options?: MediaProps;
};

export type ContentItem =
  | BasicContentItem
  | AttributionContentItem
  | MediaContentItem;

export type PlaceContentConfigProps = {
  /**
   * Show all available content. If set, this overwrites any custom content config
   */
  allContent?: boolean;
  /**
   * The array lists the content elements to display.
   * If populated, a custom config will be rendered, unless allContent is true
   */
  contentItems?: Array<ContentItem>;
};

const AttributionWrapper: FunctionComponent<AttributionProps> = ({
  lightSchemeColor,
  darkSchemeColor
}) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.lightSchemeColor = lightSchemeColor;
      ref.current.darkSchemeColor = darkSchemeColor;
    }
  }, [lightSchemeColor, darkSchemeColor]);

  return <gmp-place-attribution ref={ref} />;
};

const MediaWrapper: FunctionComponent<MediaProps> = ({
  lightboxPreferred,
  preferredSize
}) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.lightboxPreferred = lightboxPreferred;
      ref.current.preferredSize = preferredSize;
    }
  }, [lightboxPreferred, preferredSize]);

  return <gmp-place-media ref={ref} />;
};

/**
 * Maps a content item string to its corresponding Google Maps Web Component JSX.
 */
const renderContentItem = (itemConfig: ContentItem, key: number) => {
  const itemType =
    typeof itemConfig === 'string' ? itemConfig : itemConfig.type;
  switch (itemType) {
    case BasicContentItem.ADDRESS:
      return <gmp-place-address key={key} />;
    case BasicContentItem.ACCESSIBLE_ENTRANCE_ICON:
      return <gmp-place-accessible-entrance-icon key={key} />;
    case 'attribution':
      const {lightSchemeColor, darkSchemeColor} =
        (itemConfig as AttributionContentItem).options || {};

      return (
        <AttributionWrapper
          key={key}
          lightSchemeColor={lightSchemeColor}
          darkSchemeColor={darkSchemeColor}
        />
      );
    case 'media':
      const {lightboxPreferred, preferredSize} =
        (itemConfig as MediaContentItem).options || {};

      return (
        <MediaWrapper
          key={key}
          lightboxPreferred={lightboxPreferred}
          preferredSize={preferredSize}
        />
      );
    case BasicContentItem.OPEN_NOW_STATUS:
      return <gmp-place-open-now-status key={key} />;
    case BasicContentItem.PRICE:
      return <gmp-place-price key={key} />;
    case BasicContentItem.RATING:
      return <gmp-place-rating key={key} />;
    case BasicContentItem.TYPE:
      return <gmp-place-type key={key} />;
    case BasicContentItem.FEATURE_LIST:
      return <gmp-place-feature-list key={key} />;
    case BasicContentItem.OPENING_HOURS:
      return <gmp-place-opening-hours key={key} />;
    case BasicContentItem.PHONE_NUMBER:
      return <gmp-place-phone-number key={key} />;
    case BasicContentItem.PLUS_CODE:
      return <gmp-place-plus-code key={key} />;
    case BasicContentItem.REVIEWS:
      return <gmp-place-reviews key={key} />;
    case BasicContentItem.SUMMARY:
      return <gmp-place-summary key={key} />;
    case BasicContentItem.TYPE_SPECIFIC_HIGHLIGHTS:
      return <gmp-place-type-specific-highlights key={key} />;
    case BasicContentItem.WEBSITE:
      return <gmp-place-website key={key} />;
    default:
      return null;
  }
};

export const PlaceContentConfig: FunctionComponent<
  PlaceContentConfigProps
> = props => {
  const {allContent, contentItems} = props;

  // allContent takes priority over any custom content config
  if (allContent) {
    return <gmp-place-all-content />;
  }
  // to render a custom content config allContent needs to be unset or false and contentItems must not be empty
  else if (contentItems && contentItems.length) {
    return (
      <gmp-place-content-config>
        {contentItems.map(renderContentItem)}
      </gmp-place-content-config>
    );
  }
  // default is standard-content
  else {
    return <gmp-place-standard-content />;
  }
};
