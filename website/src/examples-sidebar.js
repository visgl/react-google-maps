const sidebars = {
  examplesSidebar: [
    {
      type: 'doc',
      label: 'Overview',
      id: 'index'
    },
    {
      type: 'category',
      label: 'Examples',
      collapsed: false,
      items: [
        'basic-map',
        'markers-and-infowindows',
        'marker-clustering',
        'geometry',
        'change-map-styles',
        'autocomplete',
        'map-control',
        'directions',
        'deckgl-overlay',
        'multiple-maps'
      ]
    }
  ]
};

module.exports = sidebars;
