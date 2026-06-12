import { useRef } from 'react'
import { useScrollDrivenAnimation } from '@/hooks/useScrollDrivenAnimation'
import WorkCard from '../components/WorkCard'

const WORK_ITEMS = [
  {
    tag: 'Web App',
    title: '智能仪表盘',
    desc: '基于实时数据流的监控面板，支持自定义布局和多维筛选。',
    image: 'https://picsum.photos/seed/work1/600/340',
    href: '#'
  },
  {
    tag: 'Open Source',
    title: '组件设计系统',
    desc: '面向中后台场景的 React 组件库，内置主题引擎与无障碍支持。',
    image: 'https://picsum.photos/seed/work2/600/340',
    href: '#'
  },
  {
    tag: 'Experiment',
    title: '生成式粒子引擎',
    desc: '基于 WebGL 的粒子系统，支持力场、碰撞和音频驱动。',
    image: 'https://picsum.photos/seed/work3/600/340',
    href: '#'
  },
  {
    tag: 'Toolchain',
    title: '构建性能分析器',
    desc: '可视化分析 Vite/Webpack 构建产物，定位体积瓶颈。',
    image: 'https://picsum.photos/seed/work4/600/340',
    href: '#'
  },
  {
    tag: 'Blog',
    title: '博客重构计划',
    desc: '从 Gatsby 迁移到 Vite + React 的全记录，含性能对比。',
    image: 'https://picsum.photos/seed/work5/600/340',
    href: '#'
  },
  {
    tag: 'CLI',
    title: '项目脚手架工具',
    desc: '零配置创建前后端项目模板，集成 lint、test 和 CI。',
    image: 'https://picsum.photos/seed/work6/600/340',
    href: '#'
  }
]

export default function WorkSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useScrollDrivenAnimation<HTMLDivElement>({
    effect: 'rotate3d',
    triggerRef: titleRef
  })

  return (
    <section className="bg-[#0a0a0a] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div ref={titleRef} className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400/90">
            Work
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">最近在做</h2>
          <p className="mt-3 max-w-lg text-sm text-zinc-500">
            一些正在进行或近期完成的项目，涵盖工具链、实验和产品方向。
          </p>
        </div>

        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WORK_ITEMS.map(item => (
            <WorkCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
