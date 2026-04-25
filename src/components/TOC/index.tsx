import { memo } from 'react'
import clsx from 'clsx'

export interface TOCItem {
  id: string
  text: string
  level: 1 | 2 | 3
}

const INDENT: Record<TOCItem['level'], string> = {
  1: '',
  2: 'pl-[var(--space-3)]',
  3: 'pl-[var(--space-5)]'
}

const TONE: Record<TOCItem['level'], string> = {
  1: 'font-semibold text-[var(--color-text-primary)]',
  2: 'text-[var(--text-meta-size)] leading-[var(--text-meta-line-height)]',
  3: 'text-[var(--text-meta-size)] leading-[var(--text-meta-line-height)]'
}

const LINK_BASE = [
  'toc__link group grid grid-cols-[auto,minmax(0,1fr)] items-start gap-[var(--space-2)] rounded-[var(--radius-md)] border border-transparent px-3 py-[10px] text-[var(--color-text-secondary)] no-underline transition-all duration-200',
  'hover:translate-x-[2px] hover:border-[var(--card-border)] hover:bg-[var(--button-secondary-bg)] hover:text-[var(--color-text-primary)] hover:shadow-[0_0_0_2px_var(--focus-ring)]',
  'focus-visible:translate-x-[2px] focus-visible:border-[var(--card-border)] focus-visible:bg-[var(--button-secondary-bg)] focus-visible:text-[var(--color-text-primary)] focus-visible:shadow-[0_0_0_2px_var(--focus-ring)] focus-visible:outline-none'
].join(' ')

function TOC({ items }: { items: TOCItem[] }) {
  if (!items.length) return null

  return (
    <nav aria-label="文章目录" className="toc sticky top-[var(--space-5)]">
      <ul className="toc__list m-0 grid list-none gap-[var(--space-1)] p-0">
        {items.map(i => (
          <li
            key={i.id}
            className={clsx('toc__item', `toc__item--level-${i.level}`, INDENT[i.level])}
          >
            <a href={`#${i.id}`} className={clsx(LINK_BASE, TONE[i.level])}>
              <span
                className="toc__marker mt-[0.45em] h-2 w-2 rounded-[var(--radius-pill)] border border-[var(--tag-accent-border)] bg-[var(--tag-accent-bg)] shadow-[0_0_0_2px_transparent] transition-colors duration-200 group-hover:border-[var(--color-accent-cyan)] group-hover:bg-[var(--color-accent-cyan-soft)] group-focus-visible:border-[var(--color-accent-cyan)] group-focus-visible:bg-[var(--color-accent-cyan-soft)]"
                aria-hidden="true"
              />
              <span className="toc__text min-w-0">{i.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default memo(TOC)
