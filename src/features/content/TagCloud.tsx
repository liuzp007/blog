import { useMemo, useCallback, memo } from 'react'
import clsx from 'clsx'
import { Tooltip } from 'antd'
import type { ContentMeta } from '@/features/content/contentIndex'

interface TagCloudProps {
  metas: ContentMeta[]
  activeTag?: string
  onSelect: (tag?: string) => void
  max?: number
}

const deriveCounts = (metas: ContentMeta[], max: number) => {
  const map = new Map<string, number>()
  metas.forEach(m => {
    if (m.tags && m.tags.length) {
      m.tags.forEach(t => {
        const token = t.trim()
        if (!token) return
        map.set(token, (map.get(token) || 0) + 1)
      })
    } else {
      map.set('未分类', (map.get('未分类') || 0) + 1)
    }
  })
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, max)
}

const scale = (count: number, maxCount: number) => {
  const ratio = count / Math.max(1, maxCount)
  if (ratio > 0.66) return 'large'
  if (ratio > 0.33) return 'medium'
  return 'small'
}

const WEIGHT_CLASS_MAP = { small: 'ui-tag--sm', medium: 'ui-tag--sm', large: 'ui-tag--md' } as const

export default memo(function TagCloud({ metas, activeTag, onSelect, max = 30 }: TagCloudProps) {
  const counts = useMemo(() => deriveCounts(metas, max), [metas, max])
  const maxCount = counts.length ? counts[0][1] : 1

  const handleSelect = useCallback((tag?: string) => () => onSelect(tag), [onSelect])

  return (
    <div
      className="tag-cloud flex flex-wrap gap-[var(--space-2)] text-[var(--color-text-muted)] max-[600px]:gap-[var(--space-1)]"
      role="list"
      aria-label="标签云"
    >
      <TagButton
        label="全部"
        isActive={!activeTag}
        weight="medium"
        ariaLabel="全部文章"
        onClick={handleSelect(undefined)}
      />
      {counts.map(([tag, count]) => (
        <TagButton
          key={tag}
          label={tag}
          count={count}
          isActive={activeTag === tag}
          weight={scale(count, maxCount)}
          ariaLabel={`${tag} · ${count} 篇`}
          onClick={handleSelect(tag)}
        />
      ))}
    </div>
  )
})

interface TagButtonProps {
  label: string
  count?: number
  isActive: boolean
  weight: 'small' | 'medium' | 'large'
  ariaLabel: string
  onClick: () => void
}

const TagButton = memo(function TagButton({
  label,
  count,
  isActive,
  weight,
  ariaLabel,
  onClick
}: TagButtonProps) {
  const itemClassName = clsx(
    'tag-cloud__item ui-tag ui-tag--interactive',
    WEIGHT_CLASS_MAP[weight],
    isActive ? 'ui-tag--tone-accent tag-cloud__item--active -translate-y-px' : 'ui-tag--tone-soft'
  )

  return (
    <Tooltip title={ariaLabel}>
      <button type="button" className={itemClassName} aria-pressed={isActive} onClick={onClick}>
        <span className="tag-cloud__label inline-flex items-center">{label}</span>
        {typeof count === 'number' && (
          <span className="tag-cloud__count inline-flex items-center justify-center rounded-full bg-[var(--tag-border-strong)] px-1.5 text-[var(--text-label-size)] font-[var(--font-weight-semibold)] text-[var(--color-white)]">
            {count}
          </span>
        )}
      </button>
    </Tooltip>
  )
})
