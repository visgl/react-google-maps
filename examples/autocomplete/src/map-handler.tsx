import {useMap} from '@vis.gl/react-google-maps';
import React, {useEffect} from 'react';

interface Props {
  place: google.maps.places.PlaceResult | google.maps.places.Place | null;
}

const MapHandler = ({place}: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;
    //TODO: Remove this check after migrating the other components to use Places API (new)
    const viewport =
      'viewport' in place
        ? place.viewport
        : (place as google.maps.places.PlaceResult).geometry?.viewport;

    if (viewport) {
      map.fitBounds(viewport);
    }
  }, [map, place]);

  return null;
};

export default React.memo(MapHandler);
