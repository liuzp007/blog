import { HashRouter } from 'react-router-dom'
import RouterView from './router/router-view'
import { message } from 'antd'
import routers from './router/router_config'
import resetAntd from './config/antd_global'
import { ErrorBoundary } from './components/error-boundary'
import GlobalMouseParticles from '@/components/ui/global-mouse-particles'
import ScrollToTop from './components/scroll-top'
import ThemeBridge from '@/theme/theme-bridge'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    message.config({
      duration: 3, // 持续时间
      // top: `15vh`, // 到页面顶部距离
      maxCount: 3 // 最大显示数, 超过限制时，最早的消息会被自动关闭
    })
  }, [])

  return (
    <ErrorBoundary>
      <ThemeBridge />
      <GlobalMouseParticles />
      <HashRouter>
        <ScrollToTop>
          <RouterView routes={routers} />
        </ScrollToTop>
      </HashRouter>
    </ErrorBoundary>
  )
}

const AppWithReset = resetAntd(App)

export default AppWithReset
