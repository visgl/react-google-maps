import React, {FunctionComponent, useEffect, useRef} from 'react';

export const ContentConfig = {
  STANDARD: 'standard',
  ALL: 'all',
  CUSTOM: 'custom'
} as const;

export type ContentConfig = (typeof ContentConfig)[keyof typeof ContentConfig];

// --- 2. Custom Element Options ---
// These are the possible children for gmp-place-content-config when type is 'custom'.
// Note: We've made these specific to PlaceDetailsElement as per the prompt.
export type PlaceDetailsContentItem =
  | 'address'
  | 'accessible-entrance-icon'
  | 'attribution'
  | 'media'
  | 'open-now-status'
  | 'price'
  | 'rating'
  | 'type'
  // noncompact only
  | 'feature-list'
  | 'opening-hours'
  | 'phone-number'
  | 'plus-code'
  | 'reviews'
  | 'summary'
  | 'type-specific-highlights'
  | 'website';

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
  attribute: 'attribution';
  options?: AttributionProps;
};

type MediaContentItem = {
  attribute: 'media';
  options?: MediaProps;
};

type DefaultContentItem = {
  attribute: Omit<PlaceDetailsContentItem, 'attribution' | 'media'>;
  options?: never;
};

export type ContentItem =
  | AttributionContentItem
  | MediaContentItem
  | DefaultContentItem;

export type PlaceContentConfigProps = {
  contentConfig: ContentConfig;
  /**
   * Required only if type is 'custom'.
   * The array lists the content elements to display.
   */
  customContent?: Array<ContentItem>;
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
  switch (itemConfig.attribute) {
    case 'address':
      return <gmp-place-address key={key} />;
    case 'accessible-entrance-icon':
      return <gmp-place-accessible-entrance-icon key={key} />;
    case 'attribution':
      const {lightSchemeColor, darkSchemeColor} =
        (itemConfig.options as AttributionContentItem['options']) || {};

      return (
        <AttributionWrapper
          key={key}
          lightSchemeColor={lightSchemeColor}
          darkSchemeColor={darkSchemeColor}
        />
      );
    case 'media':
      const {lightboxPreferred, preferredSize} =
        (itemConfig.options as MediaContentItem['options']) || {};

      return (
        <MediaWrapper
          key={key}
          lightboxPreferred={lightboxPreferred}
          preferredSize={preferredSize}
        />
      );
    case 'open-now-status':
      return <gmp-place-open-now-status key={key} />;
    case 'price':
      return <gmp-place-price key={key} />;
    case 'rating':
      return <gmp-place-rating key={key} />;
    case 'type':
      return <gmp-place-type key={key} />;
    case 'feature-list':
      return <gmp-place-feature-list key={key} />;
    case 'opening-hours':
      return <gmp-place-opening-hours key={key} />;
    case 'phone-number':
      return <gmp-place-phone-number key={key} />;
    case 'plus-code':
      return <gmp-place-plus-code key={key} />;
    case 'reviews':
      return <gmp-place-reviews key={key} />;
    case 'summary':
      return <gmp-place-summary key={key} />;
    case 'type-specific-highlights':
      return <gmp-place-type-specific-highlights key={key} />;
    case 'website':
      return <gmp-place-website key={key} />;
    default:
      return null;
  }
};

export const PlaceContentConfig: FunctionComponent<
  PlaceContentConfigProps
> = props => {
  const {contentConfig, customContent} = props;

  // Determine the content element to render based on the config type
  switch (contentConfig) {
    case ContentConfig.STANDARD:
      return <gmp-place-standard-content />;
    case ContentConfig.ALL:
      return <gmp-place-all-content />;
    case ContentConfig.CUSTOM:
      if (!customContent || customContent.length === 0) {
        console.error(
          'PlaceContentConfig: customContent must be provided for type "custom".'
        );
        return null;
      }

      // Render the custom config element with its children
      return (
        <gmp-place-content-config>
          {customContent.map(renderContentItem)}
        </gmp-place-content-config>
      );
    default:
      return null;
  }
};
