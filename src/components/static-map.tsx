import React from 'react';

export {createStaticMapsUrl} from '../libraries/create-static-maps-url';
export * from '../libraries/create-static-maps-url/types';

/**
 * Props for the StaticMap component
 */
export type StaticMapProps = {
  url: string;
  className?: string;
};

export const StaticMap = (props: StaticMapProps) => {
  const {url, className} = props;

  if (!url) throw new Error('URL is required');

  return <img className={className} src={url} width="100%" />;
};
