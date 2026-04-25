# blog

A personal blog / portfolio built with React 18, TypeScript, and Vite. The repository includes article pages, showcase pages, 3D experiments, and personal profile sections.

## Online

- `https://liuzhipengpeng.gitee.io/blog`

## Local Development

```bash
pnpm dev
pnpm start
pnpm build
pnpm preview
```

Notes:

- Default local URL: `http://127.0.0.1:8081`
- The dev server port is fixed to `8081` in `vite.config.mjs`
- Reuse an existing `8081` dev server before starting a new one

## Tech Stack

- React 18
- TypeScript 5
- Vite 5
- React Router DOM v5
- Ant Design v4
- Tailwind CSS v3
- SCSS
- Three.js / React Three Fiber / Drei
- `src/store` with an RTK-style organization plus `redux-persist`

## Routing and Content

- Routes are centralized in `src/router/router_config.ts`
- `/main/**` content routes are mainly derived from `src/data.ts`
- `/blog` and `/blog-detail` are standalone content entry routes
- Markdown content lives in `src/content/**`

## Quality Gates

```bash
pnpm audit:style
pnpm type-check
pnpm lint
pnpm format:check
pnpm ci:check
```

The current default validation chain includes:

- `audit:style`
- `type-check`
- `lint`
- `format:check`
- `build`

Manual page verification is expected to use Chrome MCP. Playwright is not a required default dependency in the current repository workflow.
