# Defining Routes

Now that we installed the plugin and defined our first route, let's take a look
at how we can define different types of routes in our application. If you are
familiar with
[Remix routing conventions](https://remix.run/docs/en/v1/file-conventions/routes-files),
you can skip this page and go to the next one.

Since `vite-plugin-remix-router` is built on top of `react-router`, you need to
be familiar with the basic concepts of `react-router` to fully understand how to
use this plugin. You can find more information about `react-router` in their
[official documentation](https://reactrouter.com/en/main/start/concepts)

## Basic Routes

As we've seen in the
[Define you first route](/guides/getting-started.html#step-2-define-your-first-route),
to define a basic route, we simply create a file in the `routes` directory. The
file name will be used as the route path. Each route file should export a React
component that will be rendered when the route is matched.

Let's create a new route called `about`:

```bash
$ touch routes/about.tsx
```

Now let's define the route component:

```tsx
// routes/about.tsx

export default function About() {
  return <h1>About</h1>
}
```

Now if we visit `/about` in our browser, we should see the `About` component.

## Nested Routes

To define nested routes, we can create a directory in the `routes` directory
with the name of the route. Let's create a new route for `/users/profile`:

```tsx
// routes/users/profile.tsx

export default function Profile() {
  return <h1>Profile</h1>
}
```

Now if we navigate to `/users/profile` in our browser, and we will see the
`Profile` page.

## Dynamic Routes

For creating a dynamic route, we need to create a file in the `routes` directory
with a name that starts with a `$`. Let's say we need a route that will match
`/users/:id`, we can create a file called `$id.tsx` in the `routes/users`
directory:

```tsx
// routes/users/$id.tsx
import { useParams } from 'react-router-dom'

export default function User() {
  const { id } = useParams()

  return <h1>User {id}</h1>
}
```

We can see `User 1` on the page by visiting `/users/1` in the browser.

## Index Routes

To define an index route, we can create a file named `index`. Let's create an
index route for the `routes/users` directory:

```tsx
// routes/users/index.tsx

export default function Users() {
  return <h1>Users</h1>
}
```

Now if we visit `/users` in the browser, we should see the `Users` page.

## Layout Routes

Each sub-directory in the `routes` directory can have a custom layout. To define
a layout for a directory, we should create a file with the same name next to the
directory. For example, to define a layout for the `routes/users` directory, we
create a file called `users.tsx` next to the `users` directory:

```tsx
// routes/users.tsx
import { Outlet } from 'react-router-dom'

export default function UsersLayout() {
  return (
    <div>
      <h1>Users Layout</h1>
      <Outlet />
    </div>
  )
}
```

Keep in mind that the layout component should render the `Outlet` component to
be able to render children routes.

## Pathless Layout Routes

Sometimes we need to define a shared layout for some routes but we don't want to
change their path. For example, we may want to organize authentication routes in
a separate directory and use a custom layout for them without changing their
path. To define a pathless layout route, we should create a directory and a
layout file with a name that starts with a two `_`.

```tsx
// routes/__auth/login.tsx
export default function Login() {
  return <h1>Login</h1>
}

// routes/__auth/register.tsx
export default function Register() {
  return <h1>Register</h1>
}

// routes/__auth.tsx
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div>
      <h1>Auth Layout</h1>
      <Outlet />
    </div>
  )
}
```

Now if we can visit Login and Register pages at `/login` and `/register` with
the `AuthLayout` layout.

## Splat Routes

Finally to define a splat route (aka catch-all route), we can create a file
named `$.tsx`.

```tsx
// routes/$.tsx

export default function NotFound() {
  return <h1>Not Found</h1>
}
```

Now if we visit a route that doesn't exist, we should see the `NotFound` page.
