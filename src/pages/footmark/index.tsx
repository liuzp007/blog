import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FootmarkCityDetail from './components/FootmarkCityDetail'
import FootmarkConsole, { type FootmarkChapterFilter } from './components/FootmarkConsole'
import FootmarkMapScene from './components/FootmarkMapScene'
import { FOOTMARK_CITIES, getFootmarkCityById, getFootmarkWorksByCityId } from './footmarkContent'
import './detail.css'
import './map.css'
import './index.css'

const DEFAULT_CITY_ID = 'hangzhou'

function getInitialViewportState() {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
}

export default function Footmark() {
  const [isMobile, setIsMobile] = useState(getInitialViewportState)
  const [chapterFilter, setChapterFilter] = useState<FootmarkChapterFilter>('all')
  const [activeCityId, setActiveCityId] = useState(DEFAULT_CITY_ID)
  const [detailCityId, setDetailCityId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const updateViewport = () => setIsMobile(mediaQuery.matches)

    updateViewport()
    mediaQuery.addEventListener('change', updateViewport)
    return () => {
      mediaQuery.removeEventListener('change', updateViewport)
    }
  }, [])

  const filteredCities = useMemo(
    () =>
      chapterFilter === 'all'
        ? FOOTMARK_CITIES
        : FOOTMARK_CITIES.filter(city => city.tone === chapterFilter),
    [chapterFilter]
  )

  const activeCity = useMemo(
    () => getFootmarkCityById(activeCityId) ?? filteredCities[0] ?? FOOTMARK_CITIES[0],
    [activeCityId, filteredCities]
  )
  const activeWorks = useMemo(() => getFootmarkWorksByCityId(activeCity.id), [activeCity.id])
  const detailCity = useMemo(
    () => (detailCityId ? getFootmarkCityById(detailCityId) : activeCity),
    [activeCity, detailCityId]
  )
  const detailWorks = useMemo(() => getFootmarkWorksByCityId(detailCity.id), [detailCity.id])

  const handleChapterChange = useCallback(
    (nextChapter: FootmarkChapterFilter) => {
      setChapterFilter(nextChapter)
      const nextCities =
        nextChapter === 'all'
          ? FOOTMARK_CITIES
          : FOOTMARK_CITIES.filter(city => city.tone === nextChapter)
      const shouldResetCity = !nextCities.some(city => city.id === activeCityId)
      if (shouldResetCity && nextCities[0]) setActiveCityId(nextCities[0].id)
    },
    [activeCityId]
  )

  const handleCityChange = useCallback((cityId: string) => {
    setActiveCityId(cityId)
  }, [])

  const handleOpenCity = useCallback((cityId: string) => {
    setActiveCityId(cityId)
    setDetailCityId(cityId)
    setDetailOpen(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setDetailOpen(false)
  }, [])

  return (
    <div className="footmark-cosmos footmark-console-page">
      <header className="footmark-console-page__header">
        <div className="footmark-console-page__headerCopy">
          <span className="footmark-console-page__kicker">Atlas Console · Route Memory</span>
          <h1 className="footmark-console-page__title">把七座城市，整理成可检索的工作地图。</h1>
          <p className="footmark-console-page__intro">
            地图负责空间索引，控制台负责章节、城市与作品档案。你可以按路线阅读，也可以直接筛选某一段成长章节。
          </p>
        </div>
        <div className="footmark-console-page__headerActions">
          <Link
            to="/"
            className="footmark-console-page__backLink ui-button-ghost ui-button-sm ui-button-pill"
          >
            返回首页
          </Link>
          <span className="footmark-console-page__mode">LIVE ROUTE · {activeCity.name}</span>
        </div>
      </header>

      <main className="footmark-console-page__layout">
        <section className="footmark-console-page__mapPanel" aria-label="足迹地图">
          <FootmarkMapScene
            key={isMobile ? 'mobile' : 'desktop'}
            progress={1}
            active
            quality={isMobile ? 'mobile' : 'desktop'}
            activeCityId={activeCity.id}
            showCard={false}
            onCitySelect={handleCityChange}
          />

          <div className="footmark-console-page__mapOverlay" aria-hidden="true">
            <div>
              <span>Current Coordinate</span>
              <strong>{activeCity.name}</strong>
              <p>
                {activeCity.lat.toFixed(2)}°N / {activeCity.lng.toFixed(2)}°E
              </p>
            </div>
          </div>

          <dl className="footmark-console-page__telemetry" aria-label="路线统计">
            <div>
              <dt>Stops</dt>
              <dd>{FOOTMARK_CITIES.length}</dd>
            </div>
            <div>
              <dt>Works</dt>
              <dd>{FOOTMARK_CITIES.reduce((total, city) => total + city.workIds.length, 0)}</dd>
            </div>
            <div>
              <dt>Chapters</dt>
              <dd>04</dd>
            </div>
            <div>
              <dt>Active</dt>
              <dd>{activeCity.name}</dd>
            </div>
          </dl>
        </section>

        <FootmarkConsole
          cities={filteredCities}
          activeCity={activeCity}
          activeWorks={activeWorks}
          chapterFilter={chapterFilter}
          onChapterChange={handleChapterChange}
          onCityChange={handleCityChange}
          onOpenCity={handleOpenCity}
        />
      </main>

      <FootmarkCityDetail
        city={detailCity}
        works={detailWorks}
        open={detailOpen}
        isMobile={isMobile}
        onClose={handleCloseDetail}
      />
    </div>
  )
}
