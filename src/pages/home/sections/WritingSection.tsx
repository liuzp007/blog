import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { allMetas } from '@/features/content/contentCatalog'
import { useScrollDrivenAnimation } from '@/hooks/useScrollDrivenAnimation'

export default function WritingSection() {
  const articles = useMemo(() => {
    const featured = allMetas.filter(m => m.featured)
    const pool = featured.length > 0 ? featured : allMetas
    return pool.slice(0, 4)
  }, [])

  const featured = articles[0]
  const rest = articles.slice(1)

  const titleRef = useRef<HTMLDivElement>(null)
  const contentRef = useScrollDrivenAnimation<HTMLDivElement>({
    effect: 'diagonal',
    triggerRef: titleRef
  })

  return (
    <section className="border-t border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black px-6 py-24 md:px-12 lg:px-20">
      {/* 区块标签 */}
      <div ref={titleRef} className="mx-auto max-w-6xl">
        <span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-amber-400/90">
          Writing
        </span>
        <h2 className="text-3xl font-bold text-[#e8e8e8] md:text-4xl">最近在写</h2>
        <p className="mt-3 max-w-xl text-[#888]">记录一些思考、实践和探索过程，希望能带来启发。</p>
      </div>

      {/* 滚动驱动动画容器 */}
      <div ref={contentRef}>
        {/* Featured 文章 */}
        {featured && (
          <div className="mx-auto mt-12 max-w-6xl">
            <Link
              to={`/blog/${featured.slug}`}
              className="group relative block overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/30 transition-all duration-300 hover:border-amber-500/35 hover:shadow-[0_24px_48px_-24px_rgba(251,191,36,0.12)]"
            >
              {/* 图片覆盖层 */}
              <div className="relative aspect-[2/1] w-full overflow-hidden md:aspect-[3/1]">
                {featured.cover ? (
                  <img
                    src={featured.cover}
                    alt={featured.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                )}
                {/* 底部渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              {/* 文字内容 */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                {featured.category && (
                  <span className="mb-2 inline-block rounded-full bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-400">
                    {featured.category}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white md:text-2xl lg:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-zinc-300 md:text-base">
                  {featured.summary}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                  <span>{featured.date}</span>
                  {featured.readTime > 0 && <span>{featured.readTime} min read</span>}
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* 其余文章三列网格 */}
        {rest.length > 0 && (
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {rest.map(article => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="group rounded-2xl border border-zinc-800/90 bg-zinc-900/30 p-5 transition-all duration-300 hover:border-amber-500/35 hover:shadow-[0_24px_48px_-24px_rgba(251,191,36,0.12)]"
              >
                <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-zinc-800">
                  {article.cover ? (
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800 text-zinc-500">
                      <span className="text-3xl">&#9998;</span>
                    </div>
                  )}
                </div>
                {article.category && (
                  <span className="mb-2 inline-block text-xs font-medium text-amber-400/80">
                    {article.category}
                  </span>
                )}
                <h3 className="text-base font-semibold text-[#e8e8e8] group-hover:text-amber-400/90 md:text-lg">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#888]">{article.summary}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                  <span>{article.date}</span>
                  {article.readTime > 0 && <span>{article.readTime} min read</span>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 查看全部 */}
        <div className="mx-auto mt-12 max-w-6xl text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-400/80 transition-colors hover:text-amber-400"
          >
            查看全部文章
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
