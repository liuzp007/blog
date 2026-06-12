import { GithubOutlined, MailOutlined } from '@ant-design/icons'

const SKILLS = [
  'React',
  'TypeScript',
  'Three.js',
  'GLSL',
  'Node.js',
  'Creative Coding',
  'Figma',
  'WebGL'
]

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
              嗨，我是 ZHOUYI，一名热爱创意编程的前端工程师。白天写业务代码，晚上折腾
              3D、着色器和交互实验。
            </p>
            <p>
              这个博客是我的数字花园，记录技术探索、设计灵感和一些有趣的想法。我相信好的代码不仅是功能的实现，更是一种表达方式。
            </p>
            <p>目前专注于 React 生态、WebGL 可视化和创意交互体验。如果你也对此感兴趣，欢迎交流。</p>
            <p>生活里喜欢摄影、音乐和散步，偶尔会在足迹页面更新一些有趣的瞬间。</p>
          </div>

          {/* 技能标签 */}
          <div className="mt-8 flex flex-wrap gap-2">
            {SKILLS.map(skill => (
              <span
                key={skill}
                className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300"
              >
                {skill}
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
              href="mailto:hello@example.com"
              className="group flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 transition-colors hover:border-amber-500/30 hover:bg-zinc-900/50"
            >
              <MailOutlined className="mt-0.5 text-lg text-amber-400/70" />
              <div>
                <div className="text-sm font-medium text-[#e8e8e8]">邮箱</div>
                <div className="mt-1 text-sm text-[#888] group-hover:text-zinc-300">
                  hello@example.com
                </div>
              </div>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 transition-colors hover:border-amber-500/30 hover:bg-zinc-900/50"
            >
              <GithubOutlined className="mt-0.5 text-lg text-amber-400/70" />
              <div>
                <div className="text-sm font-medium text-[#e8e8e8]">GitHub</div>
                <div className="mt-1 text-sm text-[#888] group-hover:text-zinc-300">
                  github.com/your-username
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
                <div className="mt-1 text-sm text-[#888]">your-wechat-id</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
