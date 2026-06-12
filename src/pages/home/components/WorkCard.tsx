interface WorkCardProps {
  tag: string
  title: string
  desc: string
  image: string
  href: string
}

export default function WorkCard({ tag, title, desc, image, href }: WorkCardProps) {
  return (
    <a
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/60 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_32px_-8px_rgba(251,191,36,0.2)]"
    >
      {/* Image */}
      <div className="aspect-video overflow-hidden bg-zinc-800">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <span className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
          {tag}
        </span>
        <h3 className="mt-2 text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{desc}</p>

        {/* Visit button */}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
          访问
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </a>
  )
}
