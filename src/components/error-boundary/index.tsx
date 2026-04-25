import React, { Component } from 'react'
import { Button, Result, Skeleton as AntSkeleton, message } from 'antd'
import errorLogger from '@/utils/errorLogger'
import { isNetworkError, getErrorMessage } from '@/utils/apiErrorHandler'

// 数据接口
interface ContentItem {
  id: string
  title: string
  description: string
  cover?: string
  tags?: string[]
  author?: {
    name: string
    avatar?: string
  }
  stats?: {
    views?: number
    likes?: number
    stars?: number
    comments?: number
  }
  meta?: {
    date?: string
    readTime?: number
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  }
  link?: string
  featured?: boolean
  trending?: boolean
}

// 加载骨架屏组件
interface LoadingSkeletonProps {
  showAvatar?: boolean
  showHeader?: boolean
  showContent?: boolean
  showFooter?: boolean
  rows?: number
  item?: ContentItem
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  showAvatar = true,
  showHeader = true,
  showContent = true,
  showFooter = true,
  rows = 3
}) => {
  return (
    <div className="error-boundary__loading p-5">
      {showAvatar && showHeader ? (
        <div className="error-boundary__loading-header mb-4 flex items-center gap-3">
          <AntSkeleton.Avatar className="loading-avatar h-10 w-10 rounded-full" active />
          <div className="error-boundary__loading-text flex-1">
            <AntSkeleton.Input className="loading-title mb-2 h-6 rounded" active />
            <AntSkeleton.Button className="loading-description h-4 rounded" active />
          </div>
        </div>
      ) : null}

      {showContent && (
        <div className="error-boundary__loading-content">
          {Array.from({ length: rows }).map((_, index) => (
            <AntSkeleton
              key={index}
              className="loading-paragraph mb-3 h-4 rounded last:mb-0"
              active
            />
          ))}
          <AntSkeleton.Image className="loading-image mb-4 h-[200px] rounded-lg" active />
          <div className="error-boundary__loading-meta flex h-5 gap-3">
            <AntSkeleton.Button className="loading-tag h-6 w-[60px] rounded-xl" active />
            <AntSkeleton.Button className="loading-date h-4 w-[100px] rounded" active />
          </div>
        </div>
      )}

      {showFooter && (
        <div className="error-boundary__loading-footer flex flex-col gap-3 border-t border-t-[var(--white-alpha-10)] pt-4 md:flex-row md:items-center md:justify-between md:gap-0">
          <AntSkeleton.Button className="loading-action h-8 w-20 rounded-md" active />
          <div className="error-boundary__loading-stats flex gap-4">
            <AntSkeleton.Button className="loading-stat h-4 w-[60px] rounded" active />
            <AntSkeleton.Button className="loading-stat h-4 w-[60px] rounded" active />
            <AntSkeleton.Button className="loading-stat h-4 w-[60px] rounded" active />
          </div>
        </div>
      )}
    </div>
  )
}

// 错误显示组件
interface ErrorDisplayProps {
  error: Error
  resetError: () => void
  errorInfo?: {
    message?: string
    stack?: string
    component?: string
  }
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  resetError,
  errorInfo = {
    message: error.message || '页面发生错误',
    stack: error.stack || '',
    component: error.stack?.split('\n')[0]?.trim() || 'Unknown Component'
  }
}) => {
  ErrorDisplay.displayName = 'ErrorDisplay'

  const handleErrorReport = async () => {
    try {
      errorLogger.log(error, {
        component: errorInfo.component,
        message: errorInfo.message,
        stack: errorInfo.stack
      })

      message.success('错误报告已生成，您可以复制到剪贴板')

      const reportText = `
错误时间: ${new Date().toISOString()}
错误信息: ${errorInfo.message}
组件: ${errorInfo.component}
堆栈跟踪:
${errorInfo.stack}
用户代理: ${typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}
页面 URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}
`.trim()

      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(reportText)
      }
    } catch (e) {
      message.error('生成错误报告失败')
    }
  }

  const getErrorIcon = () => {
    if (isNetworkError(error)) {
      return '🌐'
    }
    return '🚠️'
  }

  const getErrorHint = () => {
    if (isNetworkError(error)) {
      return '💡 提示：请检查网络连接或稍后再试'
    }
    return '💡 提示：请刷新页面或稍后再试'
  }

  // 尝试解析错误信息
  const parseErrorInfo = (): { message?: string; stack?: string; component?: string } | string => {
    try {
      if (error.stack) {
        const stackLines = error.stack.split('\n')
        const componentMatch = stackLines.find(line => line.includes('at '))
        if (componentMatch) {
          return {
            message: errorInfo.message,
            stack: errorInfo.stack,
            component: componentMatch.trim().split('at ')[1]
          }
        }
      }
      return errorInfo
    } catch {
      return errorInfo
    }
  }

  const parsedInfo = parseErrorInfo()

  const errorMsg = getErrorMessage(error)
  const component =
    typeof parsedInfo === 'string'
      ? 'Unknown Component'
      : parsedInfo.component || 'Unknown Component'
  const stackTrace =
    typeof parsedInfo === 'string' ? error.stack || '' : parsedInfo.stack || error.stack || ''

  return (
    <div className="error-boundary flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-[var(--danger-alpha-soft)] bg-[var(--black-alpha-05)] px-6 py-10 text-center [backdrop-filter:blur(20px)] md:p-10">
      <div className="error-boundary__icon mb-4 text-[64px]" aria-hidden="true">
        {getErrorIcon()}
      </div>
      <Result
        status="error"
        title={errorMsg}
        subTitle={component}
        extra={
          <div className="error-boundary__code mb-4 max-w-[500px] break-all rounded-lg bg-[var(--danger-alpha-soft)] p-4 text-left">
            <code className="text-[14px] leading-[1.6] text-[var(--color-danger)] [font-family:var(--font-family-mono)]">
              {stackTrace}
            </code>
          </div>
        }
      />

      <div className="error-boundary__message mb-6 text-[16px] text-[var(--white-alpha-60)]">
        抱歉，页面遇到了一些问题
      </div>

      <div className="error-boundary__details mb-2 text-[14px] leading-[1.6] text-[var(--white-alpha-40)]">
        <div>错误信息: {errorMsg}</div>
        <div>组件: {component}</div>
      </div>

      <div className="error-boundary__hint mt-2 rounded-md border-l-[3px] border-l-[var(--color-danger)] bg-[var(--white-alpha-05)] p-3 text-[12px] text-[var(--white-alpha-30)]">
        {getErrorHint()}
      </div>

      <div className="error-boundary__actions mt-5 flex flex-wrap justify-center gap-3">
        <Button
          type="primary"
          className="error-boundary__action ui-button-sm min-w-[110px]"
          onClick={resetError}
        >
          重新加载
        </Button>
        <Button
          className="error-boundary__action ui-button-sm min-w-[110px]"
          onClick={() => window.location.reload()}
        >
          刷新页面
        </Button>
        <Button
          className="error-boundary__action ui-button-sm min-w-[110px]"
          onClick={handleErrorReport}
        >
          报告错误
        </Button>
      </div>
    </div>
  )
}

// 错误边界组件
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorId?: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<unknown>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  enableErrorReporting?: boolean
  maxErrors?: number
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorCount = 0

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { enableErrorReporting = true, maxErrors = 10, onError } = this.props

    this.errorCount++

    if (this.errorCount > maxErrors) {
      console.warn(`ErrorBoundary: Max errors (${maxErrors}) reached, stopping error reporting`)
      return
    }

    console.error('ErrorBoundary caught an error:', error)
    console.error('Error Info:', errorInfo)

    if (enableErrorReporting) {
      errorLogger.log(error, {
        component: errorInfo.componentStack,
        message: `${error.name}: ${error.message}`,
        stack: error.stack
      })
    }

    onError?.(error, errorInfo)
  }

  handleResetError = () => {
    this.errorCount = 0
    this.setState({ hasError: false, error: null, errorId: undefined })
  }

  render() {
    const { children, fallback: Fallback } = this.props
    const { hasError, error } = this.state

    if (hasError) {
      if (Fallback) {
        return <Fallback />
      }

      return <ErrorDisplay error={error!} resetError={this.handleResetError} />
    }

    return children
  }
}

export { ErrorBoundary, LoadingSkeleton, ErrorDisplay }
