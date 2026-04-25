---
slug: seo-rss-site-suite
title: SEO/RSS 三件套落地指南
summary: 以最小脚本生成 sitemap 与 RSS，页面注入 OG 与 JSON‑LD，保证分享与收录的基础可用与可验证。
date: 2026-03-23
tags:
  - SEO
  - 技术
  - Vite
visualScene: signal-grid
cover: /blog.png
draft: false
---

开场引言  
搜索与订阅是内容抵达的两条腿。我们在构建期生成 `sitemap.xml` 与 `rss.xml`，并在文章页注入标准化的 Open Graph 与 JSON‑LD，确保被收录、可分享、可验证。

## Sitemap 与 RSS 生成

```ts
import fs from 'fs'
const metas = JSON.parse(fs.readFileSync('src/content/manifest.json','utf-8'))
const urlset = metas.map((m:any)=>`<url><loc>/main/blog-detail?slug=${m.slug}</loc></url>`).join('')
fs.writeFileSync('public/sitemap.xml', `<urlset>${urlset}</urlset>`)
```

## 页面级 OG 与 JSON‑LD

```tsx
export function Seo({ title, description, url, cover }:{
  title:string; description:string; url:string; cover?:string
}) {
  return (
    <>
      <link rel="canonical" href={url}/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      {cover && <meta property="og:image" content={cover}/>}
    </>
  )
}
```

## 收尾结语

让搜索与订阅“先跑起来”，把验证与回退策略写进流程。以简洁脚本与统一组件完成三件套，能在不引入额外依赖的前提下显著提升内容的抵达率。

