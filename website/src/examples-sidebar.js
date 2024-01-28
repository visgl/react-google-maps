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
        'change-map-styles',
        'map-control',
        'directions',
        'deckgl-overlay'
      ]
    }
  ]
};

module.exports = sidebars;
