import { useMemo } from 'react'

/** 占位留言数据 */
const GUEST_MESSAGES = [
  {
    id: 1,
    avatar: 'L',
    email: 'l***@gmail.com',
    source: 'Google',
    content: '博客写得很用心，Three.js 那篇帮我解决了一个困扰很久的问题，感谢分享！'
  },
  {
    id: 2,
    avatar: 'Z',
    email: 'z***@outlook.com',
    source: 'Direct',
    content: '首页的交互体验太棒了，加载出来那一刻真的惊艳到我了。'
  },
  {
    id: 3,
    avatar: 'W',
    email: 'w***@qq.com',
    source: 'WeChat',
    content: '特别喜欢你的设计风格，深色主题做得很有质感，想请教一下配色思路。'
  },
  {
    id: 4,
    avatar: 'M',
    email: 'm***@163.com',
    source: 'Direct',
    content: '创意编程这个方向很有意思，看了你的作品集之后也想去学 WebGL 了。'
  },
  {
    id: 5,
    avatar: 'C',
    email: 'c***@foxmail.com',
    source: 'Google',
    content: '文章里的代码示例很清晰，照着做了一遍效果不错，期待更多教程。'
  },
  {
    id: 6,
    avatar: 'Y',
    email: 'y***@icloud.com',
    source: 'Direct',
    content: '足迹页面的地图效果太酷了，这种数据可视化做得很有沉浸感。'
  },
  {
    id: 7,
    avatar: 'S',
    email: 's***@gmail.com',
    source: 'GitHub',
    content: '在 GitHub 上看到了你的项目，代码组织得很好，学到了不少工程化实践。'
  },
  {
    id: 8,
    avatar: 'K',
    email: 'k***@outlook.com',
    source: 'Direct',
    content: '信号站这个名字很有意思，内容也像信号一样传递了很多有价值的想法。'
  },
  {
    id: 9,
    avatar: 'R',
    email: 'r***@qq.com',
    source: 'WeChat',
    content: '博客的阅读体验非常舒适，从排版到字体都很讲究，收藏了。'
  },
  {
    id: 10,
    avatar: 'D',
    email: 'd***@gmail.com',
    source: 'Google',
    content: '关于 GSAP 动画那篇写得深入浅出，连我这种新手都能看懂，已分享给朋友。'
  }
]

/** 单个留言卡片 */
function VoiceCard({
  avatar,
  email,
  source,
  content
}: {
  avatar: string
  email: string
  source: string
  content: string
}) {
  return (
    <div className="w-64 shrink-0 rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-4 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50">
      {/* 头部：头像 + 邮箱 + 来源 */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-sm font-semibold text-amber-400">
          {avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm text-zinc-300">{email}</div>
        </div>
        <span className="shrink-0 rounded-full bg-zinc-700/50 px-2 py-0.5 text-[10px] text-zinc-400">
          {source}
        </span>
      </div>
      {/* 引用内容 */}
      <blockquote className="mt-3 border-l-2 border-zinc-700 pl-3 text-sm leading-relaxed text-zinc-400">
        {content}
      </blockquote>
    </div>
  )
}

/** 跑马灯行 */
function MarqueeRow({
  items,
  reverse = false
}: {
  items: typeof GUEST_MESSAGES
  reverse?: boolean
}) {
  const animClass = reverse ? 'animate-marquee-reverse' : 'animate-marquee'

  return (
    <div
      className="overflow-hidden [--duration:60s] [--gap:1rem]"
      style={{ '--duration': '60s', '--gap': '1rem' } as React.CSSProperties}
    >
      <div className={`flex gap-4 ${animClass} w-max`}>
        {/* 重复 2 次实现无缝循环 */}
        {[...items, ...items].map((msg, i) => (
          <VoiceCard
            key={`${msg.id}-${i}`}
            avatar={msg.avatar}
            email={msg.email}
            source={msg.source}
            content={msg.content}
          />
        ))}
      </div>
    </div>
  )
}

export default function VoicesSection() {
  // 将留言分成 4 行
  const rows = useMemo(() => {
    const result: (typeof GUEST_MESSAGES)[] = [[], [], [], []]
    GUEST_MESSAGES.forEach((msg, i) => {
      result[i % 4].push(msg)
    })
    return result
  }, [])

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950 py-24">
      <div className="px-6 md:px-12 lg:px-20">
        {/* 区块标签 */}
        <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-amber-400/90">
          Voices
        </span>
        <h2 className="text-3xl font-bold text-[#e8e8e8] md:text-4xl">访客与反馈</h2>
        <p className="mt-3 max-w-xl text-[#888]">
          来自世界各地访客的留言，每一条都认真看过，感谢你们的反馈。
        </p>
      </div>

      {/* 4 行跑马灯，交替正反向 */}
      <div className="mt-12 space-y-4">
        {rows.map((row, i) => (
          <MarqueeRow key={i} items={row} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  )
}
