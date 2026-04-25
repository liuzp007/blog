import { useState, useEffect, useCallback, memo } from 'react'
import { Input, Button } from 'antd'

interface SearchBoxProps {
  value?: string
  onChange?: (q: string) => void
  onSubmit?: (q: string) => void
}

export default memo(function SearchBox({ value = '', onChange, onSubmit }: SearchBoxProps) {
  const [q, setQ] = useState(value)
  useEffect(() => setQ(value), [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setQ(val)
      onChange?.(val)
    },
    [onChange]
  )

  const handleSubmit = useCallback(() => {
    onSubmit?.(q)
  }, [q, onSubmit])

  const handleClear = useCallback(() => {
    setQ('')
    onChange?.('')
    onSubmit?.('')
  }, [onChange, onSubmit])

  return (
    <div className="blog-searchbox">
      <Input
        className="ui-input blog-searchbox__input"
        name="blog-search"
        value={q}
        onChange={handleChange}
        onPressEnter={handleSubmit}
        placeholder="搜索标题、摘要、标签…"
        allowClear
      />
      <div className="blog-searchbox__actions">
        <Button
          className="ui-button--icon-ghost blog-searchbox__button blog-searchbox__button--submit"
          onClick={handleSubmit}
        >
          搜索
        </Button>
        {q && (
          <Button
            className="ui-button--icon-ghost blog-searchbox__button blog-searchbox__button--clear"
            onClick={handleClear}
          >
            清空
          </Button>
        )}
      </div>
    </div>
  )
})
