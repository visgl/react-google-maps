/* eslint-disable complexity */
import React, {
  ComponentType,
  CSSProperties,
  PropsWithChildren,
  ReactNode,
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
  'headerContent' | 'content' | 'pixelOffset'
> & {
  style?: CSSProperties;
  className?: string;
  anchor?: google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null;
  pixelOffset?: [number, number];
  shouldFocus?: boolean;
  onClose?: () => void;
  onCloseClick?: () => void;

  headerContent?: ReactNode;
};

/**
 * Component to render an Info Window with the Maps JavaScript API
 */
export const InfoWindow = (props: PropsWithChildren<InfoWindowProps>) => {
  const {
    // content options
    children,
    headerContent,

    style,
    className,
    pixelOffset,

    // open options
    anchor,
    shouldFocus,

    // events
    onClose,
    onCloseClick,

    // other options
    ...infoWindowOptions
  } = props;

  // ## create infowindow instance once the mapsLibrary is available.
  const mapsLibrary = useMapsLibrary('maps');
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );

  const contentContainerRef = useRef<HTMLElement | null>(null);
  const headerContainerRef = useRef<HTMLElement | null>(null);

  useEffect(
    () => {
      if (!mapsLibrary) return;

      contentContainerRef.current = document.createElement('div');
      headerContainerRef.current = document.createElement('div');

      const opts: google.maps.InfoWindowOptions = infoWindowOptions;
      if (pixelOffset) {
        opts.pixelOffset = new google.maps.Size(pixelOffset[0], pixelOffset[1]);
      }

      if (headerContent) {
        // if headerContent is specified as string we can directly forward it,
        // otherwise we'll pass the element the portal will render into
        opts.headerContent =
          typeof headerContent === 'string'
            ? headerContent
            : headerContainerRef.current;
      }

      // intentionally shadowing the state variables here
      const infoWindow = new google.maps.InfoWindow(infoWindowOptions);
      infoWindow.setContent(contentContainerRef.current);

      setInfoWindow(infoWindow);

      // unmount: remove infoWindow and content elements (note: close is called in a different effect-cleanup)
      return () => {
        infoWindow.setContent(null);

        contentContainerRef.current?.remove();
        headerContainerRef.current?.remove();

        contentContainerRef.current = null;
        headerContainerRef.current = null;

        setInfoWindow(null);
      };
    },
    // `infoWindowOptions` and other props are missing from dependencies:
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
    if (!infoWindow || !contentContainerRef.current) return;

    setValueForStyles(
      contentContainerRef.current,
      style || null,
      prevStyleRef.current
    );

    prevStyleRef.current = style || null;

    if (className !== contentContainerRef.current.className)
      contentContainerRef.current.className = className || '';
  }, [infoWindow, className, style]);

  // ## update options
  useDeepCompareEffect(
    () => {
      if (!infoWindow) return;

      const opts: google.maps.InfoWindowOptions = infoWindowOptions;
      if (!pixelOffset) {
        opts.pixelOffset = null;
      } else {
        opts.pixelOffset = new google.maps.Size(pixelOffset[0], pixelOffset[1]);
      }

      if (!headerContent) {
        opts.headerContent = null;
      } else {
        opts.headerContent =
          typeof headerContent === 'string'
            ? headerContent
            : headerContainerRef.current;
      }

      infoWindow.setOptions(infoWindowOptions);
    },

    // dependency `infoWindow` isn't needed since options are also passed
    // to the constructor when a new infoWindow is created.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [infoWindowOptions, pixelOffset, headerContent]
  );

  // ## bind event handlers
  useMapsEventListener(infoWindow, 'close', onClose);
  useMapsEventListener(infoWindow, 'closeclick', onCloseClick);

  // ## open info window when content and map are available
  const map = useMap();
  useEffect(() => {
    // `anchor === null` means an anchor is defined but not ready yet.
    if (!map || !infoWindow || anchor === null) return;

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
  }, [infoWindow, anchor, map, shouldFocus]);

  return (
    <>
      {contentContainerRef.current &&
        createPortal(children, contentContainerRef.current)}

      {headerContainerRef.current !== null &&
        createPortal(headerContent, headerContainerRef.current)}
    </>
  );
};
