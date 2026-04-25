import { memo, useCallback } from 'react'
import { Switch } from 'antd'
import { useAppDispatch, useAppSelector } from '@/store'
import { setPostProcessing } from '@/store/userPreferences'

export default memo(function PerfToggle() {
  const dispatch = useAppDispatch()
  const enabled = useAppSelector(s => s.userPreferences.postProcessing)

  const handleChange = useCallback(
    (checked: boolean) => dispatch(setPostProcessing(checked)),
    [dispatch]
  )

  return (
    <div className="absolute right-3 top-3 z-10">
      <label className="flex items-center gap-2 text-xs text-[var(--color-slate-300)]">
        <Switch checked={enabled} onChange={handleChange} size="small" />
        后处理效果
      </label>
    </div>
  )
})
