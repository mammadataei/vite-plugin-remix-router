import type { DefaultTheme } from 'vitepress'

export function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Guides', link: '/introduction' },
    { text: 'Changelog', link: '#' },
  ]
}
