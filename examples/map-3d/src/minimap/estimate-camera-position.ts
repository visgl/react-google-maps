import {Map3DCameraProps} from '../map-3d';
import {destination, getCoords, point} from '@turf/turf';

export function estimateCameraPosition(
  camera3dProps: Map3DCameraProps
): google.maps.LatLngAltitudeLiteral {
  const {center, heading, tilt, range} = camera3dProps;

  const tiltRad = (tilt / 180) * Math.PI;
  const height = range * Math.cos(tiltRad);
  const distance = range * Math.sin(tiltRad);

  const [lng, lat] = getCoords(
    destination(point([center.lng, center.lat]), distance, heading + 180, {
      units: 'meters'
    })
  );

  return {
    lat: lat as number,
    lng: lng as number,
    altitude: center.altitude + height
  };
}
