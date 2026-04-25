import React, { useCallback } from 'react'
import clsx from 'clsx'
import './index.css'

interface TiltCardProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  children: React.ReactNode
  maxTilt?: number
  scale?: number
  lift?: number
  buttonType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

const applyTilt = (
  node: HTMLElement,
  {
    rotateX = 0,
    rotateY = 0,
    scale = 1,
    lift = 0,
    pointerX = 50,
    pointerY = 50,
    glare = 0
  }: {
    rotateX?: number
    rotateY?: number
    scale?: number
    lift?: number
    pointerX?: number
    pointerY?: number
    glare?: number
  }
) => {
  node.style.setProperty('--tilt-card-transform-rotate-x', `${rotateX.toFixed(2)}deg`)
  node.style.setProperty('--tilt-card-transform-rotate-y', `${rotateY.toFixed(2)}deg`)
  node.style.setProperty('--tilt-card-transform-scale', `${scale}`)
  node.style.setProperty('--tilt-card-transform-lift', `${lift.toFixed(2)}px`)
  node.style.setProperty('--tilt-card-pointer-x', `${pointerX.toFixed(2)}%`)
  node.style.setProperty('--tilt-card-pointer-y', `${pointerY.toFixed(2)}%`)
  node.style.setProperty('--tilt-card-glare-opacity', `${glare}`)
}

export default function TiltCard({
  as: Component = 'div',
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  lift = 8,
  buttonType = 'button',
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: TiltCardProps) {
  const componentProps = Component === 'button' ? { type: buttonType } : {}

  const handlePointerMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const node = event.currentTarget
      const rect = node.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const pointerX = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100)
      const pointerY = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100)
      const rotateX = (pointerY / 100 - 0.5) * maxTilt * 2
      const rotateY = (0.5 - pointerX / 100) * maxTilt * 2

      applyTilt(node, {
        rotateX,
        rotateY,
        scale,
        lift,
        pointerX,
        pointerY,
        glare: 1
      })
    },
    [lift, maxTilt, scale]
  )

  const handleLeave = useCallback((event: React.MouseEvent<HTMLElement>) => {
    applyTilt(event.currentTarget, {})
  }, [])

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      applyTilt(event.currentTarget, {
        scale: Math.max(1.01, scale - 0.005),
        lift: Math.max(4, lift - 2),
        glare: 0.66
      })
    },
    [lift, scale]
  )

  const handleBlur = useCallback((event: React.FocusEvent<HTMLElement>) => {
    applyTilt(event.currentTarget, {})
  }, [])

  return (
    <Component
      {...componentProps}
      className={clsx(
        'tilt-card relative isolate',
        Component === 'button' &&
          'w-full appearance-none border-0 bg-transparent p-0 text-left text-inherit [font:inherit]',
        className
      )}
      onMouseEnter={(event: React.MouseEvent<HTMLElement>) => {
        handlePointerMove(event)
        onMouseEnter?.(event)
      }}
      onMouseMove={(event: React.MouseEvent<HTMLElement>) => {
        handlePointerMove(event)
        onMouseMove?.(event)
      }}
      onMouseLeave={(event: React.MouseEvent<HTMLElement>) => {
        handleLeave(event)
        onMouseLeave?.(event)
      }}
      onFocus={(event: React.FocusEvent<HTMLElement>) => {
        handleFocus(event)
        onFocus?.(event)
      }}
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        handleBlur(event)
        onBlur?.(event)
      }}
      {...rest}
    >
      <span
        className="tilt-card__glare pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      ></span>
      {children}
    </Component>
  )
}
