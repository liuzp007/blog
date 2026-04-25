import LoadableComponent from '../utils/LoadableComponent'
import NotFound from '../components/not-found'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import data, { getMainRouteEntries, type MainRouteEntry } from '../data'
import { SITE_PAGE_ROUTES } from '../config/siteNavigation'

export type AsyncPageModule = { readonly default: React.ComponentType<unknown> }
export type AsyncImportFn = () => Promise<AsyncPageModule>

const modules = import.meta.glob('../pages/**/index.{js,jsx,tsx}') as Record<string, AsyncImportFn>

function toPageId(modulePath: string) {
  return modulePath.replace(/^\.\.\/pages\//, '').replace(/\/index\.(js|jsx|tsx)$/, '')
}

const pageRegistry: Record<string, React.ComponentType<unknown>> = {}

for (const modulePath in modules) {
  const pageId = toPageId(modulePath)
  pageRegistry[pageId] = LoadableComponent(() => modules[modulePath]())
}

const MainLayoutComponent = LoadableComponent(() => import('../components/main-layout'))
const NotFoundComponent = NotFound as React.ComponentType<unknown>

function resolvePageComponent(pageId: string, routePath: string) {
  const component = pageRegistry[pageId]

  if (!component) {
    throw new Error(
      `[router_config] missing page component for "${pageId}" used by route "${routePath}"`
    )
  }

  return component
}

export type SwitchFlag = 'switch'

export interface RouteLeaf {
  name: string
  path: string
  component: React.ComponentType<unknown>
  switch?: SwitchFlag
  exact?: boolean
}

export interface RouteConfig {
  name: string | number
  path: string
  component?: React.ComponentType<unknown>
  exact?: boolean
  redirect?: string
  children?: RouteLeaf[]
}

function LegacyBlogRedirect(props: RouteComponentProps) {
  return React.createElement(Redirect, {
    to: { pathname: '/blog', search: props.location.search }
  })
}

function LegacyBlogDetailRedirect(props: RouteComponentProps) {
  return React.createElement(Redirect, {
    to: { pathname: '/blog-detail', search: props.location.search }
  })
}

function buildMainChildRoutes(entries: MainRouteEntry[]): RouteLeaf[] {
  return entries.map(entry => {
    const fullPath = `/main${entry.path}`

    return {
      name: entry.name,
      path: fullPath,
      component: resolvePageComponent(entry.pageId, fullPath),
      exact: entry.exact ?? true,
      switch: 'switch'
    }
  })
}

const mainChildRoutes = buildMainChildRoutes(getMainRouteEntries(data))

const topLevelPageRoutes: RouteConfig[] = SITE_PAGE_ROUTES.filter(item => item.pageId).map(
  item => ({
    name: item.label,
    path: item.path,
    exact: item.exact,
    component: resolvePageComponent(item.pageId!, item.path)
  })
)

const router_config: RouteConfig[] = [
  {
    name: 'home',
    path: '/',
    component: resolvePageComponent('home', '/'),
    exact: true
  },
  {
    name: 'home-alias',
    path: '/home',
    component: resolvePageComponent('home', '/home'),
    exact: true
  },
  {
    name: 'legacy-blog-detail',
    path: '/main/blog-detail',
    exact: true,
    component: LegacyBlogDetailRedirect
  },
  {
    name: 'legacy-blog',
    path: '/main/blog',
    exact: true,
    component: LegacyBlogRedirect
  },
  {
    name: 'main',
    path: '/main',
    component: MainLayoutComponent,
    children: [
      {
        name: 'main-default',
        path: '/main',
        exact: true,
        component: resolvePageComponent('main-home', '/main')
      },
      ...mainChildRoutes
    ]
  },
  ...topLevelPageRoutes,
  {
    name: 'main-catchall',
    path: '/main/*',
    redirect: '/404'
  },
  {
    name: 404,
    path: '/404',
    component: NotFoundComponent,
    exact: true
  },
  {
    name: '404',
    path: '/*',
    redirect: '/404'
  }
]

export default router_config
