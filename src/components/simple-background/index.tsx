import { memo } from 'react'

const SimpleBackground = memo(function SimpleBackground() {
  return (
    <div className="simple-background pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(135deg,var(--color-surface-base),var(--color-surface-night))]" />
  )
})

export default SimpleBackground
