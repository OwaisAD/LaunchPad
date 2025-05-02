import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Header />

      <Outlet />

      {/* render query dev tools only in dev environment */}
      {import.meta.env.DEV && (
        <>
          <TanStackRouterDevtools />
          <TanstackQueryLayout />
        </>
      )}
    </>
  ),
})
