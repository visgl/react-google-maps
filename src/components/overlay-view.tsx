/* eslint-disable complexity */
import React, {
  CSSProperties,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from "react";
import type {  Ref } from "react";

import { useMap } from "@vis.gl/react-google-maps";
import ReactDOM from "react-dom";

export type TPaneNamesKey =
  | "FLOAT_PANE"
  | "MAP_PANE"
  | "MARKER_LAYER"
  | "OVERLAY_LAYER"
  | "OVERLAY_MOUSE_TARGET";
export type PaneNames = keyof google.maps.MapPanes;

export const PANE_NAMES: Record<TPaneNamesKey, PaneNames> = {
  FLOAT_PANE: `floatPane`,
  MAP_PANE: `mapPane`,
  MARKER_LAYER: `markerLayer`,
  OVERLAY_LAYER: `overlayLayer`,
  OVERLAY_MOUSE_TARGET: `overlayMouseTarget`
};

export type PositionDrawProps = {
  left?: string | number | undefined;
  top?: string | number | undefined;
  width?: string | number | undefined;
  height?: string | number | undefined;
};

export interface OverlayViewContextValue {
  overlayView: google.maps.OverlayView;
}

export const OverlayViewContext =
  React.createContext<OverlayViewContextValue | null>(null);

export interface OverlayViewProps {
  children?: ReactNode | undefined;
  // required
  mapPaneName: PaneNames;
  position: google.maps.LatLng;
  getPixelPositionOffset?:
    | ((offsetWidth: number, offsetHeight: number) => { x: number; y: number })
    | undefined;
  zIndex?: number | undefined;
}

const convertToLatLngString = (
  latLngLike?: google.maps.LatLng | google.maps.LatLngLiteral | null | undefined
) => {
  if (!latLngLike) {
    return "";
  }

  const latLng =
    latLngLike instanceof google.maps.LatLng
      ? latLngLike
      : new google.maps.LatLng(latLngLike.lat, latLngLike.lng);

  return latLng + "";
};
const getOffsetOverride = (
  containerElement: HTMLElement,
  getPixelPositionOffset?:
    | ((offsetWidth: number, offsetHeight: number) => { x: number; y: number })
    | undefined
): { x: number; y: number } => {
  return typeof getPixelPositionOffset === "function"
    ? getPixelPositionOffset(
      containerElement.offsetWidth,
      containerElement.offsetHeight
    )
    : {
      x: 0,
      y: 0
    };
};

const getLayoutStylesByPosition = (
  mapCanvasProjection: google.maps.MapCanvasProjection,
  offset: { x: number; y: number },
  position: google.maps.LatLng
): { left: string; top: string } => {
  const point =
    mapCanvasProjection && mapCanvasProjection.fromLatLngToDivPixel(position);

  if (point) {
    const { x, y } = point;

    return {
      left: `${x + offset.x}px`,
      top: `${y + offset.y}px`
    };
  }

  return {
    left: "-9999px",
    top: "-9999px"
  };
};

const getLayoutStyles = (
  mapCanvasProjection: google.maps.MapCanvasProjection,
  offset: { x: number; y: number },
  position: google.maps.LatLng
): PositionDrawProps => {
  return getLayoutStylesByPosition(mapCanvasProjection, offset, position);
};

const arePositionsEqual = (
  currentPosition: PositionDrawProps,
  previousPosition: PositionDrawProps
): boolean => {
  return (
    currentPosition.left === previousPosition.left &&
    currentPosition.top === previousPosition.top &&
    currentPosition.width === previousPosition.height &&
    currentPosition.height === previousPosition.height
  );
};


export type OverlayViewRef = google.maps.OverlayView | null;
function useOverlayView(props: OverlayViewProps) {
  const [overlayView, setOverlayView] =
    useState<google.maps.OverlayView | null>(null);
  const [paneEl, setPaneEl] = useState<HTMLElement | null>(null);
  const [containerStyle, setContainerStyle] = useState<CSSProperties>({
    position: "absolute"
  });

  const map = useMap();

  const updatePane = (overlayView: google.maps.OverlayView) => {
    const mapPaneName = props.mapPaneName ?? PANE_NAMES.FLOAT_PANE;
    const mapPanes = overlayView.getPanes();
    if (mapPanes) {
      setPaneEl(mapPanes[mapPaneName] as HTMLElement);
    } else {
      setPaneEl(null);
    }
  };

  const onPositionElement = (overlayView: google.maps.OverlayView) => {
    const mapCanvasProjection = overlayView.getProjection();

    const offset = {
      x: 0,
      y: 0,
      ...(paneEl
        ? getOffsetOverride(paneEl, props.getPixelPositionOffset)
        : {})
    };

    const layoutStyles = getLayoutStyles(
      mapCanvasProjection,
      offset,
      props.position
    );

    const { left, top, width, height } = containerStyle;

    if (!arePositionsEqual(layoutStyles, { left, top, width, height })) {
      setContainerStyle({
        top: layoutStyles.top || 0,
        left: layoutStyles.left || 0,
        width: layoutStyles.width || 0,
        height: layoutStyles.height || 0,
        position: "absolute"
      });
    }
  };

  const onAdd = (overlayView: google.maps.OverlayView) => {
    updatePane(overlayView);
  };

  const onRemove = () => {
    setPaneEl(null);
  };

  const draw = (overlayView: google.maps.OverlayView) => {
    onPositionElement(overlayView);
  };

  useEffect(() => {
    if (!map) return;

    const newOverlayView = new google.maps.OverlayView();
    newOverlayView.setMap(map);
    newOverlayView.onAdd = ()=> {onAdd(newOverlayView) } ;
    newOverlayView.draw = () => {draw(newOverlayView)};
    newOverlayView.onRemove = () => {onRemove() };
    setOverlayView(newOverlayView);


    return () => {
      setOverlayView(null);
    };
  }, [map]);



  useEffect(() => {

    if(!overlayView) return;

    const prevPositionString = convertToLatLngString(props.position);
    const positionString = convertToLatLngString(props.position);

    if (prevPositionString !== positionString) {
      overlayView.draw();
    }

    if (props.mapPaneName !== props.mapPaneName) {
      updatePane(overlayView);
    }
  }, [overlayView]);


  return [overlayView, paneEl, containerStyle] as const;
}

export const OverlayView = forwardRef(
  (props: OverlayViewProps, ref: Ref<OverlayViewRef>) => {
    const { children } = props;
    const [overlayView, paneEl, containerStyle] =
      useOverlayView(props);

    const overlayViewContextValue: OverlayViewContextValue | null = useMemo(
      () => (overlayView ? { overlayView } : null),
      [overlayView]
    );

    useImperativeHandle(ref, () => overlayView, [overlayView]);

    if (!paneEl) return null;

    return (
      <OverlayViewContext.Provider value={overlayViewContextValue}>
        {ReactDOM.createPortal(
          <div style={containerStyle}>{React.Children.only(children)}</div>,
          paneEl
        )}
      </OverlayViewContext.Provider>
    );
  }
);

export function useOverlayViewRef() {
  const [overlayView, setOverlayView] =
    useState<google.maps.OverlayView | null>(null);

  const refCallback = useCallback((o: OverlayViewRef | null) => {
    setOverlayView(o);
  }, []);

  return [refCallback, overlayView] as const;
}
