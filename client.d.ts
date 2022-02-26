declare module 'virtual:routes' {
  export const routes: Array<import('./dist/index').ExtendedRouteObject>
  export const traverse: typeof import('./dist/index')['traverse']
}
