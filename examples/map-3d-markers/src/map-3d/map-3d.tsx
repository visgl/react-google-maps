import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import {useCallbackRef, useDeepCompareEffect} from '../utility-hooks';

import './map-3d-types';

import MarkerCustomPin from '../markers/marker-custom-pin';
import SvgMarker from '../markers/svg-marker';
import Model3D from '../markers/model-3d';

import markerConfig from '../../config/marker-config.json';

type MarkerConfig = Record<
  string,
  {
    markerOptions: google.maps.maps3d.Marker3DElementOptions;
    pinOptions?: google.maps.marker.PinElementOptions;
  }
>;

const {basic, basicExtruded, basicColored, customLogo, model3d, svg} =
  markerConfig as MarkerConfig;

export type Map3DProps = google.maps.maps3d.Map3DElementOptions & {
  onCameraChange?: (cameraProps: Map3DCameraProps) => void;
};

export type Map3DCameraProps = {
  center: google.maps.LatLngAltitudeLiteral;
  range: number;
  heading: number;
  tilt: number;
  roll: number;
};

export const Map3D = forwardRef(
  (
    props: Map3DProps,
    forwardedRef: ForwardedRef<google.maps.maps3d.Map3DElement | null>
  ) => {
    useMapsLibrary('maps3d');

    const [map3DElement, map3dRef] =
      useCallbackRef<google.maps.maps3d.Map3DElement>();

    const [customElementsReady, setCustomElementsReady] = useState(false);
    useEffect(() => {
      customElements.whenDefined('gmp-map-3d').then(() => {
        setCustomElementsReady(true);
      });
    }, []);

    const {center, heading, tilt, range, roll, ...map3dOptions} = props;

    useDeepCompareEffect(() => {
      if (!map3DElement) return;

      // copy all values from map3dOptions to the map3D element itself
      Object.assign(map3DElement, map3dOptions);
    }, [map3DElement, map3dOptions]);

    useImperativeHandle<
      google.maps.maps3d.Map3DElement | null,
      google.maps.maps3d.Map3DElement | null
    >(forwardedRef, () => map3DElement, [map3DElement]);

    if (!customElementsReady) return null;

    return (
      <gmp-map-3d
        ref={map3dRef}
        center={center}
        range={props.range}
        heading={props.heading}
        tilt={props.tilt}
        roll={props.roll}
        mode="SATELLITE">
        <gmp-marker-3d {...basic.markerOptions} />
        <gmp-marker-3d {...basicExtruded.markerOptions} />
        <MarkerCustomPin
          markerOptions={basicColored.markerOptions}
          pinOptions={basicColored.pinOptions}
        />
        <MarkerCustomPin
          markerOptions={customLogo.markerOptions}
          pinOptions={customLogo.pinOptions}
        />
        <SvgMarker
          markerOptions={svg.markerOptions}
          svgUrl={
            'https://www.gstatic.com/images/branding/productlogos/maps/v7/192px.svg'
          }
        />
        <Model3D
          markerOptions={model3d.markerOptions}
          url={new URL('../../data/balloon-red.glb', import.meta.url)}
        />
      </gmp-map-3d>
    );
  }
);
