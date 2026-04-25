import React, { Suspense } from 'react'

const Loading = () => {
  return (
    <div
      style={{
        background: 'none',
        height: 'calc(100vh - 173px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <h1>嘘，好戏即将开场...</h1>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LazyFactory<P = any> = () => Promise<{ default: React.ComponentType<P> }>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LoadableComponent = <P = any,>(component: LazyFactory<P>, haveLoading = true) => {
  const LazyComponent = React.lazy(component)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const WrappedComponent = (props: any) => (
    <Suspense fallback={haveLoading ? <Loading /> : null}>
      <LazyComponent {...props} />
    </Suspense>
  )

  WrappedComponent.displayName = 'LoadableComponent'
  return WrappedComponent
}

export default LoadableComponent
