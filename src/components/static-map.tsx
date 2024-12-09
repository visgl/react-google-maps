import React from 'react';

export {createStaticMapsUrl} from '../libraries/create-static-maps-url';
export * from '../libraries/create-static-maps-url/types';

/**
 * Props for the StaticMap component
 */
export type StaticMapProps = {
  url: string;
};

export const StaticMap = async (props: StaticMapProps) => {
  const {url} = props;

  if (!url) throw new Error('URL is required');

  return <img src={url} width="100%" />;
};
