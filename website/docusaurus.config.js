/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
// @ts-check

// const webpack = require('webpack');
const {resolve} = require('path');
const webpack = require('webpack');
const {themes: prismThemes} = require('prism-react-renderer');
const {globSync} = require('glob');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Google Maps',
  tagline: 'React components and hooks for the Google Maps JavaScript API',
  url: 'https://visgl.github.io/',
  baseUrl: '/react-google-maps/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/favicon.ico',
  trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs',
          sidebarPath: resolve('./src/docs-sidebar.js'),
          editUrl:
            'https://github.com/visgl/react-google-maps/tree/main/website'
        },
        theme: {
          customCss: [
            resolve('./src/styles.css'),
            resolve('../examples/examples.css')
          ]
        }
      })
    ]
  ],

  plugins: [
    [
      './ocular-docusaurus-plugin',
      {
        debug: true,
        resolve: {
          modules: [
            resolve('node_modules'),
            resolve('../node_modules'),
            ...globSync('../examples/*/node_modules')
          ],
          alias: {
            '@vis.gl/react-google-maps': resolve('../src'),
            'website-examples': resolve('../examples'),
            react: resolve('node_modules/react'),
            'react-dom': resolve('node_modules/react-dom')
          }
        },
        plugins: [new webpack.EnvironmentPlugin(['GOOGLE_MAPS_API_KEY'])],
        module: {
          rules: [
            // https://github.com/Esri/calcite-components/issues/2865
            {
              test: /\.m?js/,
              resolve: {
                fullySpecified: false
              }
            }
          ]
        }
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'examples',
        path: './src/examples',
        routeBasePath: 'examples',
        sidebarPath: resolve('./src/examples-sidebar.js'),
        breadcrumbs: false,
        docItemComponent: resolve(
          './src/components/example/doc-item-component.jsx'
        )
      }
    ]
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        // https://github.com/easyops-cn/docusaurus-search-local#theme-options
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        docsDir: [],
        blogDir: []
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'react-google-maps',
        logo: {
          alt: 'vis.gl Logo',
          src: 'images/visgl-logo-dark.png',
          srcDark: 'images/visgl-logo-light.png'
        },
        items: [
          {
            to: '/examples',
            position: 'left',
            label: 'Examples'
          },
          {
            to: '/docs',
            position: 'left',
            label: 'Docs'
          },
          {
            href: 'https://github.com/visgl/react-google-maps',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Resources',
            items: [
              {
                label: 'API Reference',
                to: '/docs/api-reference/components/map'
              },
              {
                label: 'Starter templates',
                href: 'https://github.com/visgl/react-google-maps/blob/main/docs/get-started.md'
              }
            ]
          },
          {
            title: 'Other vis.gl Libraries',
            items: [
              {
                label: 'deck.gl',
                href: 'https://deck.gl'
              },
              {
                label: 'luma.gl',
                href: 'https://luma.gl'
              },
              {
                label: 'loaders.gl',
                href: 'https://loaders.gl'
              },
              {
                label: 'nebula.gl',
                href: 'https://nebula.gl'
              }
            ]
          },
          {
            title: 'More',
            items: [
              {
                label: 'Open Visualization',
                href: 'https://www.openvisualization.org/#'
              },
              {
                label: 'vis.gl blog on Medium',
                href: 'https://medium.com/vis-gl'
              },
              {
                label: 'GitHub',
                href: 'https://github.com/visgl/react-google-maps'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} OpenJS Foundation`
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula
      }
    })
};

module.exports = async function createConfigAsync() {
  return config;
};
