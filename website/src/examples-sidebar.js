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
        'custom-marker-clustering',
        'geometry',
        'heatmap',
        'drawing',
        'change-map-styles',
        'autocomplete',
        'map-control',
        'directions',
        'deckgl-overlay',
        'multiple-maps',
        'extended-component-library'
      ]
    }
  ]
};

module.exports = sidebars;
