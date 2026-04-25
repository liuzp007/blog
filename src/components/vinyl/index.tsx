import { CSSProperties, useMemo, useState, useCallback, memo } from 'react'
import clsx from 'clsx'
import './index.css'

interface VinylProps {
  className?: string
  size?: number | string
  defaultSpinning?: boolean
}

const Vinyl = memo(function Vinyl({
  className = '',
  size = 20,
  defaultSpinning = true
}: VinylProps = {}) {
  const [isRotating, setIsRotating] = useState(defaultSpinning)
  const style = useMemo(
    () =>
      ({
        '--vinyl-size': typeof size === 'number' ? `${size}px` : size
      }) as CSSProperties,
    [size]
  )

  const toggleRotation = useCallback(() => {
    setIsRotating(prev => !prev)
  }, [])

  return (
    <button
      type="button"
      className={clsx(className, 'vinyl-record', isRotating && 'rotate')}
      style={style}
      onClick={toggleRotation}
      aria-pressed={isRotating}
      aria-label={isRotating ? '暂停唱片旋转' : '开始唱片旋转'}
    >
      <div className="center-hole"></div>
      <div className="grooves">
        <div className="groove"></div>
        <div className="groove"></div>
      </div>
    </button>
  )
})

export default Vinyl
