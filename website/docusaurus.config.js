// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Native Amazon Publisher Services',
  tagline: 'React Native wrapper around the native Amazon Publisher Services SDKs',
  url: 'https://adversportteam.github.io',
  baseUrl: '/react-native-aps/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'AdversportTeam', // Usually your GitHub org/user name.
  projectName: 'react-native-aps', // Usually your repo name.
  trailingSlash: false,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../src/index.ts'],
        tsconfig: '../tsconfig.json',
        readme: 'none'
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'React Native Amazon Publisher Services',
        logo: {
          alt: 'APS Logo',
          src: 'img/logo_amazon.svg',
        },
        items: [
          {
            to: 'docs/guides',
            position: 'left',
            label: 'Docs',
            activeBaseRegex: 'docs/(?!api)',
          },
          {
            to: "docs/api",
            position: 'left',
            label: "API",
            activeBaseRegex: 'docs/api',
          },
          {
            href: 'https://github.com/AdversportTeam/react-native-aps',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/guides',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/AdversportTeam/react-native-aps',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Adversport, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
