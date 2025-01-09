export type StaticMapsLocation = google.maps.LatLngLiteral | string;

export type StaticMapsMarker = {
  location: StaticMapsLocation;
  color?: string;
  size?: 'tiny' | 'mid' | 'small';
  label?: string;
  icon?: string;
  anchor?: string;
  scale?: 1 | 2 | 4;
};

export type StaticMapsPath = {
  coordinates: Array<StaticMapsLocation> | string;
  weight?: number;
  color?: string;
  fillcolor?: string;
  geodesic?: boolean;
};

export type StaticMapsApiOptions = {
  apiKey: string;
  width: number;
  height: number;
  center?: StaticMapsLocation;
  zoom?: number;
  scale?: number;
  format?: 'png' | 'png8' | 'png32' | 'gif' | 'jpg' | 'jpg-baseline';
  mapType?: google.maps.MapTypeId;
  language?: string;
  region?: string;
  mapId?: string;
  markers?: Array<StaticMapsMarker>;
  paths?: Array<StaticMapsPath>;
  visible?: Array<StaticMapsLocation>;
  style?: google.maps.MapTypeStyle[];
};
