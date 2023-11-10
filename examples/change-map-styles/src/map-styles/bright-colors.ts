// Map Style "No label Bright Colors" by Beniamino Nobile
// https://snazzymaps.com/style/127403/no-label-bright-colors

export default [
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [
      {saturation: '32'},
      {lightness: '-3'},
      {visibility: 'on'},
      {weight: '1.18'}
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'labels',
    stylers: [{visibility: 'off'}]
  },
  {
    featureType: 'landscape',
    elementType: 'labels',
    stylers: [{visibility: 'off'}]
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'all',
    stylers: [{saturation: '-70'}, {lightness: '14'}]
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{visibility: 'off'}]
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{visibility: 'off'}]
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{visibility: 'off'}]
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [{saturation: '100'}, {lightness: '-14'}]
  },
  {
    featureType: 'water',
    elementType: 'labels',
    stylers: [{visibility: 'off'}, {lightness: '12'}]
  }
] as google.maps.MapTypeStyle[];
