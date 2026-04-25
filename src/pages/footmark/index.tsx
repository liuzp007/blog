import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  CompassOutlined,
  DownOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  PictureOutlined
} from '@ant-design/icons'
import { Button } from 'antd'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import FootmarkCityDetail from './components/FootmarkCityDetail'
import FootmarkCloudScene from './components/FootmarkCloudScene'
import FootmarkMapScene from './components/FootmarkMapScene'
import FootmarkSolarScene from './components/FootmarkSolarScene'
import {
  FOOTMARK_STORY_NODES,
  getFootmarkCityById,
  getFootmarkWorksByCityId
} from './footmarkContent'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

const PHASES = [
  {
    id: 'orbit',
    label: '轨道',
    kicker: 'Orbit / 01',
    icon: GlobalOutlined,
    title: '先从太阳系外缘看自己，再决定向哪颗星球靠近。',
    description:
      '滚动像一条导演时间轴，你不是在切页，而是在沿着轨道推进。宇宙段负责建立尺度感，地球会逐步成为唯一焦点。',
    note: '镜头沿轨道向内压近，先建立尺度，再把注意力收束到地球。',
    statLabel: '镜头速度',
    statValue: '低轨推进'
  },
  {
    id: 'earth',
    label: '地球',
    kicker: 'Earth / 02',
    icon: EnvironmentOutlined,
    title: '把视线从无穷收束到地球，你才会意识到自己也只是其中一个坐标。',
    description:
      '真正重要的不是看过多少宏大背景，而是当镜头贴近地球时，你愿不愿意承认自己还应该去更远的地方继续看看。',
    note: '世界很大，脚下这一颗星球也远比熟悉的日常更辽阔。',
    statLabel: '叙事落点',
    statValue: '对准地球'
  },
  {
    id: 'cloud',
    label: '穿云',
    kicker: 'Atmosphere / 03',
    icon: CompassOutlined,
    title: '当镜头穿过大气层，抽象的方向感开始落回真实空气。',
    description:
      '云层不是过场素材，而是情绪阀门。滚动越深，云会越近、越快、越有压迫感，像一段真正的下坠过程。',
    note: '云层只负责转场，不该洗掉画面；它应该制造坠落感，而不是把页面漂白。',
    statLabel: '转场状态',
    statValue: '高速坠入'
  },
  {
    id: 'map',
    label: '城市',
    kicker: 'City / 04',
    icon: PictureOutlined,
    title: '云层拨开之后，地图不再只是地图，而是一条方法论。',
    description:
      '最后一段不是展示坐标清单，而是把去过的城市重新组织成叙事节点：它们共同构成了你的判断、审美和工作方式。',
    note: '点亮过的城市不是结束，而是下一次出发的提醒。点开它们，看看当时留下了什么。',
    statLabel: '地图密度',
    statValue: '足迹显影'
  }
]

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function segmentProgress(progress: number, start: number, end: number) {
  if (progress <= start) return 0
  if (progress >= end) return 1
  return (progress - start) / (end - start)
}

function sceneOpacity(progress: number, start: number, holdEnd: number, fadeEnd: number) {
  if (progress <= start) return 0
  if (progress <= holdEnd) return 1
  if (progress >= fadeEnd) return 0
  return 1 - (progress - holdEnd) / (fadeEnd - holdEnd)
}

export default function Footmark() {
  const shellRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport, { passive: true })
    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  useLayoutEffect(() => {
    if (!shellRef.current || !stageRef.current) return

    const progressState = { value: 0 }
    const totalDistance = isMobile ? 3200 : 5200

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: shellRef.current,
          start: 'top top',
          end: `+=${totalDistance}`,
          pin: stageRef.current,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })

      timeline
        .to(progressState, {
          value: 0.24,
          duration: 1,
          onUpdate: () => setScrollProgress(progressState.value)
        })
        .to(progressState, {
          value: 0.52,
          duration: 1,
          onUpdate: () => setScrollProgress(progressState.value)
        })
        .to(progressState, {
          value: 0.76,
          duration: 1,
          onUpdate: () => setScrollProgress(progressState.value)
        })
        .to(progressState, {
          value: 1,
          duration: 1,
          onUpdate: () => setScrollProgress(progressState.value)
        })
    }, shellRef)

    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
      setScrollProgress(0)
    }
  }, [isMobile])

  const quality = isMobile ? 'mobile' : 'desktop'
  const solarProgress = segmentProgress(scrollProgress, 0, 0.58)
  const cloudProgress = segmentProgress(scrollProgress, 0.42, 0.78)
  const mapProgress = segmentProgress(scrollProgress, 0.68, 1)

  const solarOpacity = sceneOpacity(scrollProgress, 0, 0.44, 0.66)
  const cloudOpacity = clamp01(1 - Math.abs(scrollProgress - 0.62) / 0.24)
  const mapOpacity = clamp01(segmentProgress(scrollProgress, 0.66, 0.82))

  const phaseIndex =
    scrollProgress < 0.24 ? 0 : scrollProgress < 0.52 ? 1 : scrollProgress < 0.76 ? 2 : 3
  const currentPhase = PHASES[phaseIndex]
  const CurrentPhaseIcon = currentPhase.icon
  const progressNodeIndex = Math.min(
    FOOTMARK_STORY_NODES.length - 1,
    Math.floor(mapProgress * FOOTMARK_STORY_NODES.length)
  )
  const activeNodeIndex = selectedCityId
    ? Math.max(
        FOOTMARK_STORY_NODES.findIndex(item => item.id === selectedCityId),
        0
      )
    : progressNodeIndex
  const activeCityId = selectedCityId || FOOTMARK_STORY_NODES[activeNodeIndex]?.id
  const activeCity = useMemo(
    () => (activeCityId ? getFootmarkCityById(activeCityId) : null),
    [activeCityId]
  )
  const activeWorks = useMemo(
    () => (activeCity ? getFootmarkWorksByCityId(activeCity.id) : []),
    [activeCity]
  )
  const copyShellClassName =
    phaseIndex === 3
      ? 'footmark-cosmos__copy ui-card relative z-[3] ml-7 mt-7 flex w-[min(360px,calc(100%-56px))] flex-col gap-[10px] p-[16px_18px] max-[900px]:ml-4 max-[900px]:w-[calc(100%-32px)] max-[900px]:p-[22px_20px_20px] max-[640px]:ml-3 max-[640px]:mt-3 max-[640px]:w-[calc(100%-24px)] max-[640px]:gap-2 max-[640px]:p-3'
      : 'footmark-cosmos__copy ui-card relative z-[3] ml-7 mt-[clamp(40px,12vh,120px)] flex w-[min(560px,calc(100%-40px))] flex-col gap-4 p-[30px_30px_26px] max-[900px]:ml-4 max-[900px]:w-[calc(100%-32px)] max-[900px]:p-[22px_20px_20px] max-[640px]:mt-7'

  const stageStats = useMemo(
    () => [
      { label: '关键节点', value: `${FOOTMARK_STORY_NODES.length} 座城市` },
      { label: currentPhase.statLabel, value: currentPhase.statValue },
      { label: '滚动进度', value: `${Math.round(scrollProgress * 100)}%` }
    ],
    [currentPhase, scrollProgress]
  )

  const handleOpenCity = useCallback((cityId: string) => {
    setSelectedCityId(cityId)
    setDetailOpen(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setDetailOpen(false)
    setSelectedCityId(null)
  }, [])

  return (
    <div
      className={`footmark-cosmos phase-${currentPhase.id} ${isMobile ? 'is-mobile' : ''} ${phaseIndex === 3 ? 'is-map-phase' : ''}`}
    >
      <div className="footmark-cosmos__scrollShell" ref={shellRef}>
        <div className="footmark-cosmos__stage" ref={stageRef}>
          <div className="footmark-cosmos__sceneStack" aria-hidden="true">
            <div className="footmark-cosmos__sceneWrap" style={{ opacity: solarOpacity }}>
              <FootmarkSolarScene progress={solarProgress} quality={quality} />
            </div>
            <div className="footmark-cosmos__sceneWrap" style={{ opacity: cloudOpacity }}>
              <FootmarkCloudScene progress={cloudProgress} quality={quality} />
            </div>
            <div
              className="footmark-cosmos__sceneWrap footmark-cosmos__sceneWrap--map"
              style={{ opacity: mapOpacity }}
            >
              <FootmarkMapScene
                progress={mapProgress}
                active={scrollProgress > 0.64}
                quality={quality}
                activeCityId={activeCityId}
                onCitySelect={handleOpenCity}
              />
            </div>
            <div className="footmark-cosmos__gradientMask" />
          </div>

          <div
            className={`footmark-cosmos__hud flex items-center justify-between px-7 pt-6 max-[640px]:flex-col max-[640px]:items-stretch ${
              phaseIndex === 3
                ? 'max-[640px]:gap-2 max-[640px]:px-3 max-[640px]:pt-3'
                : 'max-[640px]:gap-2.5 max-[640px]:px-[14px] max-[640px]:pt-[14px]'
            }`}
          >
            <Link
              to="/"
              className="footmark-cosmos__backLink ui-button-ghost ui-button-sm ui-button-pill"
            >
              返回首页
            </Link>
            <div
              className={`footmark-cosmos__progressRail flex gap-3 max-[640px]:grid ${
                phaseIndex === 3
                  ? 'max-[640px]:grid-cols-4 max-[640px]:gap-2'
                  : 'max-[640px]:grid-cols-3'
              }`}
            >
              {PHASES.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`footmark-cosmos__progressStop ${
                    phaseIndex === 3
                      ? 'max-[640px]:min-w-0 max-[640px]:px-0 max-[640px]:py-2 max-[640px]:text-center max-[640px]:text-[11px]'
                      : 'max-[640px]:min-w-0 max-[640px]:text-center'
                  } ${index <= phaseIndex ? 'is-active' : ''}`}
                >
                  <span className="ui-meta-text">{phase.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={copyShellClassName}>
            <span className="footmark-cosmos__eyebrow ui-eyebrow">{currentPhase.kicker}</span>
            <h1 className="footmark-cosmos__titleOverline ui-overline">
              Footmark / Scroll Voyager
            </h1>
            {phaseIndex !== 3 ? (
              <>
                <h2 className="footmark-cosmos__heroTitle ui-display-title">
                  {currentPhase.title}
                </h2>
                <p className="footmark-cosmos__heroDesc ui-lead-text">{currentPhase.description}</p>
              </>
            ) : null}

            <div
              className={`footmark-cosmos__stats grid grid-cols-1 min-[901px]:grid-cols-3 ${
                phaseIndex === 3
                  ? 'mt-0 gap-[10px] max-[640px]:grid-cols-3 max-[640px]:gap-2'
                  : 'mt-1.5 gap-[14px]'
              }`}
            >
              {stageStats.map(item => (
                <article
                  key={item.label}
                  className="footmark-cosmos__statCard ui-card ui-card--compact"
                >
                  <span className="footmark-cosmos__statLabel ui-meta-text">{item.label}</span>
                  <strong className="footmark-cosmos__statValue ui-card-title">{item.value}</strong>
                </article>
              ))}
            </div>
          </div>

          {phaseIndex !== 3 ? (
            <div
              className={`footmark-cosmos__phaseNotes absolute z-[3] bottom-[110px] right-7 grid w-[min(320px,calc(100%-56px))] gap-3 transition-opacity duration-300 max-[900px]:bottom-[180px] max-[900px]:left-4 max-[900px]:right-4 max-[900px]:w-auto max-[640px]:relative max-[640px]:bottom-auto max-[640px]:left-auto max-[640px]:right-auto max-[640px]:mx-4 max-[640px]:mt-[18px] ${phaseIndex === 2 ? 'is-dimmed' : ''}`}
            >
              <div className="footmark-cosmos__note ui-card flex items-start gap-3 rounded-[18px] p-[16px_18px]">
                <CurrentPhaseIcon />
                <span className="ui-body-text-strong">{currentPhase.note}</span>
              </div>
            </div>
          ) : null}

          <div
            className={`footmark-cosmos__storyRail absolute bottom-6 left-7 right-7 grid grid-cols-7 gap-2.5 max-[1280px]:grid-cols-4 max-[900px]:bottom-5 max-[900px]:left-4 max-[900px]:right-4 max-[900px]:grid-cols-2 ${scrollProgress > 0.7 ? 'is-visible' : ''}`}
          >
            {FOOTMARK_STORY_NODES.map((node, index) => (
              <article
                key={node.id}
                className={`footmark-cosmos__storyChip ${index <= activeNodeIndex ? 'is-active' : ''}`}
              >
                <span className="ui-body-text-strong">{node.city}</span>
                <strong className="ui-meta-text">{node.eyebrow}</strong>
              </article>
            ))}
          </div>

          <div
            className={`footmark-cosmos__scrollCue absolute bottom-6 left-7 inline-flex items-center gap-2.5 max-[640px]:bottom-[18px] max-[640px]:left-4 max-[640px]:right-4 max-[640px]:justify-center ${scrollProgress > 0.08 ? 'is-hidden' : ''}`}
          >
            <DownOutlined />
            <span className="ui-meta-text">继续向下，沿着轨道推进到地球和城市</span>
          </div>
        </div>
      </div>

      <main>
        <section className="footmark-cosmos__summary relative z-[2] px-7 pb-24 pt-[72px] max-[640px]:px-4 max-[640px]:pb-[72px] max-[640px]:pt-[54px]">
          <div className="footmark-cosmos__summaryHead ui-card mx-auto mb-7 max-w-[720px] text-center">
            <span className="footmark-cosmos__summaryKicker ui-eyebrow">Route Memory</span>
            <h3 className="footmark-cosmos__summaryTitle ui-section-title">
              地图落地之后，把足迹读成一组方法论。
            </h3>
            <p className="footmark-cosmos__summaryDesc ui-lead-text">
              每座城市都对应一组当时留下的作品、观察和判断。世界很大，而这些小点只是你继续出发的起点。
            </p>
          </div>

          <div className="footmark-cosmos__summaryGrid grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[901px]:grid-cols-3 min-[1281px]:grid-cols-7">
            {FOOTMARK_STORY_NODES.map(node => (
              <article
                key={node.id}
                className={`footmark-cosmos__summaryCard ui-card flex min-h-[240px] flex-col px-[18px] py-[22px] footmark-cosmos__summaryCard--${node.tone}`}
              >
                <span className="footmark-cosmos__summaryTag ui-tag ui-tag--sm self-start">
                  {node.eyebrow}
                </span>
                <h4 className="footmark-cosmos__summaryCity ui-card-title">{node.city}</h4>
                <p className="footmark-cosmos__summaryText ui-body-text">{node.detail}</p>
                <Button
                  type="default"
                  className="footmark-cosmos__summaryAction ui-button-secondary ui-button-sm mt-auto self-start"
                  onClick={() => handleOpenCity(node.id)}
                >
                  查看作品
                </Button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <FootmarkCityDetail
        city={activeCity}
        works={activeWorks}
        open={detailOpen}
        isMobile={isMobile}
        onClose={handleCloseDetail}
      />
    </div>
  )
}
