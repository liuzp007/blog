interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  glob: (pattern: string) => Record<string, () => Promise<unknown>>
  globEager: (pattern: string) => Record<string, unknown>
}
