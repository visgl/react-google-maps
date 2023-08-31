import React, {useState} from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

export const MarkerWithInfowindow = () => {
  const [infowindowOpen, setInfowindowOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={{lat: 0, lng: -20}}
        title={'AdvancedMarker that opens an Infowindow when clicked.'}
      />

      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={160}
          onCloseClick={() => setInfowindowOpen(false)}>
          This is some content for the InfoWindow!
        </InfoWindow>
      )}
    </>
  );
};
