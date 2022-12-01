import type { DefaultTheme } from 'vitepress'

export function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Guides', link: '/guides/introduction' },
    { text: 'Changelog', link: '#' },
  ]
}
