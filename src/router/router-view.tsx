import React from 'react'
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom'
import type { RouteConfig, RouteLeaf } from './router_config'

/** RouterView 能渲染的路由项最小公共接口，RouteConfig 和 RouteLeaf 均满足 */
export type RouteItemLike = Pick<RouteLeaf, 'path' | 'exact'> & {
  component?: RouteLeaf['component']
  redirect?: RouteConfig['redirect']
  children?: RouteItemLike[]
}

type BaseRouteComponent = React.ComponentType<RouteComponentProps>
type NestedRouteComponent = React.ComponentType<RouteComponentProps & { routers?: RouteItemLike[] }>

interface RouterViewProps {
  routes?: RouteItemLike[]
}

function getRouteKey(route: RouteItemLike) {
  if (route.redirect) {
    return `redirect:${route.path}->${route.redirect}`
  }

  return `route:${route.path}`
}

const RouteRenderer = (props: { route: RouteItemLike } & RouteComponentProps) => {
  const { route, ...routeProps } = props
  const Comp = route.component
  if (!Comp) return null
  if (route.children) {
    const C = Comp as NestedRouteComponent
    return <C routers={route.children} {...routeProps} />
  }
  const C = Comp as BaseRouteComponent
  return <C {...routeProps} />
}

function RouterView({ routes }: RouterViewProps) {
  return (
    <Switch>
      {routes?.map(route => {
        if (route.redirect) {
          return (
            <Redirect
              exact={route.exact}
              key={getRouteKey(route)}
              from={route.path}
              to={route.redirect}
            />
          )
        }

        return (
          <Route
            key={getRouteKey(route)}
            path={route.path}
            exact={route.exact}
            render={(props: RouteComponentProps) => <RouteRenderer route={route} {...props} />}
          />
        )
      })}
    </Switch>
  )
}

export default RouterView
