import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
import { nav } from './nav'

export default defineConfig({
  title: 'Vite Remix Router',
  description: 'Remix-style file-system routing for React and Vite',

  lastUpdated: true,

  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/mammadataei/vite-plugin-remix-router',
      },
    ],

    editLink: {
      pattern:
        'https://github.com/mammadataei/vite-plugin-remix-router/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022 Mohammad Ataei',
    },
  },
})
