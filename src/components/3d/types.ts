export type Maps3DClickEvent = google.maps.maps3d.LocationClickEvent;

export type Maps3DEventProps = {
  /** Click handler. When provided, the interactive element variant is used. */
  onClick?: (e: Maps3DClickEvent) => void;
};
