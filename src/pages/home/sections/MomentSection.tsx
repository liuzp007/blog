export default function MomentSection() {
  return (
    <section className="relative min-h-[200vh] border-t border-zinc-800">
      {/* sticky 内层 */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-zinc-950">
        <div className="text-center">
          {/* Moment 标签 */}
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-amber-400/90">
            Moment
          </span>

          {/* 标题 */}
          <h2 className="text-4xl font-bold text-[#e8e8e8] md:text-5xl lg:text-6xl">
            慢一点，看一眼画面
          </h2>

          {/* 描述 */}
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#888] md:text-lg">
            在代码和文字之间，偶尔停下来，感受一下这个瞬间的画面。 有些东西，不是用逻辑能说清楚的。
          </p>

          {/* 装饰性细线 */}
          <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}
