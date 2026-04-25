import { CompassOutlined, FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons'

const STANDARD_CONTENT = [
  {
    id: 'code-convention',
    title: '代码规范',
    desc: '代码风格、命名、格式与组织原则',
    icon: FileTextOutlined,
    items: [
      { title: 'TypeScript 规范', path: '/main', stat: '持续更新' },
      { title: 'React 最佳实践', path: '/main', stat: '持续更新' },
      { title: 'CSS 样式规范', path: '/main', stat: '持续更新' }
    ]
  },
  {
    id: 'method',
    title: '方法论',
    desc: '问题解决思路、架构决策与设计模式',
    icon: ThunderboltOutlined,
    items: [
      { title: '性能优化', path: '/main', stat: '持续更新' },
      { title: '可访问性', path: '/main', stat: '持续更新' },
      { title: '测试策略', path: '/main', stat: '持续更新' }
    ]
  },
  {
    id: 'aesthetic',
    title: '审美判断',
    desc: '设计原则、视觉规范与用户体验',
    icon: CompassOutlined,
    items: [
      { title: '排版原则', path: '/main', stat: '持续更新' },
      { title: '色彩体系', path: '/main', stat: '持续更新' },
      { title: '动效设计', path: '/main', stat: '持续更新' }
    ]
  }
]

import {
  ArrowRightOutlined,
  BookOutlined,
  CodeOutlined,
 ExperimentOutlined
} from '@ant-design/icons'
import { Button } from 'antd'
import type { RouteComponentProps } from 'react-router-dom'
import './index.css'

interface StandardProps {
  history: RouteComponentProps['history']
}

export default function Standard({ history }: StandardProps) {
  const toRoute = (path: string) => {
    history.push(path)
  }

  return (
    <div className="StandardWrap">
      <main className="container pt-[52px] pb-[82px] min-[1201px]:pt-[72px] min-[1201px]:pb-[102px]">
        <section className="section-header mb-[52px] min-[1201px]:mb-[72px]">
          <span className="section-tag ui-eyebrow">规范与方法</span>
          <h1 className="ui-page-title mt-3 mb-4">规范与方法</h1>
          <p className="ui-lead-text">这里是代码规范、个人方法论与审美判断的集合，持续更新中。</p>
        </section>

        <section className="standard-grid grid grid-cols-1 gap-5 min-[1201px]:grid-cols-2 min-[1201px]:gap-7">
          {STANDARD_CONTENT.map(item => {
            const Icon = item.icon
            return (
              <article key={item.id} className="standard-card ui-card ui-card--feature">
                <div className="standard-card__header flex items-center gap-3">
                  <div className="standard-card__icon">
                    <Icon />
                  </div>
                  <div>
                    <h2 className="ui-card-title">{item.title}</h2>
                    <p className="ui-body-text">{item.desc}</p>
                  </div>
                </div>
                <div className="standard-card__list mt-5 grid gap-3">
                  {item.items.map(subItem => (
                    <Button
                      key={subItem.title}
                      type="text"
                      className="standard-card__item justify-between"
                      onClick={() => toRoute(subItem.path)}
                    >
                      <span>{subItem.title}</span>
                      <span className="standard-card__stat">{subItem.stat}</span>
                    </Button>
                  ))}
                </div>
              </article>
            )
          })}
        </section>

        <section className="standard-nav mt-7 min-[1201px]:mt-[102px]">
          <h3 className="ui-subsection-title mb-5">快速入口</h3>
          <div className="grid grid-cols-2 gap-4 min-[1201px]:grid-cols-4">
            <Button
              className="standard-nav__link h-auto"
              type="text"
              icon={<CodeOutlined />}
              onClick={() => toRoute('/main')}
            >
              代码知识
            </Button>
            <Button
              className="standard-nav__link h-auto"
              type="text"
              icon={<BookOutlined />}
              onClick={() => toRoute('/blog')}
            >
              技术文章
            </Button>
            <Button
              className="standard-nav__link h-auto"
              type="text"
              icon={<ExperimentOutlined />}
              onClick={() => toRoute('/footmark')}
            >
              实验记录
            </Button>
            <Button
              className="standard-nav__link h-auto"
              type="text"
              icon={<ArrowRightOutlined />}
              onClick={() => toRoute('/aboutme')}
            >
              关于我
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}