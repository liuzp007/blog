import {
  lazy,
  startTransition,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {
  ArrowRightOutlined,
  BookOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  MailOutlined,
  MenuOutlined,
  RocketOutlined,
  SendOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { Button, Drawer, Form, Input, message } from 'antd'
import TiltCard from '@/components/ui/tilt-card'
import ArticleSignalMediaCard from '@/features/content/ArticleSignalMediaCard'
import { allMetas, allSeries } from '@/features/content/contentCatalog'
import { useIdleMount } from '@/hooks/useIdleMount'
import { usePerformanceTier } from '@/hooks/usePerformanceTier'
import '@/styles/themes/home-pages.css'
import HomeInteractiveDemo from './components/HomeInteractiveDemo'
import LineDog from './components/LineDog'
import SignalWaveOverlay from './components/SignalWaveOverlay'
import {
  HOME_CONTACT_ACTIONS,
  HOME_EXPERIMENTS,
  HOME_SHOWCASES,
  HOME_TIMELINE
} from './homeContent'
import './index.css'
import type { RouteComponentProps } from 'react-router-dom'

const HomeHeroFx = lazy(() => import('./components/HomeHeroFx'))

interface HomeProps {
  history: RouteComponentProps['history']
}

interface NavItem {
  id: string
  label: string
}

interface FooterLink {
  label: string
  action: () => void
}

const SHOWCASE_ICONS = [ThunderboltOutlined, RocketOutlined]

export default function Home({ history }: HomeProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [contactForm] = Form.useForm()
  const [messageApi, messageContextHolder] = message.useMessage()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [navScrolled, setNavScrolled] = useState(false)
  const navScrolledRef = useRef(false)
  const [fxEnabled, setFxEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth > 900 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const performanceTier = usePerformanceTier()
  const fxReady = useIdleMount(300)
  const heroFxEnabled =
    fxEnabled && activeSection === 'hero' && performanceTier === 'high' && fxReady

  const navItems = useMemo<NavItem[]>(
    () => [
      { id: 'hero', label: '首页' },
      { id: 'articles', label: '文章' },
      { id: 'experiments', label: '实验' },
      { id: 'showcase', label: '作品展' },
      { id: 'interactive-demo', label: '互动' },
      { id: 'timeline', label: '轨迹' },
      { id: 'contact', label: '联系' }
    ],
    []
  )

  const featuredArticles = useMemo(() => {
    const base = allMetas.filter(item => item.featured)
    return (base.length ? base : allMetas).slice(0, 3)
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (!element) return
    const headerOffset = window.innerWidth <= 768 ? 88 : 112
    const top = element.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
    setDrawerOpen(false)
  }, [])

  const toRoute = useCallback(
    (path: string) => {
      history.push(path)
      setDrawerOpen(false)
    },
    [history]
  )

  const footerNavLinks = useMemo<FooterLink[]>(
    () => [
      { label: '文章', action: () => scrollToSection('articles') },
      { label: '实验项目', action: () => scrollToSection('experiments') },
      { label: '作品展', action: () => scrollToSection('showcase') },
      { label: '成长轨迹', action: () => scrollToSection('timeline') },
      { label: '联系', action: () => scrollToSection('contact') }
    ],
    [scrollToSection]
  )

  const footerQuickLinks = useMemo<FooterLink[]>(
    () => [
      { label: '博客', action: () => toRoute('/blog') },
      { label: '代码', action: () => toRoute('/main') },
      { label: '关于我', action: () => toRoute('/aboutme') },
      { label: '足迹', action: () => toRoute('/footmark') }
    ],
    [toRoute]
  )

  const handleSound = useCallback(() => {
    const player = audioRef.current
    if (!player) return

    if (soundOn) {
      player.pause()
      setSoundOn(false)
      return
    }

    player
      .play()
      .then(() => setSoundOn(true))
      .catch(() => setSoundOn(false))
  }, [soundOn])

  const handleAutoPlay = useCallback(() => {
    const player = audioRef.current
    if (!player || soundOn) return
    // player.play().then(() => setSoundOn(true)).catch(() => {})
  }, [soundOn])

  const handleContactSubmit = useCallback(
    (values: { name: string; email: string; message: string }) => {
      messageApi.success(`已收到 ${values.name} 的留言，我会尽快查看。`)
      contactForm.resetFields()
    },
    [contactForm, messageApi]
  )

  useEffect(() => {
    const sections = navItems
      .map(item => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const id = entry.target.getAttribute('id')
          if (!id) return
          startTransition(() => setActiveSection(id))
        })
      },
      { threshold: 0.32, rootMargin: '-20% 0px -40% 0px' }
    )

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [navItems])

  useEffect(() => {
    let raf = 0

    const updateScrolled = () => {
      raf = 0
      const next = window.scrollY > 42
      if (navScrolledRef.current === next) return
      navScrolledRef.current = next
      setNavScrolled(next)
    }

    const handleScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(updateScrolled)
    }

    updateScrolled()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateFx = () => {
      setFxEnabled(window.innerWidth > 900 && !media.matches)
    }

    updateFx()
    window.addEventListener('resize', updateFx)
    media.addEventListener('change', updateFx)
    return () => {
      window.removeEventListener('resize', updateFx)
      media.removeEventListener('change', updateFx)
    }
  }, [])

  useEffect(() => {
    let attempted = false
    const tryAutoPlay = () => {
      if (attempted) return
      attempted = true
      handleAutoPlay()
      window.removeEventListener('pointerdown', tryAutoPlay)
      window.removeEventListener('keydown', tryAutoPlay)
    }

    window.addEventListener('pointerdown', tryAutoPlay, { passive: true })
    window.addEventListener('keydown', tryAutoPlay)
    return () => {
      window.removeEventListener('pointerdown', tryAutoPlay)
      window.removeEventListener('keydown', tryAutoPlay)
    }
  }, [handleAutoPlay])

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    )

    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="HomeWrap">
      {messageContextHolder}
      <audio id="myMusic" ref={audioRef} loop>
        <source src="/music/suddenly.mp3" type="audio/mp3" />
      </audio>

      <LineDog />
      <SignalWaveOverlay enabled={heroFxEnabled} />

      <Suspense fallback={null}>
        <HomeHeroFx enabled={heroFxEnabled} />
      </Suspense>

      <div className="home-landing">
        <header className={`hero-nav ${navScrolled ? 'hero-nav--scrolled' : ''}`}>
          <div className="hero-nav__brand">
            <Button
              type="text"
              className="hero-nav__brand-button"
              onClick={() => scrollToSection('hero')}
            >
              <span className="hero-nav__brand-title">信号站</span>
              {/* <span className="hero-nav__brand-subtitle">创意前端游乐场</span> */}
            </Button>
          </div>
          <ul className="nav-links">
            {navItems.map(item => (
              <li key={item.id}>
                <Button
                  type="text"
                  className={`nav-links__button ${activeSection === item.id ? 'nav-links__button--active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </Button>
              </li>
            ))}
            <li>
              <Button type="text" className="nav-links__button" onClick={() => toRoute('/blog')}>
                博客
              </Button>
            </li>
          </ul>
          <div className="hero-nav__actions">
            <Button className="hero-nav__sound" onClick={handleSound}>
              {soundOn ? '🙉' : '听'}
            </Button>
            <Button className="hero-nav__cta" onClick={() => toRoute('/aboutme')}>
              about me
            </Button>
            <Button
              className="hero-nav__menu"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
            />
          </div>
        </header>

        <main>
          <section id="hero" className="home-section home-hero reveal visible">
            <div className="hero-content home-hero__content">
              <span className="hero-tag home-hero__tag ui-eyebrow hero-animate hero-animate--tag">
                Hello world
              </span>
              <h1 className="hero-title home-hero__title ui-display-title hero-animate hero-animate--title">
                <span>探索</span>
                <br />
                <span className="highlight indent">无限的代码</span>
                <br />
                <span>宇宙</span>
              </h1>
              <p className="hero-subtitle home-hero__subtitle ui-lead-text hero-animate hero-animate--subtitle">
                记录灵感，构建未来。
                <br />
                这里是我的数字花园，欢迎光临。
              </p>
              <div className="hero-buttons home-hero__buttons hero-animate hero-animate--buttons flex flex-wrap items-center justify-center gap-[var(--home-gap-compact)] min-[769px]:gap-[var(--home-gap-card)]">
                <Button
                  className="home-hero__primary ui-button-primary ui-button-lg w-full justify-center min-[769px]:w-auto"
                  onClick={() => toRoute('/blog')}
                  icon={<ArrowRightOutlined />}
                >
                  阅读最新文章
                </Button>
                <Button
                  className="home-hero__secondary ui-button-secondary ui-button-lg w-full justify-center min-[769px]:w-auto"
                  onClick={() => scrollToSection('showcase')}
                >
                  进入作品展
                </Button>
              </div>
              <div className="hero-metrics home-hero__metrics hero-animate hero-animate--metrics grid grid-cols-1 gap-2 min-[769px]:grid-cols-2 min-[980px]:gap-3 min-[980px]:grid-cols-4">
                <div className="hero-metrics__card home-hero__metric ui-card ui-card--metric">
                  <span className="ui-overline">文章</span>
                  <strong className="ui-card-title">{allMetas.length}</strong>
                </div>
                <div className="hero-metrics__card home-hero__metric ui-card ui-card--metric">
                  <span className="ui-overline">专题</span>
                  <strong className="ui-card-title">{allSeries.length}</strong>
                </div>
                <div className="hero-metrics__card home-hero__metric ui-card ui-card--metric">
                  <span className="ui-overline">作品</span>
                  <strong className="ui-card-title">{HOME_SHOWCASES.length}</strong>
                </div>
                <div className="hero-metrics__card home-hero__metric ui-card ui-card--metric">
                  <span className="ui-overline">实验</span>
                  <strong className="ui-card-title">{HOME_EXPERIMENTS.length}</strong>
                </div>
              </div>
            </div>
          </section>

          <section
            id="articles"
            className="home-section home-section--deferred home-section--articles home-articles reveal"
          >
            <div className="section-header home-section__head">
              <span className="section-tag home-section__tag ui-eyebrow">精选文章</span>
              <h2 className="section-title home-section__title ui-section-title">精选文章信号源</h2>
              <p className="section-desc home-section__desc ui-muted-text">
                这里会优先展示最近值得一读的内容，点开卡片就能继续往下读。
              </p>
            </div>
            <div className="articles-grid home-articles__grid grid grid-cols-1 gap-[var(--home-gap-card)] min-[769px]:grid-cols-2 min-[769px]:gap-[22px] min-[1201px]:grid-cols-3">
              {featuredArticles.map(item => (
                <ArticleSignalMediaCard
                  key={item.slug}
                  item={item}
                  enabled={fxEnabled}
                  className="home-article-card--signal"
                />
              ))}
            </div>
          </section>

          <section
            id="experiments"
            className="home-experiments home-section--deferred home-section--experiments reveal"
          >
            <div className="container home-experiments__container">
              <div className="section-header home-section__head">
                <span className="section-tag home-section__tag ui-eyebrow">实验工坊</span>
                <h2 className="section-title home-section__title ui-section-title">实验工坊</h2>
                <p className="section-desc home-section__desc ui-muted-text">
                  这里收着一些我常做的空间实验、内容结构和个人展示入口，适合随手逛一逛。
                </p>
              </div>
              <div className="experiments-grid home-experiments__grid grid grid-cols-1 gap-5 min-[1201px]:grid-cols-2">
                {HOME_EXPERIMENTS.map((item, index) => (
                  <TiltCard
                    key={item.title}
                    as="button"
                    className={`experiment-card home-experiment-card ui-card ui-card--feature ui-card--interactive relative flex min-h-[244px] flex-col overflow-hidden home-experiment-card--${(index % 4) + 1}`}
                    maxTilt={8}
                    scale={1.018}
                    lift={8}
                    onClick={() => toRoute(item.path)}
                  >
                    <div className="experiment-icon home-experiment-card__icon">
                      <CompassOutlined />
                    </div>
                    <p className="timeline-year ui-overline">{item.eyebrow}</p>
                    <h3 className="experiment-title home-experiment-card__title ui-card-title">
                      {item.title}
                    </h3>
                    <p className="experiment-desc home-experiment-card__desc ui-body-text">
                      {item.desc}
                    </p>
                    <div className="experiment-tech home-experiment-card__tech flex flex-wrap gap-2">
                      {item.tech.map(tech => (
                        <span
                          key={`${item.title}-${tech}`}
                          className={`tech-badge ui-tag ui-tag--sm ui-tag--glass ui-tag--tone-${item.accent}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="home-experiment-card__bottom mt-auto flex flex-col items-start gap-[var(--home-gap-card)] pt-[var(--home-gap-card)] min-[769px]:flex-row min-[769px]:items-center min-[769px]:justify-between">
                      <span className="home-experiment-card__stat ui-meta-text">{item.stat}</span>
                      <span className="home-experiment-card__cta">
                        进入入口
                        <ArrowRightOutlined aria-hidden="true" />
                      </span>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          </section>

          <section
            id="showcase"
            className="home-section home-section--deferred home-section--showcase home-showcase reveal"
          >
            <div className="section-header home-section__head">
              <span className="section-tag home-section__tag ui-eyebrow">作品展</span>
              <h2 className="section-title home-section__title ui-section-title">作品展</h2>
              <p className="section-desc home-section__desc ui-muted-text">
                四个可以直接上手的小作品，每一页都是不同的玩法和氛围。
              </p>
            </div>
            <div className="home-showcase__grid grid grid-cols-1 gap-5 min-[1201px]:grid-cols-2">
              {HOME_SHOWCASES.map((item, index) => {
                const Icon = SHOWCASE_ICONS[index % SHOWCASE_ICONS.length]
                return (
                  <TiltCard
                    key={item.title}
                    as="button"
                    className={`showcase-card ui-card ui-card--showcase ui-card--interactive ui-card--elevated relative flex min-h-0 flex-col gap-[18px] overflow-hidden max-md:px-[18px] max-md:py-[22px] min-[769px]:min-h-[284px] showcase-card--${item.accent}`}
                    maxTilt={9}
                    scale={1.02}
                    lift={10}
                    onClick={() => toRoute(item.path)}
                  >
                    <div className="showcase-card__top relative z-[1] flex flex-col items-start gap-[var(--home-gap-card)] min-[769px]:flex-row min-[769px]:items-center min-[769px]:justify-between">
                      <div className="showcase-card__badge">
                        <Icon />
                      </div>
                      <span className="showcase-card__eyebrow ui-overline">{item.eyebrow}</span>
                    </div>
                    <div className="showcase-card__body relative z-[1]">
                      <h3 className="showcase-card__title ui-card-title">{item.title}</h3>
                      <p className="showcase-card__desc ui-body-text">{item.desc}</p>
                    </div>
                    <div className="showcase-card__bottom relative z-[1] mt-auto flex flex-col items-start gap-[var(--home-gap-card)] min-[769px]:flex-row min-[769px]:items-end min-[769px]:justify-between">
                      <div className="showcase-card__summary grid w-full justify-items-start gap-[var(--home-gap-compact)] min-[769px]:w-auto">
                        <span className="showcase-card__mode ui-meta-text">{item.mode}</span>
                        <div className="showcase-card__tech flex flex-wrap gap-[var(--home-gap-tag)]">
                          {item.tech.slice(0, 2).map(tech => (
                            <span
                              key={`${item.title}-${tech}`}
                              className={`ui-tag ui-tag--sm ui-tag--glass ui-tag--tone-${item.accent} showcase-card__tag`}
                            >
                              {tech}
                            </span>
                          ))}
                          {item.tech.length > 2 && (
                            <span className="ui-tag ui-tag--sm showcase-card__tag showcase-card__tag--more">
                              +{item.tech.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="showcase-card__cta">
                        打开体验
                        <ArrowRightOutlined aria-hidden="true" />
                      </span>
                    </div>
                  </TiltCard>
                )
              })}
            </div>
          </section>

          <section
            id="interactive-demo"
            className="home-section home-section--deferred home-section--interactive home-interactive-demo reveal"
          >
            <div className="section-header home-section__head">
              <span className="section-tag home-section__tag ui-eyebrow">互动演示</span>
              <h2 className="section-title home-section__title ui-section-title">互动演示</h2>
              <p className="section-desc home-section__desc ui-muted-text">
                鼠标移动会牵引节点，点击会扰动场域，你可以把它当成首页里的一个小玩具。
              </p>
            </div>
            <HomeInteractiveDemo />
          </section>

          <section
            id="timeline"
            className="home-section home-section--deferred home-section--timeline home-timeline reveal"
          >
            <div className="section-header home-section__head">
              <span className="section-tag home-section__tag ui-eyebrow">成长轨迹</span>
              <h2 className="section-title home-section__title ui-section-title">成长轨迹</h2>
              <p className="section-desc home-section__desc ui-muted-text">
                这条时间线记录了我这些年做事方式和表达方向的变化。
              </p>
            </div>
            <div className="timeline-wrapper home-timeline__list relative grid gap-4 pl-7">
              {HOME_TIMELINE.map(item => (
                <article
                  key={`${item.year}-${item.title}`}
                  className="timeline-item home-timeline__item ui-card ui-card--feature ui-card--timeline ui-card--interactive"
                >
                  <span className="timeline-year home-timeline__year ui-overline">{item.year}</span>
                  <h3 className="timeline-title home-timeline__title ui-card-title">
                    {item.title}
                  </h3>
                  <p className="timeline-desc home-timeline__desc ui-body-text">{item.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="home-section home-section--deferred home-section--contact home-contact reveal"
          >
            <div className="section-header home-section__head">
              <span className="section-tag home-section__tag ui-eyebrow">联系方式</span>
              <h2 className="section-title home-section__title ui-section-title">来聊聊</h2>
              <p className="section-desc home-section__desc ui-muted-text">
                如果你想继续聊合作、内容、创意项目，或者只是打个招呼，都可以从这里开始。
              </p>
            </div>
            <div className="contact-wrapper home-contact__grid grid items-start gap-[52px] min-[1201px]:grid-cols-2">
              <div className="contact-info home-contact__info pt-[6px]">
                <h3 className="ui-subsection-title">如果你有想法</h3>
                <p className="ui-muted-text">
                  无论是创意前端、内容体验、实验项目，还是单纯想交流灵感，都欢迎从这里发起对话。
                </p>
                <div className="home-contact__links grid gap-[var(--home-gap-card)]">
                  <Button
                    type="text"
                    className="home-contact__link flex h-auto items-center justify-start gap-3 text-left"
                    onClick={() => toRoute('/aboutme')}
                  >
                    <MailOutlined />
                    <span className="grid gap-[2px]">
                      <strong>经历与合作</strong>
                      <small>在关于我页面查看我的经历、能力方向与协作方式</small>
                    </span>
                  </Button>
                  <Button
                    type="text"
                    className="home-contact__link flex h-auto items-center justify-start gap-3 text-left"
                    onClick={() => toRoute('/aboutme')}
                  >
                    <EnvironmentOutlined />
                    <span className="grid gap-[2px]">
                      <strong>关于我</strong>
                      <small>继续阅读我的背景、表达方式与长期兴趣</small>
                    </span>
                  </Button>
                </div>
                <div className="home-contact__entry-grid mt-[26px] grid grid-cols-1 gap-3 min-[1201px]:grid-cols-2">
                  {HOME_CONTACT_ACTIONS.map(item => (
                    <Button
                      key={item.label}
                      type="text"
                      className="home-contact__entry grid h-auto justify-items-start gap-[6px] text-left"
                      onClick={() => toRoute(item.path)}
                    >
                      <strong>{item.label}</strong>
                      <small>{item.desc}</small>
                    </Button>
                  ))}
                </div>
              </div>
              <Form
                form={contactForm}
                layout="vertical"
                className="contact-form home-contact__panel"
                onFinish={handleContactSubmit}
              >
                <h3 className="home-contact__panel-title ui-subsection-title">给我留言</h3>
                <p className="home-contact__panel-desc ui-muted-text">
                  写几句想说的话，我会从这里看到你的留言。
                </p>
                <Form.Item
                  label="姓名"
                  name="name"
                  className="home-contact__item"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input autoComplete="name" className="ui-input" placeholder="你的名字" />
                </Form.Item>
                <Form.Item
                  label="邮箱"
                  name="email"
                  className="home-contact__item"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '邮箱格式不正确' }
                  ]}
                >
                  <Input autoComplete="email" className="ui-input" placeholder="请输入常用邮箱" />
                </Form.Item>
                <Form.Item
                  label="留言"
                  name="message"
                  className="home-contact__item"
                  rules={[{ required: true, message: '请输入留言内容' }]}
                >
                  <Input.TextArea
                    autoComplete="off"
                    className="ui-input"
                    placeholder="想说的话..."
                    rows={5}
                  />
                </Form.Item>
                <Form.Item className="home-contact__item home-contact__item--submit">
                  <Button
                    htmlType="submit"
                    className="home-contact__submit ui-button-primary ui-button-lg ui-button-block"
                    type="primary"
                    icon={<SendOutlined />}
                  >
                    提交留言
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </section>
        </main>

        <footer className="home-footer">
          <div className="footer-content home-footer__content grid gap-[var(--home-gap-card)] min-[769px]:gap-7 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            <section className="footer-section home-footer__column">
              <h4>信号站</h4>
              <p>这里收着我的文章、实验、作品和一些持续更新中的想法，欢迎随时回来看看。</p>
            </section>
            <section className="footer-section home-footer__column">
              <h4>导航</h4>
              <ul className="footer-links home-footer__links grid gap-2">
                {footerNavLinks.map(item => (
                  <li key={item.label}>
                    <Button type="text" className="home-footer__link" onClick={item.action}>
                      {item.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
            <section className="footer-section home-footer__column">
              <h4>精选链接</h4>
              <ul className="footer-links home-footer__links grid gap-2">
                {footerQuickLinks.map(item => (
                  <li key={item.label}>
                    <Button type="text" className="home-footer__link" onClick={item.action}>
                      {item.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
            <section className="footer-section home-footer__column">
              <h4>灵感来源</h4>
              <div className="inspiration-tags home-footer__tags flex flex-wrap gap-2">
                <span className="inspiration-tag ui-tag ui-tag--sm ui-tag--glass ui-tag--tone-cyan">
                  React
                </span>
                <span className="inspiration-tag ui-tag ui-tag--sm ui-tag--glass ui-tag--tone-gold">
                  Three.js
                </span>
                <span className="inspiration-tag ui-tag ui-tag--sm ui-tag--glass ui-tag--tone-coral">
                  创意编程
                </span>
                <span className="inspiration-tag ui-tag ui-tag--sm ui-tag--glass ui-tag--tone-mint">
                  交互设计
                </span>
                <span className="inspiration-tag ui-tag ui-tag--sm ui-tag--glass ui-tag--tone-cyan">
                  信号系统
                </span>
                <span className="inspiration-tag ui-tag ui-tag--sm ui-tag--glass ui-tag--tone-gold">
                  生成式动态
                </span>
              </div>
            </section>
          </div>
          <div className="footer-bottom home-footer__bottom flex flex-wrap items-center justify-between gap-3">
            <p>信号站 {new Date().getFullYear()} · 以好奇心持续构建</p>
            <div className="social-links home-footer__social inline-flex items-center gap-[var(--home-gap-compact)]">
              <Button
                type="text"
                className="home-footer__icon"
                onClick={() => toRoute('/aboutme')}
                aria-label="关于我"
              >
                <CompassOutlined />
              </Button>
              <Button
                type="text"
                className="home-footer__icon"
                onClick={() => toRoute('/blog')}
                aria-label="博客"
              >
                <BookOutlined />
              </Button>
            </div>
          </div>
        </footer>
      </div>

      <Drawer
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="home-drawer"
        title="导航"
      >
        <div className="home-drawer__list grid gap-[var(--home-gap-compact)]">
          {navItems.map(item => (
            <Button
              key={`drawer-${item.id}`}
              className="home-drawer__item justify-start text-left"
              onClick={() => scrollToSection(item.id)}
            >
              <span>{item.label}</span>
              <small>{item.id}</small>
            </Button>
          ))}
          <Button
            className="home-drawer__item justify-start text-left"
            onClick={() => toRoute('/blog')}
          >
            <span>博客</span>
            <small>文章总览</small>
          </Button>
        </div>
      </Drawer>
    </div>
  )
}
