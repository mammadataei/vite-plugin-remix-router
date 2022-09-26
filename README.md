<br/>

<h1 align='center'>vite-plugin-remix-router</h1>

<p align='center'>Remix style file-system routing for React and Vite</p>

<br/>

## Introduction

The `vite-plugin-remix-router` is a Vite plugin that helps you add
[ Remix ](https://remix.run/) style file-system routing to your
[ Vite ](https://vitejs.dev/) React project.

## Getting Started

First, install the plugin in your Vite project:

```bash
npm i --D vite-plugin-remix-router

yarn add --dev vite-plugin-remix-router

pnpm add --D vite-plugin-remix-router
```

Then, import it into your `vite.config.ts`. You can pass it configuration
options as well.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import RemixRouter from 'vite-plugin-remix-router'

export default defineConfig({
  plugins: [
    react(),
    RemixRouter({
      routesDirectory: 'src/routes',
      extensions: ['tsx', 'jsx'],
    }),
  ],
})
```

Now you can use `virtual:routes` to import generated routes object:

```typescript
import { useRoutes } from 'react-router-dom'
import { routes } from 'virtual:routes'

export function Routes() {
  return useRoutes(routes)
}
```

### Typescript support

For `virtual:routes` type definitions, simply add the following to your
`tsconfig.json`:

```json5
{
  compilerOptions: {
    types: ['vite/client', 'vite-plugin-remix-router/client'],
  },
}
```

## Defining Routes

To define a new route, simply create a new file in the routes directory. The
default export must be a react component that will be used as a route component.
As the name implies, the plugin supports
[ Remix routing convention ](https://remix.run/docs/en/v1/api/conventions#route-file-conventions)
for naming route files. You can learn more in
[ Remix routing documentation ](https://remix.run/docs/en/v1/guides/routing).

```
app
├── root.jsx
└── routes
    ├── sales                         👈 Layout route
    │   │   ├── invoices
    │   │   │   └── $invoiceId.jsx    👈 Dynamic route
    │   │   └── invoices.jsx
    │   └── sales.jsx
    ├── __auth                        👈 Pathless layout route
    │   ├── login.jsx
    │   ├── logout.jsx
    │   └── signup.jsx
    ├── __auth.jsx
    └── $.jsx                         👈 Splat route
```

> Please note that
> [ Remix route module APIs ](https://remix.run/docs/en/v1/api/conventions#route-module-api)
> like `action`, `loader`, etc. are not supported yet and will be added in
> future releases.

## Acknowledgement

Thanks to [ Remix ](https://remix.run/) for routing conventions and
[ vite-plugin-pages ](https://github.com/hannoeru/vite-plugin-pages) and
[ vite-plugin-next-react-router ](https://github.com/zoubingwu/vite-plugin-next-react-router)
for inspiration.

## License

Distributed under the [MIT license](/LICENSE.md).
