# blog

个人博客 / 作品集网站，基于 React 18、TypeScript、Vite 构建，包含技术文章、作品展示、3D 实验页面与个人介绍。

## 在线地址

- `https://liuzhipengpeng.gitee.io/blog`

## 本地开发

```bash
pnpm dev
pnpm start
pnpm build
pnpm preview
```

补充说明：

- 默认开发地址：`http://127.0.0.1:8081`
- 开发服务端口在 `vite.config.mjs` 中固定为 `8081`
- 查看页面实现前，优先复用已启动的 `8081` 服务，不重复启动

## 技术栈

- React 18
- TypeScript 5
- Vite 5
- React Router DOM v5
- Ant Design v4
- Tailwind CSS v3
- SCSS
- Three.js / React Three Fiber / Drei
- `src/store`（RTK 风格组织）+ `redux-persist`

## 路由与内容

- 路由统一定义在 `src/router/router_config.ts`
- `/main/**` 内容路由主要由 `src/data.ts` 菜单结构派生
- `/blog` 与 `/blog-detail` 为独立内容入口
- 文章 Markdown 内容位于 `src/content/**`

## 质量门禁

```bash
pnpm audit:style
pnpm type-check
pnpm lint
pnpm format:check
pnpm ci:check
```

当前默认门禁收口为：

- `audit:style`
- `type-check`
- `lint`
- `format:check`
- `build`

页面人工验收默认使用 Chrome MCP，不把 Playwright 作为当前仓库的默认前置依赖。
