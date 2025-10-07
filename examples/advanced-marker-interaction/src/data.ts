export type MarkerType = 'default' | 'pin' | 'html';

type MarkerData = Array<{
  id: string;
  position: google.maps.LatLngLiteral;
  type: MarkerType;
  zIndex: number;
  infowindowContent?: string;
}>;

export const textSnippets = {
  default: 'This is a default AdvancedMarkerElement without custom content',
  pin: 'This is a AdvancedMarkerElement with custom pin-style marker',
  html: 'This is a AdvancedMarkerElement with custom HTML content'
} as const;

export function getData() {
  const data: MarkerData = [];

  // create 50 random markers
  for (let index = 0; index < 50; index++) {
    const type =
      Math.random() < 0.1 ? 'default' : Math.random() < 0.5 ? 'pin' : 'html';

    data.push({
      id: String(index),
      position: {lat: rnd(53.52, 53.63), lng: rnd(9.88, 10.12)},
      zIndex: index,
      type
    });
  }

  return data;
}

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
