import { GithubOutlined, MailOutlined } from '@ant-design/icons'

interface SkillItem {
  name: string
  level: '精通' | '熟练' | '了解'
}

const SKILLS: SkillItem[] = [
  { name: 'React 全家桶（Hooks/Context/Redux）', level: '精通' },
  { name: 'TypeScript', level: '精通' },
  { name: '组件化设计与开发', level: '精通' },
  { name: 'Webpack / Vite 构建优化', level: '精通' },
  { name: '首屏加载优化 / 虚拟滚动 / Web Worker', level: '精通' },
  { name: 'React Native 跨端开发', level: '熟练' },
  { name: 'Taro 多端适配', level: '熟练' },
  { name: '微前端（Micro App）', level: '熟练' },
  { name: 'Three.js / ECharts 可视化', level: '熟练' },
  { name: 'ESLint / Prettier / GitHub Actions', level: '熟练' },
  { name: 'Node.js / Express', level: '了解' },
  { name: '低代码平台 / PWA / GraphQL', level: '了解' },
  { name: 'AI 辅助研发（Claude Code、Codex）', level: '熟练' },
  { name: '大模型基础 / LoRA / SFT 微调概念', level: '了解' }
]

const levelColor: Record<string, string> = {
  精通: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  熟练: 'border-cyan-500/30 bg-cyan-500/8 text-cyan-300',
  了解: 'border-zinc-600 bg-zinc-800/50 text-zinc-400'
}

export default function AboutSection() {
  return (
    <section className="border-t border-zinc-800 bg-black px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* 区块标签 */}
        <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-amber-400/90">
          About
        </span>
        <h2 className="text-3xl font-bold text-[#e8e8e8] md:text-4xl">关于</h2>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-5">
        {/* 左侧：个人简介 + 技能标签 */}
        <div className="lg:col-span-3">
          <div className="space-y-4 text-base leading-relaxed text-[#888] md:text-lg">
            <p>
              嗨，我是志鹏，前端开发，坐标太原。写代码之外也喜欢折腾
              3D、动效和交互实验，这个博客就是我放这些东西的地方。
            </p>
            <p>
              白天在公司搬砖，晚上和周末会研究一些感兴趣的技术，偶尔也记录一下踩过的坑和解法。如果你正好路过，觉得某篇文章有用，那就值了。
            </p>
          </div>

          {/* 技能标签 */}
          <div className="mt-8 flex flex-wrap gap-2">
            {SKILLS.map(skill => (
              <span
                key={skill.name}
                className={`rounded-full border px-3 py-1 text-xs ${levelColor[skill.level]}`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* 右侧：联系方式 */}
        <div className="lg:col-span-2">
          <h3 className="mb-6 text-lg font-semibold text-[#e8e8e8]">联系方式</h3>
          <div className="space-y-5">
            {/* 邮箱 */}
            <a
              href="mailto:roc.liu.sx@gmail.com"
              className="group flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 transition-colors hover:border-amber-500/30 hover:bg-zinc-900/50"
            >
              <MailOutlined className="mt-0.5 text-lg text-amber-400/70" />
              <div>
                <div className="text-sm font-medium text-[#e8e8e8]">邮箱</div>
                <div className="mt-1 text-sm text-[#888] group-hover:text-zinc-300">
                  roc.liu.sx@gmail.com
                </div>
              </div>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/Roc-js"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 transition-colors hover:border-amber-500/30 hover:bg-zinc-900/50"
            >
              <GithubOutlined className="mt-0.5 text-lg text-amber-400/70" />
              <div>
                <div className="text-sm font-medium text-[#e8e8e8]">GitHub</div>
                <div className="mt-1 text-sm text-[#888] group-hover:text-zinc-300">
                  github.com/Roc-js
                </div>
              </div>
            </a>

            {/* 微信 */}
            <div className="flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4">
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center text-sm text-amber-400/70">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zM14.57 13.39c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-[#e8e8e8]">微信</div>
                <div className="mt-1 text-sm text-[#888]">LiùZhiPéng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
