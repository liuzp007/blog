import { memo, useCallback } from 'react'
import clsx from 'clsx'
import { EyeOutlined, ClockCircleOutlined, BookOutlined } from '@ant-design/icons'

export interface SimpleContentItem {
  id: string
  title: string
  description: string
  cover?: string
  tags?: string[]
  meta?: {
    date?: string
    readTime?: number
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  }
  views?: number
}

interface SimpleContentCardProps {
  item: SimpleContentItem
  onClick?: (item: SimpleContentItem) => void
}

const DIFFICULTY_CLASSES = {
  beginner:
    'simple-content-card__tag simple-content-card__difficulty simple-content-card__difficulty--beginner inline-flex min-h-[var(--tag-height)] items-center justify-center gap-[var(--space-1)] rounded-[var(--tag-radius)] border border-[var(--tag-success-border)] bg-[var(--tag-success-bg)] px-[var(--tag-padding-inline)] text-[var(--tag-font-size)] font-[var(--tag-font-weight)] leading-none whitespace-nowrap text-[var(--tag-success-text)]',
  intermediate:
    'simple-content-card__tag simple-content-card__difficulty simple-content-card__difficulty--intermediate inline-flex min-h-[var(--tag-height)] items-center justify-center gap-[var(--space-1)] rounded-[var(--tag-radius)] border border-[var(--tag-warning-border)] bg-[var(--tag-warning-bg)] px-[var(--tag-padding-inline)] text-[var(--tag-font-size)] font-[var(--tag-font-weight)] leading-none whitespace-nowrap text-[var(--tag-warning-text)]',
  advanced:
    'simple-content-card__tag simple-content-card__difficulty simple-content-card__difficulty--advanced inline-flex min-h-[var(--tag-height)] items-center justify-center gap-[var(--space-1)] rounded-[var(--tag-radius)] border border-[var(--tag-danger-border)] bg-[var(--tag-danger-bg)] px-[var(--tag-padding-inline)] text-[var(--tag-font-size)] font-[var(--tag-font-weight)] leading-none whitespace-nowrap text-[var(--tag-danger-text)]'
} as const

const DIFFICULTY_TEXT = { beginner: '初级', intermediate: '中级', advanced: '高级' } as const

export default memo(function SimpleContentCard({ item, onClick }: SimpleContentCardProps) {
  const handleClick = useCallback(() => onClick?.(item), [item, onClick])

  const cardClassName = clsx(
    'simple-content-card mb-[var(--space-5)] overflow-hidden rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] transition-[background-color,border-color,transform,box-shadow] duration-200',
    onClick &&
      'simple-content-card--clickable cursor-pointer hover:-translate-y-0.5 hover:border-[var(--card-border-strong)] hover:bg-[var(--card-bg-hover)] hover:shadow-[var(--card-shadow-hover)]'
  )

  return (
    <article className={cardClassName} onClick={onClick ? handleClick : undefined}>
      <div className="simple-content-card__cover relative flex h-40 items-center justify-center bg-[linear-gradient(135deg,var(--brand-emphasis),var(--accent-violet))] px-[var(--space-4)] text-[var(--color-white)]">
        {item.cover ? (
          <img
            src={item.cover}
            alt={item.title}
            className="simple-content-card__cover-image h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="simple-content-card__cover-fallback overflow-hidden text-ellipsis whitespace-nowrap text-[var(--heading-6-size)] font-[var(--font-weight-semibold)]">
            {item.title}
          </div>
        )}
      </div>

      <div className="simple-content-card__content p-[var(--space-4)]">
        <h3 className="simple-content-card__title mb-[var(--space-2)] text-[var(--heading-6-size)] font-[var(--font-weight-semibold)] leading-[var(--line-height-snug)] text-[var(--color-text-heading)]">
          {item.title}
        </h3>
        <p className="simple-content-card__description mb-[var(--space-3)] text-[var(--text-body-size)] leading-[var(--text-body-line-height)] text-[var(--color-text-secondary)]">
          {item.description}
        </p>

        {item.tags && item.tags.length > 0 && (
          <div className="simple-content-card__tags mb-[var(--space-3)] flex flex-wrap gap-[var(--space-2)]">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="simple-content-card__tag inline-flex min-h-[var(--tag-height)] items-center justify-center rounded-[var(--tag-radius)] border border-[var(--tag-border)] bg-[var(--tag-bg)] px-[var(--tag-padding-inline)] text-[var(--tag-font-size)] font-[var(--tag-font-weight)] leading-none whitespace-nowrap text-[var(--tag-text)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="simple-content-card__meta flex flex-wrap items-center gap-[var(--space-3)] text-[var(--text-caption-size)] text-[var(--color-text-muted)]">
          {item.views && (
            <span className="simple-content-card__meta-item inline-flex items-center gap-[var(--space-1)] leading-[var(--line-height-normal)]">
              <EyeOutlined /> {item.views}
            </span>
          )}
          {item.meta?.readTime && (
            <span className="simple-content-card__meta-item inline-flex items-center gap-[var(--space-1)] leading-[var(--line-height-normal)]">
              <ClockCircleOutlined /> {item.meta.readTime}分钟
            </span>
          )}
          {item.meta?.difficulty && (
            <span className={DIFFICULTY_CLASSES[item.meta.difficulty]}>
              <BookOutlined /> {DIFFICULTY_TEXT[item.meta.difficulty]}
            </span>
          )}
          {item.meta?.date && (
            <span className="simple-content-card__meta-item inline-flex items-center gap-[var(--space-1)] leading-[var(--line-height-normal)]">
              {item.meta.date}
            </span>
          )}
        </div>
      </div>
    </article>
  )
})
