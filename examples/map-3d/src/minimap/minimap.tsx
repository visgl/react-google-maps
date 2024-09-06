import React, {useMemo} from 'react';
import {Map, MapMouseEvent, useMap} from '@vis.gl/react-google-maps';

import {useDebouncedEffect} from '../utility-hooks';
import {estimateCameraPosition} from './estimate-camera-position';
import {CameraPositionMarker} from './camera-position-marker';
import {ViewCenterMarker} from './view-center-marker';

import type {Map3DCameraProps} from '../map-3d';

type MiniMapProps = {
  camera3dProps: Map3DCameraProps;
  onMapClick?: (ev: MapMouseEvent) => void;
};

export const MiniMap = ({camera3dProps, onMapClick}: MiniMapProps) => {
  const minimap = useMap('minimap');

  const cameraPosition = useMemo(
    () => estimateCameraPosition(camera3dProps),
    [camera3dProps]
  );

  useDebouncedEffect(
    () => {
      if (!minimap) return;

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(camera3dProps.center);
      bounds.extend(cameraPosition);

      const maxZoom = Math.max(
        1,
        Math.round(24 - Math.log2(camera3dProps.range))
      );

      minimap.fitBounds(bounds, 120);
      minimap.setZoom(maxZoom);
    },
    200,
    [minimap, camera3dProps.center, camera3dProps.range, cameraPosition]
  );

  return (
    <Map
      id={'minimap'}
      className={'minimap'}
      mapId={'bf51a910020fa25a'}
      defaultCenter={camera3dProps.center}
      defaultZoom={10}
      onClick={onMapClick}
      disableDefaultUI
      clickableIcons={false}>
      <ViewCenterMarker position={camera3dProps.center}></ViewCenterMarker>
      <CameraPositionMarker
        position={cameraPosition}
        heading={camera3dProps.heading}></CameraPositionMarker>
    </Map>
  );
};
