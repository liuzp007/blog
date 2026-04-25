import { memo, useCallback } from 'react'
import { Alert, Button, Skeleton, Empty, Spin } from 'antd'
import { ExclamationCircleOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons'
import { isNetworkError, isTimeoutError } from '@/utils/apiErrorHandler'

interface ErrorAlertProps {
  error: Error | string | null
  onClose?: () => void
  onRetry?: () => void
  showRetry?: boolean
  type?: 'error' | 'warning' | 'info'
  description?: string
}

export const ErrorAlert = memo(function ErrorAlert({
  error,
  onClose,
  onRetry,
  showRetry = true,
  type = 'error',
  description
}: ErrorAlertProps) {
  if (!error) return null

  const errorObj = typeof error === 'string' ? new Error(error) : error
  const errorMessage = errorObj.message || '发生错误'

  const handleRetry = useCallback(() => onRetry?.(), [onRetry])
  const handleClose = useCallback(() => onClose?.(), [onClose])

  const getErrorIcon = () => {
    if (isNetworkError(errorObj)) return '🌐'
    if (isTimeoutError(errorObj)) return '⏱️'
    return <ExclamationCircleOutlined />
  }

  return (
    <Alert
      type={type}
      icon={getErrorIcon()}
      message={errorMessage}
      description={
        description || (isNetworkError(errorObj) ? '网络连接失败，请检查网络设置' : undefined)
      }
      action={
        <div className="flex gap-2">
          {showRetry && onRetry && (
            <Button size="small" icon={<ReloadOutlined />} onClick={handleRetry}>
              重试
            </Button>
          )}
          {onClose && (
            <Button size="small" icon={<CloseOutlined />} onClick={handleClose}>
              关闭
            </Button>
          )}
        </div>
      }
      closable={onClose !== undefined}
      onClose={handleClose}
      className="mb-4"
    />
  )
})

interface LoadingErrorProps {
  loading: boolean
  error: Error | null
  retry?: () => void
  children: React.ReactNode
  loadingText?: string
  errorText?: string
  showSkeleton?: boolean
  skeletonLines?: number
}

export const LoadingErrorHandler = memo(function LoadingErrorHandler({
  loading,
  error,
  retry,
  children,
  loadingText = '加载中...',
  errorText = '加载失败',
  showSkeleton = false,
  skeletonLines = 3
}: LoadingErrorProps) {
  if (loading) {
    if (showSkeleton) {
      return (
        <div className="p-4">
          {Array.from({ length: skeletonLines }).map((_, index) => (
            <Skeleton key={index} active paragraph={{ rows: 1 }} className="mb-4" />
          ))}
          <div className="text-center text-[var(--white-alpha-40)]">{loadingText}</div>
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-[var(--white-alpha-60)]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-accent-cyan)] border-t-transparent" />
          {loadingText}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <ErrorAlert
          error={error}
          description={errorText}
          showRetry={retry !== undefined}
          onRetry={retry}
        />
      </div>
    )
  }

  return <>{children}</>
})

interface AsyncWrapperProps {
  children: React.ReactNode
  error?: Error | null
  loading?: boolean
  onRetry?: () => void
  empty?: boolean
  emptyText?: string
  errorTitle?: string
  loadingText?: string
}

export const AsyncWrapper = memo(function AsyncWrapper({
  children,
  error,
  loading = false,
  onRetry,
  empty = false,
  emptyText = '暂无数据',
  errorTitle = '加载失败',
  loadingText = '加载中...'
}: AsyncWrapperProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spin tip={loadingText} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <ErrorAlert
          error={error}
          description={errorTitle}
          showRetry={onRetry !== undefined}
          onRetry={onRetry}
        />
      </div>
    )
  }

  if (empty) {
    return (
      <div className="flex items-center justify-center p-8">
        <Empty description={emptyText} />
      </div>
    )
  }

  return <>{children}</>
})

export default ErrorAlert
