import { useRef } from 'react'
import { useScrollDrivenAnimation } from '@/hooks/useScrollDrivenAnimation'
import WorkCard from '../components/WorkCard'

const WORK_ITEMS = [
  {
    tag: '微前端',
    title: '分销通工作台',
    desc: '整合 10+ 异构业务系统的统一管理平台，系统集成周期从 3 个月缩短至 1 个月，运营效率提升 60%。',
    image: 'https://picsum.photos/seed/microapp/600/340'
  },
  {
    tag: 'React Native',
    title: '分销通 APP',
    desc: '面向全球 3000+ 分销商的移动管理平台，日活 2000+，相比原生开发成本降低 40%。',
    image: 'https://picsum.photos/seed/rnapp/600/340'
  },
  {
    tag: 'Next.js',
    title: '交易所平台重构',
    desc: 'SSR 首屏从 3.5s 降至 1.2s，Lighthouse 60→90，页面转化率提升 18%，新用户注册增长 25%。',
    image: 'https://picsum.photos/seed/gateio/600/340'
  },
  {
    tag: 'Three.js',
    title: '交易数据可视化',
    desc: '亿级数据秒级渲染，3D 资产分布图加载从 8s 优化到 3s，年度账单打开率提升 40%。',
    image: 'https://picsum.photos/seed/3dvis/600/340'
  },
  {
    tag: '教育平台',
    title: '宁夏职业教育云',
    desc: '服务 20+ 职业院校、10 万+ 用户，万人同时在线考试，系统稳定性 99.9%。',
    image: 'https://picsum.photos/seed/eduplat/600/340'
  },
  {
    tag: '表单引擎',
    title: '双高计划管理平台',
    desc: '动态表单引擎减少 80% 重复开发，覆盖全国 20+ 双高院校，数据填报效率提升 60%。',
    image: 'https://picsum.photos/seed/formeng/600/340'
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
            近几年主导或深度参与的项目，涵盖微前端、跨端、可视化和教育科技方向。
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
