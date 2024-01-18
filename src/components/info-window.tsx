/* eslint-disable complexity */
import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';

import {GoogleMapsContext} from './map';

/**
 * Props for the Info Window Component
 */
export type InfoWindowProps = google.maps.InfoWindowOptions & {
  onCloseClick?: () => void;
  anchor?: google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null;
};

/**
 * Component to render a Google Maps Info Window
 */
export const InfoWindow = (props: PropsWithChildren<InfoWindowProps>) => {
  const {children, anchor, onCloseClick, ...infoWindowOptions} = props;
  const map = useContext(GoogleMapsContext)?.map;

  const [contentContainer, setContentContainer] =
    useState<HTMLDivElement | null>(null);

  // create infowindow once map is available
  useEffect(() => {
    if (!map) return;

    const infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    // Add content to info window
    const el = document.createElement('div');
    infoWindow.setContent(el);
    infoWindow.open({map, anchor});

    if (onCloseClick) {
      google.maps.event.addListener(infoWindow, 'closeclick', () => {
        onCloseClick();
      });
    }

    setContentContainer(el);

    // Cleanup info window and event listeners on unmount
    return () => {
      google.maps.event.clearInstanceListeners(infoWindow);

      infoWindow.close();
      el.remove();

      setContentContainer(null);
    };
  }, [map, children, anchor]);

  return (
    <>{contentContainer !== null && createPortal(children, contentContainer)}</>
  );
};
