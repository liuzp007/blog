import { useEffect, useRef, useState } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function LineDog() {
  const [isTongueOut, setTongueOut] = useState(false)
  const dogRef = useRef<any>(null)
  const tailRef = useRef<SVGGElement | null>(null)
  const leftPupilRef = useRef<SVGCircleElement | null>(null)
  const rightPupilRef = useRef<SVGCircleElement | null>(null)
  const tailSpeedRef = useRef(0)
  const tailAngleRef = useRef(0)
  const tongueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const layoutRef = useRef({
    dogCenterX: 0,
    dogCenterY: 0,
    leftEyeX: 45,
    leftEyeY: 55,
    rightEyeX: 75,
    rightEyeY: 55
  })

  useEffect(() => {
    let animationFrameId = 0
    let angle = 0

    const animate = () => {
      const speed = tailSpeedRef.current
      if (speed > 0.001) {
        angle += speed
        const amplitude = Math.min(25, speed * 120)
        tailAngleRef.current = Math.sin(angle) * amplitude
      } else {
        const current = tailAngleRef.current
        tailAngleRef.current = Math.abs(current) < 0.1 ? 0 : current * 0.9
      }
      tailRef.current?.setAttribute('transform', `rotate(${tailAngleRef.current}, 90, 85)`)
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  useEffect(() => {
    const measure = () => {
      if (!dogRef.current) return
      const rect = dogRef.current.getBoundingClientRect()
      layoutRef.current = {
        dogCenterX: rect.left + rect.width / 2,
        dogCenterY: rect.top + rect.height / 2,
        leftEyeX: rect.left + rect.width * 0.35,
        leftEyeY: rect.top + rect.height * 0.45,
        rightEyeX: rect.left + rect.width * 0.65,
        rightEyeY: rect.top + rect.height * 0.45
      }
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { dogCenterX, dogCenterY, leftEyeX, leftEyeY, rightEyeX, rightEyeY } = layoutRef.current

      const maxEyeDist = 2.5
      const updateEye = (eyeX: number, eyeY: number) => {
        const dx = event.clientX - eyeX
        const dy = event.clientY - eyeY
        const angle = Math.atan2(dy, dx)
        const dist = Math.min(maxEyeDist, Math.hypot(dx, dy) / 35)
        return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
      }

      const left = updateEye(leftEyeX, leftEyeY)
      const right = updateEye(rightEyeX, rightEyeY)
      leftPupilRef.current?.setAttribute('cx', String(45 + left.x))
      leftPupilRef.current?.setAttribute('cy', String(55 + left.y))
      rightPupilRef.current?.setAttribute('cx', String(75 + right.x))
      rightPupilRef.current?.setAttribute('cy', String(55 + right.y))

      const distToDog = Math.hypot(event.clientX - dogCenterX, event.clientY - dogCenterY)
      const maxInteractDist = 600

      let targetSpeed = 0
      if (distToDog < maxInteractDist) {
        targetSpeed = (1 - distToDog / maxInteractDist) * 0.6
      }
      tailSpeedRef.current = targetSpeed
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleClick = () => {
    setTongueOut(true)
    if (tongueTimerRef.current) {
      clearTimeout(tongueTimerRef.current)
    }
    tongueTimerRef.current = setTimeout(() => {
      setTongueOut(false)
      tongueTimerRef.current = null
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (tongueTimerRef.current) {
        clearTimeout(tongueTimerRef.current)
      }
    }
  }, [])

  return (
    <button
      type="button"
      className="dog-container"
      ref={dogRef}
      onClick={handleClick}
      aria-label="和线条小狗互动"
    >
      <svg viewBox="0 0 120 110" className="dog-svg">
        <path
          d="M40,35 Q60,25 80,35"
          fill="none"
          stroke="var(--home-linedog-outline)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M40,35 Q20,35 15,55 Q18,75 35,65"
          fill="none"
          stroke="var(--home-linedog-outline)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M80,35 Q100,35 105,55 Q102,75 85,65"
          fill="none"
          stroke="var(--home-linedog-outline)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35,65 Q30,80 45,85"
          fill="none"
          stroke="var(--home-linedog-outline)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M85,65 Q90,80 75,85"
          fill="none"
          stroke="var(--home-linedog-outline)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M35,80 Q25,100 45,105 L75,105 Q95,100 85,80"
          fill="none"
          stroke="var(--home-linedog-outline)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M48,105 L48,95 Q48,90 52,90 Q56,90 56,95 L56,105"
          fill="none"
          stroke="var(--home-linedog-outline)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M64,105 L64,95 Q64,90 68,90 Q72,90 72,95 L72,105"
          fill="none"
          stroke="var(--home-linedog-outline)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <g ref={tailRef} transform="rotate(0, 90, 85)">
          <path
            d="M90,85 Q105,80 110,65 Q112,55 105,50"
            fill="none"
            stroke="var(--home-linedog-outline)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <circle cx="45" cy="55" r="5" fill="var(--home-linedog-eye-fill)" />
        <circle ref={leftPupilRef} cx="45" cy="55" r="2.5" fill="var(--home-linedog-pupil)" />
        <circle cx="75" cy="55" r="5" fill="var(--home-linedog-eye-fill)" />
        <circle ref={rightPupilRef} cx="75" cy="55" r="2.5" fill="var(--home-linedog-pupil)" />
        <path
          d="M56,62 Q60,60 64,62 Q60,68 56,62"
          fill="var(--home-linedog-eye-fill)"
          stroke="var(--home-linedog-eye-fill)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M52,70 Q60,75 68,70"
          fill="none"
          stroke="var(--home-linedog-outline)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <g transform={`scale(${isTongueOut ? 1 : 0})`} className="line-dog__tongue">
          <path d="M55,72 Q60,82 65,72" fill="var(--home-linedog-tongue)" stroke="none" />
        </g>
        <circle cx="38" cy="65" r="4" fill="var(--home-linedog-blush)" opacity="0.4" />
        <circle cx="82" cy="65" r="4" fill="var(--home-linedog-blush)" opacity="0.4" />
      </svg>
    </button>
  )
}
