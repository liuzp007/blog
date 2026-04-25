import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import type { MouseEvent } from 'react'
import clsx from 'clsx'
import { Tooltip, Space } from 'antd'
import {
  HeartOutlined,
  ShareAltOutlined,
  StarOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FireOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import anime from 'animejs'
import './index.css'

export interface ContentItem {
  id: string
  title: string
  description: string
  cover?: string
  tags?: string[]
  author?: {
    name: string
    avatar?: string
  }
  stats?: {
    views?: number
    likes?: number
    stars?: number
    comments?: number
  }
  meta?: {
    date?: string
    readTime?: number
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  }
  link?: string
  featured?: boolean
  trending?: boolean
}

type DifficultyLevel = NonNullable<NonNullable<ContentItem['meta']>['difficulty']>
type ContentCardTagTone = 'neutral' | 'success' | 'warning' | 'danger'

interface ContentCardTagItem {
  key: string
  text: string
  kind: 'topic' | 'difficulty'
  tone: ContentCardTagTone
  difficulty?: DifficultyLevel
}

interface ContentCardProps {
  item: ContentItem
  onLike?: (id: string) => void
  onShare?: (item: ContentItem) => void
  onClick?: (item: ContentItem) => void
}

const DIFFICULTY_TAG_PRESET: Record<
  DifficultyLevel,
  { text: string; tone: Exclude<ContentCardTagTone, 'neutral'>; aliases: string[] }
> = {
  beginner: {
    text: '初级',
    tone: 'success',
    aliases: ['初阶', '入门', '新手', 'beginner']
  },
  intermediate: {
    text: '中级',
    tone: 'warning',
    aliases: ['进阶', '中阶', 'intermediate']
  },
  advanced: {
    text: '高级',
    tone: 'danger',
    aliases: ['高阶', '专家', 'advanced']
  }
}

const normalizeTagText = (value: string) => value.trim().toLowerCase()

const buildDifficultyTag = (difficulty?: DifficultyLevel): ContentCardTagItem | null => {
  if (!difficulty) return null
  const preset = DIFFICULTY_TAG_PRESET[difficulty]
  return {
    key: `difficulty-${difficulty}`,
    text: preset.text,
    kind: 'difficulty',
    tone: preset.tone,
    difficulty
  }
}

const buildTopicTags = (
  tags: string[] | undefined,
  difficultyTag: ContentCardTagItem | null
): ContentCardTagItem[] => {
  if (!tags?.length) return []

  const blockedTokens = new Set<string>()
  const seenTokens = new Set<string>()
  if (difficultyTag?.difficulty) {
    const preset = DIFFICULTY_TAG_PRESET[difficultyTag.difficulty]
    blockedTokens.add(normalizeTagText(difficultyTag.difficulty))
    blockedTokens.add(normalizeTagText(preset.text))
    preset.aliases.forEach(alias => blockedTokens.add(normalizeTagText(alias)))
  }

  return tags
    .map(tag => tag.trim())
    .filter(Boolean)
    .filter(tag => {
      const token = normalizeTagText(tag)
      if (blockedTokens.has(token) || seenTokens.has(token)) return false
      seenTokens.add(token)
      return true
    })
    .slice(0, 3)
    .map(tag => ({
      key: `topic-${tag}`,
      text: tag,
      kind: 'topic' as const,
      tone: 'neutral' as const
    }))
}

const getTagClassName = (tag: ContentCardTagItem) => {
  const classes = ['content-card__tag', `content-card__tag--${tag.kind}`, 'ui-tag', 'ui-tag--sm']

  if (tag.kind === 'topic') {
    classes.push('ui-tag--soft', 'ui-tag--tone-cyan')
  } else {
    classes.push(`ui-tag--${tag.tone}`)
  }

  return clsx(classes)
}

const ACTION_BTN_CLASS =
  'content-card__action-button rounded-md border-none bg-transparent px-2 py-1 text-[var(--white-alpha-60)] transition-colors duration-200 hover:bg-[var(--indigo-alpha-10)] hover:text-[var(--color-indigo-500)] focus-visible:shadow-[0_0_0_2px_var(--focus-ring)]'

const ContentCard: React.FC<ContentCardProps> = ({ item, onLike, onShare, onClick }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [viewCount, setViewCount] = useState(item.stats?.views || 0)
  const cardRef = useRef<HTMLDivElement>(null)

  const difficultyTag = useMemo(
    () => buildDifficultyTag(item.meta?.difficulty),
    [item.meta?.difficulty]
  )
  const topicTags = useMemo(
    () => buildTopicTags(item.tags, difficultyTag),
    [item.tags, difficultyTag]
  )

  const cardClassName = useMemo(
    () =>
      clsx(
        'content-card',
        'ui-card',
        'ui-card--showcase',
        'block mb-6 overflow-hidden border-[var(--white-alpha-10)] bg-[var(--white-alpha-05)] p-0 [backdrop-filter:blur(10px)]',
        onClick && 'content-card--interactive ui-card--interactive'
      ),
    [onClick]
  )

  useEffect(() => {
    if (!item.cover) {
      setImageLoaded(false)
      return
    }

    setImageLoaded(false)
    const img = new Image()
    img.onload = () => setImageLoaded(true)
    img.src = item.cover
  }, [item.cover])

  const handleCardClick = useCallback(() => {
    setViewCount(prev => prev + 1)

    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeInOutQuad'
      })
    }

    onClick?.(item)
  }, [item, onClick])

  const handleLike = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      setIsLiked(prev => !prev)

      anime({
        targets: e.currentTarget,
        scale: [1, 1.2, 1],
        duration: 200,
        easing: 'easeInOutQuad'
      })

      onLike?.(item.id)
    },
    [item.id, onLike]
  )

  const handleShare = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()

      anime({
        targets: e.currentTarget,
        rotate: [0, 360],
        duration: 400,
        easing: 'easeInOutQuad'
      })

      onShare?.(item)
    },
    [item, onShare]
  )

  const handleBookmark = useCallback((e: MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <motion.div
      className={cardClassName}
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { y: -4 } : undefined}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick ? handleCardClick : undefined}
    >
      {/* Cover */}
      {!item.cover ? (
        <div className="content-card__cover-fallback flex h-[200px] items-center justify-center bg-[linear-gradient(135deg,var(--color-code-indigo)_0%,var(--color-code-violet)_100%)] text-[24px] font-bold text-[var(--color-white)]">
          {item.title.charAt(0).toUpperCase()}
        </div>
      ) : (
        <div className="content-card__cover relative h-[200px] overflow-hidden">
          <div
            className="content-card__progressive-image relative h-full overflow-hidden bg-[linear-gradient(135deg,var(--indigo-alpha-10),var(--code-violet-alpha-05))]"
            data-loaded={imageLoaded ? 'true' : 'false'}
          >
            <div className="content-card__skeleton absolute inset-0 bg-[linear-gradient(90deg,var(--white-alpha-05)_0%,var(--white-alpha-10)_50%,var(--white-alpha-05)_100%)] bg-[length:200%_100%]" />
            {item.cover && (
              <img
                className="content-card__cover-image h-full w-full object-cover"
                src={item.cover}
                alt={item.title}
                loading="lazy"
              />
            )}
          </div>
          <div className="content-card__overlay absolute inset-0 flex items-end bg-[linear-gradient(135deg,var(--black-alpha-10),var(--black-alpha-40))] p-4">
            <div className="content-card__overlay-content text-[var(--color-white)]">
              <div className="content-card__overlay-title mb-1 text-[18px] font-semibold">
                {item.title}
              </div>
              <div className="content-card__overlay-meta flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] opacity-80">
                {item.author && (
                  <div className="content-card__meta-item inline-flex items-center gap-1">
                    <UserOutlined />
                    <span>{item.author.name}</span>
                  </div>
                )}
                <div className="content-card__meta-item inline-flex items-center gap-1">
                  <ClockCircleOutlined />
                  <span>{item.meta?.readTime || 0}分钟</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="content-card__content p-5">
        <div className="content-card__header mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="content-card__title mb-1 text-[18px] font-semibold leading-[1.4] text-[var(--color-white)]">
              {item.title}
            </div>
            <div className="content-card__meta flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-[var(--white-alpha-60)]">
              {item.meta?.date && (
                <div className="content-card__meta-item inline-flex items-center gap-1">
                  <ClockCircleOutlined />
                  <span>{item.meta.date}</span>
                </div>
              )}
              {difficultyTag && (
                <span className={getTagClassName(difficultyTag)}>{difficultyTag.text}</span>
              )}
            </div>
          </div>

          <Space>
            {item.featured && (
              <TrophyOutlined className="content-card__status-icon content-card__status-icon--featured" />
            )}
            {item.trending && (
              <FireOutlined className="content-card__status-icon content-card__status-icon--trending" />
            )}
          </Space>
        </div>

        <div className="content-card__description mb-4 overflow-hidden text-[var(--white-alpha-70)] [display:-webkit-box] leading-[1.6] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {item.description}
        </div>

        <div className="content-card__footer flex items-center justify-between gap-3 border-t border-t-[var(--white-alpha-10)] pt-4 max-md:flex-col max-md:items-start">
          <div className="content-card__tags flex flex-wrap gap-2">
            {topicTags.map(tag => (
              <span key={tag.key} className={clsx(getTagClassName(tag), 'm-0')}>
                {tag.text}
              </span>
            ))}
          </div>

          <div className="content-card__actions flex flex-wrap gap-2">
            <Tooltip title={isLiked ? '取消点赞' : '点赞'}>
              <button
                type="button"
                className={clsx(ACTION_BTN_CLASS, isLiked && 'is-active')}
                onClick={handleLike}
              >
                <HeartOutlined />
              </button>
            </Tooltip>

            <Tooltip title="分享">
              <button type="button" className={ACTION_BTN_CLASS} onClick={handleShare}>
                <ShareAltOutlined />
              </button>
            </Tooltip>

            <Tooltip title="收藏">
              <button type="button" className={ACTION_BTN_CLASS} onClick={handleBookmark}>
                <StarOutlined />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {item.stats && (
        <div className="content-card__stats flex items-center justify-between gap-3 border-t border-t-[var(--white-alpha-10)] bg-[var(--white-alpha-02)] px-5 py-4 max-md:flex-col max-md:items-start">
          <div className="content-card__stat-item inline-flex items-center gap-1.5 text-[12px] text-[var(--white-alpha-60)]">
            <EyeOutlined className="content-card__stat-icon text-[var(--color-indigo-500)]" />
            <span className="content-card__stat-value font-medium text-[var(--color-white)]">
              {viewCount.toLocaleString()}
            </span>
          </div>
          <div className="content-card__stat-item inline-flex items-center gap-1.5 text-[12px] text-[var(--white-alpha-60)]">
            <HeartOutlined className="content-card__stat-icon text-[var(--color-indigo-500)]" />
            <span className="content-card__stat-value font-medium text-[var(--color-white)]">
              {item.stats.likes?.toLocaleString() || 0}
            </span>
          </div>
          <div className="content-card__stat-item inline-flex items-center gap-1.5 text-[12px] text-[var(--white-alpha-60)]">
            <StarOutlined className="content-card__stat-icon text-[var(--color-indigo-500)]" />
            <span className="content-card__stat-value font-medium text-[var(--color-white)]">
              {item.stats.stars?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default memo(ContentCard)
