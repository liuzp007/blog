import errorLogger from './errorLogger'

export const setupGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return

  window.addEventListener('error', event => {
    errorLogger.log(event.error || new Error(event.message), {
      component: event.filename,
      message: `Global error at line ${event.lineno}:${event.colno}`
    })
  })

  window.addEventListener('unhandledrejection', event => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    errorLogger.log(error, {
      message: `Unhandled Promise Rejection: ${event.reason}`
    })
    event.preventDefault()
  })

  window.addEventListener('rejectionhandled', _event => {
    errorLogger.info('Promise rejection handled after being rejected previously')
  })

  window.addEventListener('beforeunload', _event => {
    const logs = errorLogger.getLogs()
    if (logs.length > 0) {
      // 处理会话结束时的日志
    }
  })
}
