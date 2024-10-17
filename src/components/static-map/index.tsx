import React, {useContext, PropsWithChildren} from 'react';

import {APIProviderContext} from '../api-provider';

const MAPS_API_STATIC_URL = 'https://maps.googleapis.com/maps/api/staticmap';

/**
 * Props for the StaticMap Component
 */
export type StaticMapProps = Omit<
  google.maps.MapOptions,
  'renderingType' | 'colorScheme'
> & {
  defaultCenter?: google.maps.LatLngLiteral;
  defaultZoom?: number;
  signature?: string;
};

export const StaticMap = (props: PropsWithChildren<StaticMapProps>) => {
  const addSearchParams = (url: URL, params = {}) => {
    const searchParams = new URLSearchParams(url.searchParams);

    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    return `${url.origin}${url.pathname}?${searchParams.toString()}`;
  };

  const context = useContext(APIProviderContext);

  const imgSrc = new URL(MAPS_API_STATIC_URL);
  const newParams: Record<string, string | number> = {
    key: context?.apiKey || '',
    scale: 2,
    size: '640x640'
  };

  Object.entries(props).forEach(([key, val]) => {
    switch (key) {
      case 'defaultCenter':
        if (
          typeof val === 'object' &&
          val !== null &&
          'lat' in val &&
          'lng' in val
        ) {
          newParams.center = `${val?.lat},${val?.lng}`;
        }
        break;
      case 'zoom':
        if (typeof val === 'number') {
          newParams.zoom = Math.max(0, val - 1).toString();
        }
        break;
    }
  });

  // Construct the URL with parameters
  let signedUrl = addSearchParams(imgSrc, newParams);

  // Append the signature if provided
  if (props.signature) {
    signedUrl = `${signedUrl}&signature=${props.signature}`;
  }

  return <img src={signedUrl} width="100%" />;
};
