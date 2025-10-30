import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {useEffect, useState} from 'react';
import {memo} from 'react';

type PlaceDetailsProps = {
  place: string;
  useStandardContent?: boolean;
  useCustomStyling: boolean;
};

export const PlaceDetailsOrientation = {
  VERTICAL: 'VERTICAL',
  HORIZONTAL: 'HORIZONTAL'
} as const;
export type PlaceDetailsOrientation =
  (typeof PlaceDetailsOrientation)[keyof typeof PlaceDetailsOrientation];

const PlaceDetailsComponent = (props: PlaceDetailsProps) => {
  const [customElementsReady, setCustomElementsReady] = useState(false);
  useEffect(() => {
    customElements.whenDefined('gmp-place-details-compact').then(() => {
      setCustomElementsReady(true);
    });
  }, []);

  if (!customElementsReady) return null;

  return (
    <gmp-place-details-compact
      className={props.useCustomStyling ? 'custom' : undefined}
      orientation={'HORIZONTAL'}
      truncation-preferred>
      <gmp-place-details-place-request
        place={props.place}></gmp-place-details-place-request>
      {props.useStandardContent ? (
        <gmp-place-standard-content />
      ) : (
        <gmp-place-content-config>
          <gmp-place-rating />
          <gmp-place-type />
        </gmp-place-content-config>
      )}
    </gmp-place-details-compact>
  );
};
PlaceDetailsComponent.displayName = 'PlaceDetails';

export const PlaceDetails = memo(PlaceDetailsComponent);
