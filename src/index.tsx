import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { store } from './store'
import { Provider } from 'react-redux'
import { setupGlobalErrorHandlers } from './utils/errorHandlers'
import performanceMonitor from './utils/performanceMonitor'

document.title = 'Blog • Roc'

setupGlobalErrorHandlers()

const container = document.getElementById('root')

if (!container) {
  throw new Error('Missing #root container for React application bootstrap')
}

const root = createRoot(container)
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)

// 延迟初始化性能监控，避免阻塞首屏渲染
if ('requestIdleCallback' in window) {
  ;(
    window as unknown as {
      requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number
    }
  ).requestIdleCallback(() => performanceMonitor.init(), { timeout: 5000 })
} else {
  setTimeout(() => performanceMonitor.init(), 1000)
}
