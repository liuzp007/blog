import { memo, useMemo } from 'react'
import clsx from 'clsx'
import { Button } from 'antd'
import { LoadingOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons'
import '../../styles/3_components/layout/content-wrapper.css'

interface ContentWrapperProps {
  title?: string
  subtitle?: string
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  allowOverflow?: boolean
  surface?: 'glass' | 'plain'
  className?: string
  children: React.ReactNode
}

export default memo(function ContentWrapperComponent({
  title,
  subtitle,
  loading = false,
  error = null,
  onRetry,
  allowOverflow = false,
  surface = 'glass',
  className = '',
  children
}: ContentWrapperProps) {
  const wrapperClassName = useMemo(
    () =>
      clsx(
        'content-wrapper',
        `content-wrapper--surface-${surface}`,
        'relative m-4 min-h-full rounded-xl p-8',
        allowOverflow ? 'overflow-visible' : 'overflow-hidden',
        surface === 'glass'
          ? 'bg-[linear-gradient(135deg,var(--color-sidebar-start)_0%,var(--color-sidebar-mid)_50%,var(--color-sidebar-end)_100%)] [backdrop-filter:blur(20px)]'
          : 'bg-[linear-gradient(180deg,var(--color-page-panel-start)_0%,var(--color-page-panel-mid)_48%,var(--color-page-panel-end)_100%)]',
        allowOverflow && 'content-wrapper--overflow-visible',
        className
      ),
    [surface, allowOverflow, className]
  )

  if (loading) {
    return (
      <div className={wrapperClassName}>
        <div className="content-wrapper__loading relative z-[3] flex min-h-[60vh] flex-col items-center justify-center text-center text-[var(--white-alpha-80)]">
          <LoadingOutlined
            className="content-wrapper__loading-icon mb-4 text-[3rem] text-[var(--color-code-indigo)]"
            aria-hidden="true"
          />
          <div>嘘，好戏即将开场...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={wrapperClassName}>
        <div className="content-wrapper__error relative z-[3] flex min-h-[60vh] flex-col items-center justify-center text-center text-[var(--color-code-red)]">
          <WarningOutlined
            className="content-wrapper__error-icon mb-4 text-[3rem]"
            aria-hidden="true"
          />
          <div className="content-wrapper__error-message mb-6 text-[1.2rem]">错误: {error}</div>
          {onRetry ? (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              className="content-wrapper__retry ui-button-md min-w-[140px] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_10px_25px_var(--indigo-alpha-30)] focus:-translate-y-0.5 focus:shadow-[0_10px_25px_var(--indigo-alpha-30)]"
              onClick={onRetry}
            >
              重试
            </Button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className={wrapperClassName}>
      {(title || subtitle) && (
        <header className="content-wrapper__header relative z-[3] mb-8 border-b-2 border-b-[var(--indigo-alpha-30)] pb-4">
          {title && <h1 className="content-wrapper__title ui-page-title m-0">{title}</h1>}
          {subtitle && (
            <div className="content-wrapper__subtitle ui-lead-text mt-2 font-light text-[var(--white-alpha-70)]">
              {subtitle}
            </div>
          )}
        </header>
      )}
      <div className="content-wrapper__body relative z-[3]">{children}</div>
    </div>
  )
})
