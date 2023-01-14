import type { DefaultTheme } from 'vitepress'

export function sidebar(): DefaultTheme.Sidebar {
  return [
    {
      text: 'Guides',
      items: [
        { text: 'Introduction', link: '/guides/introduction' },
        { text: 'Getting Started', link: '/guides/getting-started' },
        { text: 'Defining Routes', link: '/guides/defining-routes' },
        { text: 'Using Data APIs', link: '/guides/using-data-apis' },
      ],
    },
    {
      text: 'Configuration',
      items: [{ text: 'Config Reference', link: '/config/reference' }],
    },
  ]
}
