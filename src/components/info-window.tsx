/* eslint-disable complexity */
import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react';
import {createPortal} from 'react-dom';

import {useMap} from '../hooks/use-map';
import {useMapsEventListener} from '../hooks/use-maps-event-listener';
import {setValueForStyles} from '../libraries/set-value-for-styles';
import {useMapsLibrary} from '../hooks/use-maps-library';
import {useDeepCompareEffect} from '../libraries/use-deep-compare-effect';

export type InfoWindowProps = Omit<
  google.maps.InfoWindowOptions,
  'content' | 'pixelOffset'
> & {
  style?: CSSProperties;
  className?: string;
  anchor?: google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null;
  pixelOffset?: [number, number];
  shouldFocus?: boolean;
  onClose?: () => void;
  onCloseClick?: () => void;
};

/**
 * Component to render an Info Window with the Maps JavaScript API
 */
export const InfoWindow = (props: PropsWithChildren<InfoWindowProps>) => {
  const {
    // content options
    children,
    style,
    className,
    pixelOffset,

    // open options
    anchor,
    shouldFocus,
    // events
    onClose,
    onCloseClick,

    ...infoWindowOptions
  } = props;

  // ## create infowindow instance once the mapsLibrary is available.
  const mapsLibrary = useMapsLibrary('maps');
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );
  const [contentContainer, setContentContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(
    () => {
      if (!mapsLibrary) return;

      if (pixelOffset) {
        (infoWindowOptions as google.maps.InfoWindowOptions).pixelOffset =
          new google.maps.Size(pixelOffset[0], pixelOffset[1]);
      }

      // intentionally shadowing the state variables here
      const infoWindow = new google.maps.InfoWindow(infoWindowOptions);
      const contentContainer = document.createElement('div');
      infoWindow.setContent(contentContainer);

      setInfoWindow(infoWindow);
      setContentContainer(contentContainer);

      // unmount: remove infoWindow and contentElement
      return () => {
        infoWindow.setContent(null);
        contentContainer.remove();

        setInfoWindow(null);
        setContentContainer(null);
      };
    },
    // `infoWindowOptions` and `pixelOffset` are missing from dependencies:
    //
    // We don't want to re-create the infowindow instance
    // when the options change.
    // Updating the options is handled in the useEffect below.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapsLibrary]
  );

  // ## update className and styles for `contentContainer`
  // stores previously applied style properties, so they can be removed when unset
  const prevStyleRef = useRef<CSSProperties | null>(null);
  useEffect(() => {
    if (!contentContainer) return;

    setValueForStyles(contentContainer, style || null, prevStyleRef.current);
    prevStyleRef.current = style || null;

    if (className !== contentContainer.className)
      contentContainer.className = className || '';
  }, [contentContainer, className, style]);

  // ## update options
  useDeepCompareEffect(
    () => {
      if (!infoWindow) return;

      if (pixelOffset) {
        (infoWindowOptions as google.maps.InfoWindowOptions).pixelOffset =
          new google.maps.Size(pixelOffset[0], pixelOffset[1]);
      }

      infoWindow.setOptions(infoWindowOptions);
    },

    // dependency `infoWindow` isn't needed since options are also passed
    // to the constructor when a new infoWindow is created.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [infoWindowOptions]
  );

  // ## bind event handlers
  useMapsEventListener(infoWindow, 'close', onClose);
  useMapsEventListener(infoWindow, 'closeclick', onCloseClick);

  // ## open info window when content and map are available
  const map = useMap();
  useEffect(() => {
    // `anchor === null` means an anchor is defined but not ready yet.
    if (!contentContainer || !infoWindow || anchor === null) return;

    const isOpenedWithAnchor = !!anchor;
    const openOptions: google.maps.InfoWindowOpenOptions = {map};
    if (anchor) {
      openOptions.anchor = anchor;
    }

    if (shouldFocus !== undefined) {
      openOptions.shouldFocus = shouldFocus;
    }

    infoWindow.open(openOptions);

    return () => {
      // Note: when the infowindow has an anchor, it will automatically show up again when the
      // anchor was removed from the map before infoWindow.close() is called but the it gets
      // added back to the map after that.
      // More information here: https://issuetracker.google.com/issues/343750849
      if (isOpenedWithAnchor) infoWindow.set('anchor', null);

      infoWindow.close();
    };
  }, [infoWindow, contentContainer, anchor, map, shouldFocus]);

  return (
    <>{contentContainer !== null && createPortal(children, contentContainer)}</>
  );
};
