const sidebars = {
  examplesSidebar: [
    {
      type: 'doc',
      label: 'Overview',
      id: 'index',
    },
    {
      type: 'category',
      label: 'Examples',
      collapsed: false,
      items: [
        'basic-map',
        'markers-and-infowindows',
        // External link
        {
          type: 'link',
          label: 'Marker Clustering',
          href: 'https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/marker-clustering',
        },
        'change-map-styles',
        'map-control',
        'directions',
      ],
    },
  ],
};

module.exports = sidebars;
