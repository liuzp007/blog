import { useMemo, memo } from 'react'
import { Segmented } from 'antd'
import './CategoryBar.css'

interface Props {
  categories: string[]
  active?: string
  onChange: (val: string) => void
}

export default memo(function CategoryBar({ categories, active, onChange }: Props) {
  const options = useMemo(() => ['全部文章', ...categories], [categories])

  return (
    <div className="my-2 mb-4">
      <div className="category-bar__scroll overflow-x-auto pb-1 [scrollbar-color:color-mix(in srgb, var(--color-white) 12%, transparent)_transparent] [scrollbar-width:thin]">
        <Segmented
          className="category-bar__segmented w-max max-w-full rounded-[var(--radius-pill)] border border-[color-mix(in srgb, var(--color-white) 12%, transparent)] bg-[color-mix(in srgb, var(--color-white) 6%, transparent)] p-1 shadow-[inset_0_1px_0_color-mix(in srgb, var(--color-white) 4%, transparent)]"
          size="middle"
          options={options}
          value={active ?? '全部文章'}
          onChange={val => onChange(String(val))}
        />
      </div>
    </div>
  )
})
