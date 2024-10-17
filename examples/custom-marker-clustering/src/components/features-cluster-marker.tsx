import React, {useCallback} from 'react';
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import {CastleSvg} from './castle-svg';

type TreeClusterMarkerProps = {
  clusterId: number;
  onMarkerClick?: (
    marker: google.maps.marker.AdvancedMarkerElement,
    clusterId: number
  ) => void;
  position: google.maps.LatLngLiteral;
  size: number;
  sizeAsText: string;
};

export const FeaturesClusterMarker = ({
  position,
  size,
  sizeAsText,
  onMarkerClick,
  clusterId
}: TreeClusterMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, clusterId),
    [onMarkerClick, marker, clusterId]
  );
  const markerSize = Math.floor(48 + Math.sqrt(size) * 2);
  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={size}
      onClick={handleClick}
      className={'marker cluster'}
      style={{width: markerSize, height: markerSize}}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}>
      <CastleSvg />
      <span>{sizeAsText}</span>
    </AdvancedMarker>
  );
};
