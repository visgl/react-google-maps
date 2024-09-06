import React from 'react';
import {AdvancedMarker} from '@vis.gl/react-google-maps';

import './camera-position-marker.css';

type CameraPositionMarkerProps = {
  position: google.maps.LatLngAltitudeLiteral;
  heading: number;
};

export const CameraPositionMarker = ({
  position,
  heading
}: CameraPositionMarkerProps) => (
  <AdvancedMarker
    position={position}
    style={{width: 0, height: 0}}
    className={'camera-position-marker'}>
    <svg
      viewBox={'-1 -1 2 2'}
      width={20}
      height={20}
      style={{'--camera-heading': heading} as React.CSSProperties}>
      <path d={'M0,-1L-.5,1L.5,1z'}></path>
    </svg>
  </AdvancedMarker>
);
