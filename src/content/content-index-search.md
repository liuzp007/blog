---
slug: content-index-search
title: 构建期索引与前端检索
summary: 用最小数据集生成搜索索引（title/summary/tags/slug），在前端完成纯客户端检索，体积与速度兼顾。
date: 2026-03-23
tags:
  - 技术
  - 索引
  - Vite
visualScene: signal-grid
cover: /blog.png
draft: false
---

开场引言  
站内搜索优先“可用与轻量”。我们在构建期抽取元数据生成 `search-index.json`，前端以关键词匹配完成检索，不依赖服务端，首要目标是稳定与小体积。

## 构建期生成索引

- 仅保留 `title/summary/tags/slug` 四个字段，避免收录正文。  
- 生成后检查 gzip 体积，保障 < 50KB 的约束。

```ts
// scripts/gen-search-index.ts（简化示例）
import fs from 'fs'
const metas = JSON.parse(fs.readFileSync('src/content/manifest.json','utf-8'))
const index = metas.map((m: any) => ({ title: m.title, summary: m.summary, tags: m.tags, slug: m.slug }))
fs.writeFileSync('public/search-index.json', JSON.stringify(index))
```

## 前端检索与评分

- 前缀匹配优先，其次包含匹配；标题权重 > 标签 > 摘要。  
- 结果限制前 10 条，空态清晰可见。

```ts
export function searchIndex(data: Array<{title:string;summary:string;tags:string[];slug:string}>, q: string){
  const k = q.trim().toLowerCase()
  const score = (t:string)=> t.startsWith(k)?3: t.includes(k)?1:0
  return data.map(it => ({ it, s: score(it.title) + Math.max(...it.tags.map(score),0) + score(it.summary) }))
             .filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,10).map(x=>x.it)
}
```

## UI 与状态

- 搜索输入框与结果列表位于 `/main/blog` 顶部；  
- 关键词同步到 URL（`q=xxx`），刷新保持；  
- 失败或索引缺失时给出降级提示。

```tsx
<Input.Search placeholder="搜索标题、摘要或标签" onSearch={setQ} allowClear />
```

## 收尾结语

“小而准”的索引与纯前端检索足以满足博客规模的发现需求，同时留下服务端扩展的空间，不牺牲当前的部署与复杂度。

