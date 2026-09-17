import { Button, Empty, Select } from 'antd'
import {
  FOOTMARK_CITIES,
  type FootmarkCity,
  type FootmarkTone,
  type FootmarkWork
} from '../footmarkContent'

export type FootmarkChapterFilter = FootmarkTone | 'all'

interface FootmarkConsoleProps {
  cities: FootmarkCity[]
  activeCity: FootmarkCity
  activeWorks: FootmarkWork[]
  chapterFilter: FootmarkChapterFilter
  onChapterChange: (value: FootmarkChapterFilter) => void
  onCityChange: (cityId: string) => void
  onOpenCity: (cityId: string) => void
}

const chapterOptions: { value: FootmarkChapterFilter; label: string }[] = [
  { value: 'all', label: '全部章节' },
  { value: 'origin', label: 'Origin / 起点' },
  { value: 'growth', label: 'Growth / 扩张' },
  { value: 'craft', label: 'Craft / 沉淀' },
  { value: 'horizon', label: 'Horizon / 远望' }
]

const chapterNames: Record<FootmarkChapterFilter, string> = {
  all: '全部路线',
  origin: '起点',
  growth: '扩张',
  craft: '沉淀',
  horizon: '远望'
}

function isFootmarkChapterFilter(value: unknown): value is FootmarkChapterFilter {
  return (
    value === 'all' ||
    value === 'origin' ||
    value === 'growth' ||
    value === 'craft' ||
    value === 'horizon'
  )
}

export default function FootmarkConsole({
  cities,
  activeCity,
  activeWorks,
  chapterFilter,
  onChapterChange,
  onCityChange,
  onOpenCity
}: FootmarkConsoleProps) {
  const totalWorks = FOOTMARK_CITIES.reduce((total, city) => total + city.workIds.length, 0)

  return (
    <aside className="footmark-console" aria-label="足迹控制台">
      <header className="footmark-console__header">
        <div>
          <span className="footmark-console__kicker">Atlas Console</span>
          <h2 className="footmark-console__title">经历索引</h2>
        </div>
        <dl className="footmark-console__stats">
          <div>
            <dt>城市</dt>
            <dd>{FOOTMARK_CITIES.length}</dd>
          </div>
          <div>
            <dt>作品</dt>
            <dd>{totalWorks}</dd>
          </div>
          <div>
            <dt>当前</dt>
            <dd>{activeCity.name}</dd>
          </div>
        </dl>
      </header>

      <div className="footmark-console__filters">
        <label className="footmark-console__filterLabel" htmlFor="footmark-chapter-filter">
          章节筛选
        </label>
        <Select
          id="footmark-chapter-filter"
          className="footmark-console__select"
          value={chapterFilter}
          options={chapterOptions}
          onChange={value => {
            if (isFootmarkChapterFilter(value)) onChapterChange(value)
          }}
        />
      </div>

      <div
        className="footmark-console__cityList"
        role="group"
        aria-label={`当前筛选：${chapterNames[chapterFilter]}`}
      >
        {cities.length ? (
          cities.map(city => {
            const isActive = city.id === activeCity.id

            return (
              <Button
                key={city.id}
                className={`footmark-console__cityButton tone-${city.tone} ${
                  isActive ? 'is-active' : ''
                }`}
                aria-pressed={isActive}
                onClick={() => onCityChange(city.id)}
                title={city.headline}
              >
                <span className="footmark-console__cityName">{city.name}</span>
                <span className="footmark-console__cityMeta">
                  {city.eyebrow} · {city.workIds.length} 组作品
                </span>
              </Button>
            )
          })
        ) : (
          <Empty className="footmark-console__empty" description="当前章节暂无城市" />
        )}
      </div>

      <article className="footmark-console__dossier">
        <span className="footmark-console__dossierKicker">{activeCity.eyebrow}</span>
        <h3 className="footmark-console__dossierCity" aria-live="polite">
          {activeCity.name}
        </h3>
        <p className="footmark-console__dossierHeadline">{activeCity.headline}</p>
        <p className="footmark-console__dossierSummary">{activeCity.summary}</p>

        <dl className="footmark-console__facts">
          <div>
            <dt>章节</dt>
            <dd>{chapterNames[activeCity.tone]}</dd>
          </div>
          <div>
            <dt>坐标</dt>
            <dd>
              {activeCity.lat.toFixed(2)}°N / {activeCity.lng.toFixed(2)}°E
            </dd>
          </div>
          <div>
            <dt>作品</dt>
            <dd>{activeWorks.length} 组</dd>
          </div>
        </dl>

        <div className="footmark-console__works">
          <div className="footmark-console__worksHead">
            <span>代表作品</span>
            <Button
              type="primary"
              className="footmark-console__openButton"
              onClick={() => onOpenCity(activeCity.id)}
              disabled={!activeWorks.length}
            >
              打开城市档案
            </Button>
          </div>

          {activeWorks.length ? (
            activeWorks.map(work => (
              <article key={work.id} className="footmark-console__work">
                <div>
                  <strong>{work.title}</strong>
                  <span>{work.shotAt || '未记录时间'}</span>
                </div>
                <p>{work.description || activeCity.summary}</p>
              </article>
            ))
          ) : (
            <p className="footmark-console__workEmpty">这座城市暂未归档作品。</p>
          )}
        </div>
      </article>
    </aside>
  )
}
