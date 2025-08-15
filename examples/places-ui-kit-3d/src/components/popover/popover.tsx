import React from 'react';
import {memo} from 'react';
import {PlaceDetails} from '../place-details/place-details';

import './popover.css';
import {PlaceLocationWithId} from '../../app';

type PopoverProps = {
  place: PlaceLocationWithId | null;
  useCustomStyling: boolean;
};

export const Popover = memo((props: PopoverProps) => {
  if (!props.place) return null;

  const locationString = props.place
    ? `${props.place.location.lat}, ${props.place.location.lng}`
    : '';
  return (
    <gmp-popover
      open={Boolean(props.place)}
      position-anchor={locationString}
      light-dismiss-disabled
      altitude-mode={google.maps.maps3d.AltitudeMode.RELATIVE_TO_MESH}>
      <PlaceDetails
        place={props.place?.id ?? ''}
        useStandardContent={true}
        useCustomStyling={props.useCustomStyling}
      />
    </gmp-popover>
  );
});
