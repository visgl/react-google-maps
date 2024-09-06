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
        'change-map-styles',
        'markers-and-infowindows',
        'map-control',
        'multiple-maps',
        'marker-clustering',
        'custom-marker-clustering',
        'geometry',
        'heatmap',
        'drawing',
        'autocomplete',
        'directions',
        'deckgl-overlay',
        'map-3d',
        'extended-component-library'
      ]
    }
  ]
};

module.exports = sidebars;
