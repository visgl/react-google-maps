/* eslint-disable complexity */
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {createPortal} from 'react-dom';

import {GoogleMapsContext} from './map';

/**
 * Props for the Info Window Component
 */
export type InfoWindowProps = google.maps.InfoWindowOptions & {
  onCloseClick?: () => void;
  anchor?: google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null;
  shouldFocus?: boolean;
};

/**
 * Component to render a Google Maps Info Window
 */
export const InfoWindow = (props: PropsWithChildren<InfoWindowProps>) => {
  const {children, anchor, shouldFocus, onCloseClick, ...infoWindowOptions} =
    props;
  const map = useContext(GoogleMapsContext)?.map;

  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [contentContainer, setContentContainer] =
    useState<HTMLDivElement | null>(null);

  // create infowindow once map is available
  useEffect(() => {
    if (!map) return;

    const newInfowindow = new google.maps.InfoWindow(infoWindowOptions);

    // Add content to info window
    const el = document.createElement('div');
    newInfowindow.setContent(el);

    infoWindowRef.current = newInfowindow;
    setContentContainer(el);

    // Cleanup info window and event listeners on unmount
    return () => {
      google.maps.event.clearInstanceListeners(newInfowindow);

      newInfowindow.close();
      el.remove();

      setContentContainer(null);
    };

    // `infoWindowOptions` is missing from dependencies:
    //
    // we don't want to re-render a whole new infowindow
    // when the options change to prevent flickering.
    // Update of infoWindow options is handled in the useEffect below.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, children]);

  // Update infoWindowOptions
  useEffect(() => {
    infoWindowRef.current?.setOptions(infoWindowOptions);
  }, [infoWindowOptions]);

  // Handle the close click callback
  useEffect(() => {
    if (!infoWindowRef.current) return;

    let listener: google.maps.MapsEventListener | null = null;

    if (onCloseClick) {
      listener = google.maps.event.addListener(
        infoWindowRef.current,
        'closeclick',
        onCloseClick
      );
    }

    return () => {
      if (listener) listener.remove();
    };
  }, [onCloseClick]);

  // Open info window after content container is set
  useEffect(() => {
    // anchor === null means an anchor is defined but not ready yet.
    if (!contentContainer || !infoWindowRef.current || anchor === null) return;

    const openOptions: google.maps.InfoWindowOpenOptions = {map};

    if (anchor) {
      openOptions.anchor = anchor;
    }

    if (shouldFocus !== undefined) {
      openOptions.shouldFocus = shouldFocus;
    }

    infoWindowRef.current.open(openOptions);
  }, [contentContainer, infoWindowRef, anchor, map, shouldFocus]);

  return (
    <>{contentContainer !== null && createPortal(children, contentContainer)}</>
  );
};
