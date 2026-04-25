interface ShowFileProps {
  src?: string
}

export default function ShowFile({ src }: ShowFileProps) {
  const hasSrc = Boolean(src)

  return (
    <section
      className="show-file-placeholder ui-card ui-card--compact my-[var(--space-4)] flex min-h-[120px] items-center justify-center border border-dashed border-[var(--glass-border-strong)] bg-[var(--color-surface-muted)] p-[var(--space-6)] text-center shadow-[var(--shadow-xs)]"
      aria-live="polite"
    >
      <p className={hasSrc ? 'ui-body-text' : 'ui-muted-text'}>
        {hasSrc ? `文件：${src}` : '暂无文件'}
      </p>
    </section>
  )
}
