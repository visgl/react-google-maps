import {useMapsLibrary} from '@vis.gl/react-google-maps';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {useMap3DCameraEvents} from './use-map-3d-camera-events';
import {useCallbackRef, useDeepCompareEffect} from '../../utility-hooks';
import {ReferenceMarker} from '../reference-marker/reference-marker';
import {Popover} from '../popover/popover';
import {PlaceLocationWithId, REFERENCE_PLACE} from '../../app';
import {PlaceMarker} from '../place-marker/place-marker';

export type Map3DProps = google.maps.maps3d.Map3DElementOptions & {
  onCameraChange?: (cameraProps: Map3DCameraProps) => void;
  handleClick: (place: PlaceLocationWithId) => void;
  selectedPlace: PlaceLocationWithId | null;
  useCustomStyling: boolean;
  places: google.maps.places.Place[];
  setPlaces: (places: google.maps.places.Place[]) => void;
};

export type Map3DCameraProps = {
  center: google.maps.LatLngAltitudeLiteral;
  range: number;
  heading: number;
  tilt: number;
  roll: number;
};

const Map3DComponent = (props: React.PropsWithChildren<Map3DProps>) => {
  useMapsLibrary('maps3d');

  const [map3DElement, map3dRef] =
    useCallbackRef<google.maps.maps3d.Map3DElement>();

  useMap3DCameraEvents(map3DElement, p => {
    if (!props.onCameraChange) return;

    props.onCameraChange(p);
  });

  const [customElementsReady, setCustomElementsReady] = useState(false);
  useEffect(() => {
    customElements.whenDefined('gmp-map-3d').then(() => {
      setCustomElementsReady(true);
    });
  }, []);

  const {places, handleClick} = props;
  const placeMarkers = useMemo(() => {
    return places.map((place, index) => {
      const placeWithLocation = {
        id: place.id,
        location: place.location!.toJSON()
      };

      return (
        <PlaceMarker
          key={place.id || index}
          markerOptions={{
            position: {...place.location!.toJSON(), altitude: 0},
            drawsWhenOccluded: true,
            altitudeMode: google.maps.maps3d.AltitudeMode.RELATIVE_TO_MESH
          }}
          onClick={() => handleClick(placeWithLocation)}
        />
      );
    });
  }, [places, handleClick]);

  const {center, heading, tilt, range, roll, ...map3dOptions} = props;

  useDeepCompareEffect(() => {
    if (!map3DElement) return;

    // copy all values from map3dOptions to the map3D element itself
    Object.assign(map3DElement, map3dOptions);
  }, [map3DElement, map3dOptions]);

  if (!customElementsReady) return null;

  return (
    <gmp-map-3d
      ref={map3dRef}
      center={center}
      range={range}
      heading={heading}
      tilt={tilt}
      roll={roll}
      mode="SATELLITE">
      <ReferenceMarker
        onClick={() => props.handleClick(REFERENCE_PLACE)}
        markerOptions={{
          position: REFERENCE_PLACE.location,
          drawsWhenOccluded: true,
          altitudeMode: google.maps.maps3d.AltitudeMode.RELATIVE_TO_MESH
        }}
      />
      {placeMarkers}
      <Popover
        place={props.selectedPlace}
        useCustomStyling={props.useCustomStyling}
      />
    </gmp-map-3d>
  );
};
Map3DComponent.displayName = 'Map3D';

export const Map3D = memo(Map3DComponent);
