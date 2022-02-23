declare module 'virtual:routes' {
  export const routes: Array<import('./src/types').ExtendedRouteObject>
  export const traverse: typeof import('./src/traverse').traverse
}
