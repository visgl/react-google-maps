const mapLinear = (x: number, a1: number, a2: number, b1: number, b2: number) =>
  b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);

const getMapMaxTilt = (zoom: number) => {
  if (zoom <= 10) {
    return 30;
  }
  if (zoom >= 15.5) {
    return 67.5;
  }

  // range [10...14]
  if (zoom <= 14) {
    return mapLinear(zoom, 10, 14, 30, 45);
  }

  // range [14...15.5]
  return mapLinear(zoom, 14, 15.5, 45, 67.5);
};

/**
 * Function to limit the tilt range of the Google map when updating the view state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const limitTiltRange = ({viewState}: any) => {
  const pitch = viewState.pitch;
  const gmZoom = viewState.zoom + 1;
  const maxTilt = getMapMaxTilt(gmZoom);

  return {...viewState, fovy: 25, pitch: Math.min(maxTilt, pitch)};
};
