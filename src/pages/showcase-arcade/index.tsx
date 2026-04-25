import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeftOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { Button, Modal, Segmented, Tag } from 'antd'
import { Link } from 'react-router-dom'
import './index.css'

/**
 * 消毒 HTML 字符串：移除 <script> 标签和 on* 事件处理器属性，
 * 防止通过 dangerouslySetInnerHTML 注入恶意代码。
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '')
}

interface CardGlyph {
  icon: string
  label: string
}

interface MemoryCard {
  id: string
  glyph: CardGlyph
  flipped: boolean
  matched: boolean
  wrong: boolean
}

interface FlashMessage {
  id: number
  text: string
  tone: 'match' | 'miss' | 'scan' | 'win'
}

type Difficulty = 4 | 6 | 8
type ThemeKey = 'sunset' | 'lagoon' | 'midnight'

const CARD_GLYPHS: CardGlyph[] = [
  {
    label: '猫咪电视',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="50" cy="35" rx="20" ry="25"/><path d="M30 60 Q30 50 35 45 M70 60 Q70 50 65 45"/><rect x="35" y="60" width="30" height="35" rx="3"/><circle cx="42" cy="32" r="3"/><circle cx="58" cy="32" r="3"/><path d="M45 42 Q50 45 55 42"/></svg>`
  },
  {
    label: '棕榈波浪',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path d="M50 95 L50 50"/><path d="M50 50 Q30 40 15 50 Q35 45 50 50"/><path d="M50 50 Q70 40 85 50 Q65 45 50 50"/><path d="M50 55 Q25 50 10 60 Q30 55 50 55"/><path d="M50 55 Q75 50 90 60 Q70 55 50 55"/><path d="M50 45 Q35 30 20 40 Q40 35 50 45"/><path d="M50 45 Q65 30 80 40 Q60 35 50 45"/></svg>`
  },
  {
    label: '霓虹磁带',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><rect x="15" y="25" width="70" height="50" rx="5"/><rect x="25" y="35" width="50" height="30" rx="3"/><circle cx="38" cy="50" r="8"/><circle cx="62" cy="50" r="8"/><circle cx="38" cy="50" r="3"/><circle cx="62" cy="50" r="3"/><rect x="35" y="75" width="30" height="5" rx="2"/></svg>`
  },
  {
    label: '夜航芯片',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><rect x="20" y="15" width="60" height="70" rx="3"/><rect x="35" y="15" width="30" height="25"/><rect x="55" y="20" width="5" height="15"/><rect x="30" y="50" width="40" height="30" rx="2"/><line x1="35" y1="58" x2="65" y2="58"/><line x1="35" y1="65" x2="65" y2="65"/><line x1="35" y1="72" x2="55" y2="72"/></svg>`
  },
  {
    label: '窗口城市',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><rect x="15" y="20" width="70" height="60" rx="2"/><rect x="15" y="20" width="70" height="15"/><line x1="15" y1="35" x2="85" y2="35"/><circle cx="25" cy="27" r="3"/><circle cx="35" cy="27" r="3"/><circle cx="45" cy="27" r="3"/><rect x="25" y="45" width="20" height="25"/><rect x="55" y="45" width="20" height="25"/></svg>`
  },
  {
    label: '长夜诗集',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><path d="M25 70 L25 30 Q25 20 35 20 L65 20 Q75 20 75 30 L75 70"/><path d="M35 35 L65 35"/><path d="M35 50 L55 50"/><path d="M35 65 L60 65"/></svg>`
  },
  {
    label: '街机手柄',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><rect x="15" y="35" width="70" height="35" rx="10"/><circle cx="35" cy="52" r="10"/><circle cx="35" cy="52" r="4"/><circle cx="62" cy="47" r="4"/><circle cx="72" cy="47" r="4"/><circle cx="67" cy="57" r="4"/><circle cx="77" cy="57" r="4"/></svg>`
  },
  {
    label: '口袋随身听',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><rect x="25" y="30" width="50" height="55" rx="8"/><circle cx="50" cy="55" r="15"/><circle cx="50" cy="55" r="8"/><path d="M25 30 Q25 15 50 15 Q75 15 75 30"/><rect x="35" y="20" width="30" height="15" rx="3"/></svg>`
  },
  {
    label: '掌上录影机',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><rect x="15" y="30" width="70" height="50" rx="5"/><rect x="22" y="37" width="40" height="36"/><circle cx="73" cy="45" r="4"/><circle cx="73" cy="58" r="4"/><rect x="68" y="67" width="10" height="6" rx="1"/><path d="M35 25 L45 30 M65 25 L55 30"/></svg>`
  },
  {
    label: '钢琴灯牌',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><rect x="15" y="30" width="70" height="45" rx="3"/><line x1="30" y1="30" x2="30" y2="75"/><line x1="45" y1="30" x2="45" y2="75"/><line x1="60" y1="30" x2="60" y2="75"/><rect x="24" y="30" width="8" height="28" fill="currentColor"/><rect x="39" y="30" width="8" height="28" fill="currentColor"/><rect x="54" y="30" width="8" height="28" fill="currentColor"/><rect x="69" y="30" width="8" height="28" fill="currentColor"/></svg>`
  },
  {
    label: '菱镜传送门',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><polygon points="50,15 85,40 50,85 15,40"/><line x1="15" y1="40" x2="85" y2="40"/><line x1="50" y1="15" x2="35" y2="40"/><line x1="50" y1="15" x2="65" y2="40"/><line x1="50" y1="85" x2="35" y2="40"/><line x1="50" y1="85" x2="65" y2="40"/></svg>`
  },
  {
    label: '心跳霓虹',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path d="M50 85 Q20 60 20 40 Q20 20 35 20 Q50 20 50 35 Q50 20 65 20 Q80 20 80 40 Q80 60 50 85"/></svg>`
  },
  {
    label: '恒星徽章',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><polygon points="50,10 61,40 95,40 68,60 79,90 50,72 21,90 32,60 5,40 39,40"/></svg>`
  },
  {
    label: '月光轨迹',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path d="M65 20 Q35 30 35 60 Q35 85 65 85 Q45 75 45 50 Q45 30 65 20"/><circle cx="70" cy="30" r="2"/><circle cx="78" cy="45" r="1.5"/><circle cx="75" cy="60" r="2"/></svg>`
  },
  {
    label: '闪电引擎',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><polygon points="55,10 30,50 45,50 40,90 70,45 52,45"/></svg>`
  },
  {
    label: '棕榈花束',
    icon: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><circle cx="50" cy="35" r="12"/><circle cx="35" cy="50" r="12"/><circle cx="65" cy="50" r="12"/><circle cx="40" cy="65" r="12"/><circle cx="60" cy="65" r="12"/><circle cx="50" cy="50" r="8" fill="currentColor"/><line x1="50" y1="62" x2="50" y2="90"/></svg>`
  }
]

const DIFFICULTY_OPTIONS = [
  { label: '轻松 4 x 4', value: 4 },
  { label: '标准 6 x 6', value: 6 },
  { label: '挑战 8 x 8', value: 8 }
]

const THEMES: Record<
  ThemeKey,
  {
    label: string
    hint: string
    pulse: string
  }
> = {
  sunset: {
    label: '落日霓虹',
    hint: '经典蒸汽波色调，热烈且明亮。',
    pulse: '粉橙过载'
  },
  lagoon: {
    label: '海市镜湖',
    hint: '偏青蓝玻璃感，更冷静也更梦幻。',
    pulse: '冰蓝涟漪'
  },
  midnight: {
    label: '午夜磁带',
    hint: '更深的夜色与紫光，氛围更沉浸。',
    pulse: '紫夜闪频'
  }
}

const SCAN_CHARGE_MAP: Record<Difficulty, number> = {
  4: 3,
  6: 2,
  8: 1
}

function shuffleCards<T>(items: T[]) {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }

  return next
}

function createDeck(size: Difficulty) {
  const total = size * size
  const pairs = total / 2
  const glyphs = CARD_GLYPHS.slice(0, pairs)

  return shuffleCards(
    glyphs.flatMap((glyph, index) => [
      {
        id: `${size}-${index}-a-${Math.random()}`,
        glyph,
        flipped: false,
        matched: false,
        wrong: false
      },
      {
        id: `${size}-${index}-b-${Math.random()}`,
        glyph,
        flipped: false,
        matched: false,
        wrong: false
      }
    ])
  ) as MemoryCard[]
}

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

function getRank(score: number) {
  if (score >= 2800) return '霓虹馆长'
  if (score >= 2200) return '镜面领航员'
  if (score >= 1600) return '夜游玩家'
  return '刚刚入场'
}

export default function ShowcaseArcade() {
  const [difficulty, setDifficulty] = useState<Difficulty>(4)
  const [themeKey, setThemeKey] = useState<ThemeKey>('sunset')
  const [cards, setCards] = useState<MemoryCard[]>(() => createDeck(4))
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)
  const [locked, setLocked] = useState(false)
  const [winOpen, setWinOpen] = useState(false)
  const [winSettled, setWinSettled] = useState(false)
  const [previewActive, setPreviewActive] = useState(true)
  const [scanCharges, setScanCharges] = useState(SCAN_CHARGE_MAP[4])
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)

  const theme = THEMES[themeKey]
  const totalPairs = useMemo(() => (difficulty * difficulty) / 2, [difficulty])
  const matchedPairs = useMemo(() => cards.filter(item => item.matched).length / 2, [cards])
  const progressPercent = useMemo(
    () => Math.round((matchedPairs / totalPairs) * 100),
    [matchedPairs, totalPairs]
  )
  const accuracy = useMemo(() => {
    if (moves === 0) return 100
    return Math.max(0, Math.min(100, Math.round((matchedPairs / moves) * 100)))
  }, [matchedPairs, moves])
  const timerText = useMemo(() => formatSeconds(seconds), [seconds])
  const themeOptions = useMemo(
    () =>
      Object.entries(THEMES).map(([value, item]) => ({
        label: item.label,
        value
      })),
    []
  )
  const stars = useMemo(
    () =>
      Array.from({ length: 56 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 62}%`,
        delay: `${Math.random() * 2.6}s`,
        duration: `${1.8 + Math.random() * 2.4}s`
      })),
    []
  )
  const celebrationBits = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: `${6 + Math.random() * 88}%`,
        delay: `${Math.random() * 1.8}s`,
        duration: `${2.2 + Math.random() * 1.8}s`,
        rotate: `${Math.random() * 320}deg`
      })),
    []
  )

  const showFlash = useCallback((text: string, tone: FlashMessage['tone']) => {
    setFlashMessage({
      id: Date.now() + Math.floor(Math.random() * 1000),
      text,
      tone
    })
  }, [])

  const resetGame = useCallback(
    (nextDifficulty: Difficulty = difficulty, nextThemeKey: ThemeKey = themeKey) => {
      setDifficulty(nextDifficulty)
      setThemeKey(nextThemeKey)
      setCards(createDeck(nextDifficulty))
      setSelectedIds([])
      setMoves(0)
      setSeconds(0)
      setStarted(false)
      setLocked(false)
      setWinOpen(false)
      setWinSettled(false)
      setPreviewActive(true)
      setScanCharges(SCAN_CHARGE_MAP[nextDifficulty])
      setStreak(0)
      setBestStreak(0)
      setScore(0)
      setFlashMessage({
        id: Date.now(),
        text: `${THEMES[nextThemeKey].pulse}已接入`,
        tone: 'scan'
      })
    },
    [difficulty, themeKey]
  )

  const handleDifficultyChange = useCallback(
    (value: Difficulty) => {
      resetGame(value, themeKey)
    },
    [resetGame, themeKey]
  )

  const handleThemeChange = useCallback(
    (value: ThemeKey) => {
      resetGame(difficulty, value)
    },
    [difficulty, resetGame]
  )

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (locked || previewActive) return

      const target = cards.find(item => item.id === cardId)
      if (!target || target.flipped || target.matched) return

      if (!started) setStarted(true)

      setCards(prev =>
        prev.map(item => (item.id === cardId ? { ...item, flipped: true, wrong: false } : item))
      )

      setSelectedIds(prev => {
        if (prev.length === 0) return [cardId]
        if (prev.length === 1) {
          setMoves(count => count + 1)
          return [...prev, cardId]
        }
        return prev
      })
    },
    [cards, locked, previewActive, started]
  )

  const triggerScan = useCallback(() => {
    if (previewActive || scanCharges <= 0 || matchedPairs === totalPairs) return
    setPreviewActive(true)
    setScanCharges(prev => Math.max(0, prev - 1))
    showFlash('扫频已展开', 'scan')
  }, [matchedPairs, previewActive, scanCharges, showFlash, totalPairs])

  useEffect(() => {
    if (!previewActive) return

    const timer = window.setTimeout(() => {
      setPreviewActive(false)
    }, 1450)

    return () => window.clearTimeout(timer)
  }, [previewActive, cards.length])

  useEffect(() => {
    if (!started || winOpen) return

    const timer = window.setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [started, winOpen])

  useEffect(() => {
    if (!flashMessage) return

    const timer = window.setTimeout(() => {
      setFlashMessage(current => (current?.id === flashMessage.id ? null : current))
    }, 1100)

    return () => window.clearTimeout(timer)
  }, [flashMessage])

  useEffect(() => {
    if (selectedIds.length !== 2) return

    const [firstId, secondId] = selectedIds
    const first = cards.find(item => item.id === firstId)
    const second = cards.find(item => item.id === secondId)

    if (!first || !second) {
      setSelectedIds([])
      return
    }

    setLocked(true)
    const isMatch = first.glyph.label === second.glyph.label

    if (isMatch) {
      const timer = window.setTimeout(() => {
        setCards(prev =>
          prev.map(item =>
            item.id === firstId || item.id === secondId ? { ...item, matched: true } : item
          )
        )
        setSelectedIds([])
        setLocked(false)
        setStreak(prev => {
          const next = prev + 1
          setBestStreak(best => Math.max(best, next))
          setScore(current => current + 140 + next * 45)
          showFlash(next > 1 ? `连击 x ${next}` : '完美配对', 'match')
          return next
        })
      }, 280)

      return () => window.clearTimeout(timer)
    }

    setCards(prev =>
      prev.map(item =>
        item.id === firstId || item.id === secondId ? { ...item, wrong: true } : item
      )
    )
    setStreak(0)
    setScore(current => Math.max(0, current - 30))
    showFlash('记忆失焦', 'miss')

    const timer = window.setTimeout(() => {
      setCards(prev =>
        prev.map(item =>
          item.id === firstId || item.id === secondId
            ? { ...item, flipped: false, wrong: false }
            : item
        )
      )
      setSelectedIds([])
      setLocked(false)
    }, 760)

    return () => window.clearTimeout(timer)
  }, [cards, selectedIds, showFlash])

  useEffect(() => {
    if (cards.length === 0 || matchedPairs !== totalPairs || winSettled) return

    setStarted(false)
    setScore(
      current => current + 420 + scanCharges * 90 + bestStreak * 60 + Math.max(0, 180 - seconds)
    )
    setWinOpen(true)
    setWinSettled(true)
    showFlash('全场点亮', 'win')
  }, [
    bestStreak,
    cards.length,
    matchedPairs,
    scanCharges,
    seconds,
    showFlash,
    totalPairs,
    winSettled
  ])

  return (
    <div className={`vapor-memory vapor-memory--${themeKey}`}>
      <div className="vapor-memory__bg">
        <div className="vapor-memory__stars">
          {stars.map(star => (
            <span
              key={star.id}
              className="vapor-memory__star"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay,
                animationDuration: star.duration
              }}
            />
          ))}
        </div>
        <div className="vapor-memory__sun" />
        <div className="vapor-memory__grid-floor" />
        <div className="vapor-memory__noise" />
        <div className="vapor-memory__scanlines" />
      </div>

      <div className="relative z-[1] w-[min(1320px,calc(100%-28px))] min-h-[100dvh] m-0 auto p-[34px_0_36px]">
        <header className="grid items-start gap-[22px] min-[1081px]:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.74fr)]">
          <div className="border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg)] shadow-[var(--arcade-shadow-panel)] backdrop-blur-[16px] rounded-[28px] p-6">
            <p className="inline-flex items-center min-h-[34px] m-0 px-3.5 rounded-[999px] border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg-soft)] text-[color-mix(in_srgb,var(--arcade-color-neon-cyan)_92%,white)] text-[12px]">
              作品展 / 02
            </p>
            <h1 className="m-[12px_0_0] font-[var(--font-family-tech)] text-[clamp(40px,7vw,78px)] font-[900] leading-[0.94] bg-[linear-gradient(90deg,var(--arcade-color-neon-cyan),var(--arcade-color-neon-pink),var(--arcade-color-neon-purple))] [-webkit-background-clip:text] [background-clip:text] [text-fill-color:transparent] [filter:drop-shadow(0_0_22px_color-mix(in_srgb,var(--arcade-color-neon-pink)_45%,transparent))]">
              蒸汽波记忆
            </h1>
            <p className="max-w-[58ch] m-[16px_0_0] text-[color-mix(in_srgb,var(--arcade-text-primary)_88%,white)] leading-[1.86]">
              开局会先扫一遍全牌，之后就靠记忆完成配对。连击越高，得分越高，关键时刻还能再开一次扫频补救。
            </p>
            <div className="mt-[18px] flex flex-wrap gap-2.5">
              <Tag color="magenta" className="ui-tag">
                蒸汽波氛围
              </Tag>
              <Tag color="cyan" className="ui-tag">
                连击计分
              </Tag>
              <Tag color="gold" className="ui-tag">
                扫频预览
              </Tag>
            </div>
            <div className="mt-[22px] flex flex-wrap gap-2.5 max-[720px]:gap-3">
              <Button
                className="border-none text-[var(--arcade-text-inverse)] bg-[linear-gradient(90deg,var(--arcade-color-neon-cyan),var(--arcade-color-neon-pink),var(--arcade-button-end))] ui-button-cta max-[720px]:w-full"
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => resetGame()}
              >
                开始这一局
              </Button>
              <Button
                className="border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg-strong)] text-[var(--arcade-text-strong)] ui-button-cta max-[720px]:w-full"
                icon={<ThunderboltOutlined />}
                onClick={triggerScan}
                disabled={previewActive || scanCharges <= 0 || matchedPairs === totalPairs}
              >
                开启扫频
              </Button>
              <Link
                to="/"
                className="border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg-strong)] text-[var(--arcade-text-strong)] ui-button-secondary ui-button-cta max-[720px]:w-full"
              >
                <ArrowLeftOutlined aria-hidden="true" />
                返回首页
              </Link>
            </div>
          </div>

          <aside className="border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg)] shadow-[var(--arcade-shadow-panel)] backdrop-blur-[16px] rounded-[28px] p-6">
            <div className="mb-0 pb-0">
              <span className="block mb-3 text-[11px] text-[var(--arcade-text-label)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
                难度选择
              </span>
              <Segmented
                block
                options={DIFFICULTY_OPTIONS}
                value={difficulty}
                className="bg-[var(--arcade-surface-segmented)] rounded-[16px] p-1.5"
                onChange={value => handleDifficultyChange(value as Difficulty)}
              />
            </div>
            <div className="mb-0 pb-0">
              <span className="block mb-3 text-[11px] text-[var(--arcade-text-label)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
                舞台主题
              </span>
              <Segmented
                block
                options={themeOptions}
                value={themeKey}
                className="bg-[var(--arcade-surface-segmented)] rounded-[16px] p-1.5"
                onChange={value => handleThemeChange(value as ThemeKey)}
              />
              <p className="m-[10px_0_0] text-[var(--arcade-text-dim)] leading-[1.7] text-[14px]">
                {theme.hint}
              </p>
            </div>
            <div className="mt-[18px] grid grid-cols-2 gap-2.5 max-[720px]:grid-cols-1">
              <article className="border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg-soft)] rounded-[20px] p-4">
                <span className="block text-[color-mix(in_srgb,var(--white-alpha-60))] text-[12px]">
                  扫频次数
                </span>
                <strong className="block mt-2 font-[var(--font-family-tech)] text-[clamp(22px,3vw,30px)] text-[var(--arcade-text-strong)]">
                  {scanCharges}
                </strong>
              </article>
              <article className="border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg-soft)] rounded-[20px] p-4">
                <span className="block text-[color-mix(in_srgb,var(--white-alpha-60))] text-[12px]">
                  最佳连击
                </span>
                <strong className="block mt-2 font-[var(--font-family-tech)] text-[clamp(22px,3vw,30px)] text-[var(--arcade-text-strong)]">
                  {bestStreak}
                </strong>
              </article>
            </div>
          </aside>
        </header>

        <section className="mt-[18px] grid gap-3 min-[1081px]:grid-cols-4 max-[1080px]:grid-cols-2 max-[720px]:grid-cols-1">
          <article className="border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg)] shadow-[var(--arcade-shadow-panel)] backdrop-blur-[16px] rounded-[20px] p-[18px] text-center">
            <span className="block text-[11px] text-[var(--arcade-color-neon-pink)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
              步数
            </span>
            <strong className="block mt-2 font-[var(--font-family-tech)] text-[clamp(22px,3vw,30px)] text-[var(--arcade-color-neon-cyan)]">
              {moves}
            </strong>
          </article>
          <article className="border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg)] shadow-[var(--arcade-shadow-panel)] backdrop-blur-[16px] rounded-[20px] p-[18px] text-center">
            <span className="block text-[11px] text-[var(--arcade-color-neon-pink)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
              用时
            </span>
            <strong className="block mt-2 font-[var(--font-family-tech)] text-[clamp(22px,3vw,30px)] text-[var(--arcade-color-neon-cyan)]">
              {timerText}
            </strong>
          </article>
          <article className="border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg)] shadow-[var(--arcade-shadow-panel)] backdrop-blur-[16px] rounded-[20px] p-[18px] text-center">
            <span className="block text-[11px] text-[var(--arcade-color-neon-pink)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
              连击
            </span>
            <strong className="block mt-2 font-[var(--font-family-tech)] text-[clamp(22px,3vw,30px)] text-[var(--arcade-color-neon-cyan)]">
              {streak}
            </strong>
          </article>
          <article className="border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg)] shadow-[var(--arcade-shadow-panel)] backdrop-blur-[16px] rounded-[20px] p-[18px] text-center">
            <span className="block text-[11px] text-[var(--arcade-color-neon-pink)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
              得分
            </span>
            <strong className="block mt-2 font-[var(--font-family-tech)] text-[clamp(22px,3vw,30px)] text-[var(--arcade-color-neon-cyan)]">
              {score}
            </strong>
          </article>
        </section>

        <section className="mt-[18px]">
          <div className="grid gap-2.5 rounded-[24px] p-[14px] min-[1201px]:grid-cols-4 min-[721px]:grid-cols-2 max-[720px]:grid-cols-1">
            <div>
              <span className="block text-[10px] text-[var(--arcade-text-subtle)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
                当前成对数
              </span>
              <strong className="block text-[22px] text-[var(--arcade-text-strong)]">
                {matchedPairs} / {totalPairs}
              </strong>
            </div>
            <div>
              <span className="block text-[10px] text-[var(--arcade-text-subtle)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
                准确率
              </span>
              <strong className="block text-[22px] text-[var(--arcade-text-strong)]">
                {accuracy}%
              </strong>
            </div>
            <div>
              <span className="block text-[10px] text-[var(--arcade-text-subtle)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
                模式说明
              </span>
              <strong className="block text-[22px] text-[var(--arcade-text-strong)]">
                {previewActive ? '扫频预览中' : '正式记忆局'}
              </strong>
            </div>
            <div>
              <span className="block text-[10px] text-[var(--arcade-text-subtle)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
                舞台进度
              </span>
              <strong className="block text-[22px] text-[var(--arcade-text-strong)]">
                {progressPercent}%
              </strong>
            </div>
          </div>

          <main
            className={`vapor-memory__board-shell relative mt-[14px] min-h-[520px] overflow-hidden rounded-[32px] p-[30px] max-[720px]:min-h-0 max-[720px]:rounded-[22px] max-[720px]:px-[14px] max-[720px]:pb-[22px] max-[720px]:pt-[18px] ${previewActive ? 'is-previewing' : ''}`}
          >
            {flashMessage ? (
              <div
                className={`vapor-memory__flash vapor-memory__flash--${flashMessage.tone}`}
                key={flashMessage.id}
              >
                {flashMessage.text}
              </div>
            ) : null}

            {matchedPairs === totalPairs ? (
              <div className="vapor-memory__celebration">
                {celebrationBits.map(item => (
                  <span
                    key={item.id}
                    className="vapor-memory__celebration-bit"
                    style={{
                      left: item.left,
                      animationDelay: item.delay,
                      animationDuration: item.duration,
                      transform: `rotate(${item.rotate})`
                    }}
                  />
                ))}
              </div>
            ) : null}

            <div
              className="vapor-memory__grid relative z-[2] mx-auto grid w-full max-w-[860px] gap-2.5 max-[720px]:gap-2"
              style={{ gridTemplateColumns: `repeat(${difficulty}, minmax(0, 1fr))` }}
            >
              {cards.map(card => {
                const isVisible = previewActive || card.flipped || card.matched

                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`vapor-memory__card ${isVisible ? 'is-visible' : ''} ${card.matched ? 'is-matched' : ''} ${card.wrong ? 'is-wrong' : ''}`}
                    onClick={() => handleCardClick(card.id)}
                    aria-label={`翻开 ${card.glyph.label}`}
                  >
                    <span className="vapor-memory__card-inner">
                      <span className="vapor-memory__card-face vapor-memory__card-back">
                        <span className="vapor-memory__card-back-glow" />
                        <span className="vapor-memory__card-back-icon">✦</span>
                        <span className="vapor-memory__card-back-label">点击翻开</span>
                      </span>
                      <span className="vapor-memory__card-face vapor-memory__card-front">
                        <span
                          className="vapor-memory__card-icon"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(card.glyph.icon) }}
                        />
                        <span className="vapor-memory__card-title">{card.glyph.label}</span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </main>
        </section>
      </div>

      <Modal
        open={winOpen}
        footer={null}
        centered
        onCancel={() => setWinOpen(false)}
        className="vapor-memory__modal"
      >
        <div className="p-[30px_28px_12px] text-center text-[var(--arcade-text-strong)]">
          <p className="m-0 text-[11px] text-[color-mix(in_srgb,var(--arcade-color-neon-cyan)_88%,white)] font-[var(--font-family-tech)] tracking-[0.16em] uppercase">
            舞台收官
          </p>
          <h2 className="m-[12px_0_0] font-[var(--font-family-tech)] text-[clamp(28px,5vw,42px)]">
            全场已经点亮
          </h2>
          <p className="m-[12px_auto_0] max-w-[30ch] text-[var(--arcade-text-soft)] leading-[1.8]">
            你完成了这轮蒸汽波记忆挑战，当前评级为
            <strong className="ml-1.5 text-[var(--arcade-color-neon-cyan)]">
              {getRank(score)}
            </strong>
            。
          </p>
          <div className="m-[22px_0_0] grid gap-3 min-[721px]:grid-cols-3 max-[720px]:grid-cols-1">
            <div className="rounded-[18px] p-4 bg-[var(--arcade-glass-bg-soft)]">
              <span className="block font-[var(--font-family-tech)] text-[clamp(22px,4vw,30px)] text-[var(--arcade-color-neon-pink)]">
                {score}
              </span>
              <span className="block mt-2 text-[color-mix(in_srgb,var(--white-alpha-60))] text-[11px]">
                总得分
              </span>
            </div>
            <div className="rounded-[18px] p-4 bg-[var(--arcade-glass-bg-soft)]">
              <span className="block font-[var(--font-family-tech)] text-[clamp(22px,4vw,30px)] text-[var(--arcade-color-neon-pink)]">
                {bestStreak}
              </span>
              <span className="block mt-2 text-[color-mix(in_srgb,var(--white-alpha-60))] text-[11px]">
                最佳连击
              </span>
            </div>
            <div className="rounded-[18px] p-4 bg-[var(--arcade-glass-bg-soft)]">
              <span className="block font-[var(--font-family-tech)] text-[clamp(22px,4vw,30px)] text-[var(--arcade-color-neon-pink)]">
                {timerText}
              </span>
              <span className="block mt-2 text-[color-mix(in_srgb,var(--white-alpha-60))] text-[11px]">
                完成时间
              </span>
            </div>
          </div>
          <div className="m-[22px_0_0] flex flex-wrap justify-center gap-3">
            <Button
              className="inline-flex items-center justify-center gap-0.5 h-[42px] px-4.5 rounded-[999px] border-none text-[var(--arcade-text-inverse-strong)] bg-[linear-gradient(90deg,var(--arcade-color-neon-cyan),var(--arcade-color-neon-pink),var(--arcade-button-end-strong))]"
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => resetGame()}
            >
              再来一局
            </Button>
            <Button
              className="inline-flex items-center justify-center gap-0.5 h-[42px] px-4.5 rounded-[999px] border border-solid border-[var(--arcade-glass-border)] bg-[var(--arcade-glass-bg-strong)] text-[var(--arcade-text-strong)]"
              onClick={() => resetGame(difficulty, themeKey)}
            >
              以当前主题重开
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
