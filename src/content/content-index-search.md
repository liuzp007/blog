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

上周给博客加搜索功能的时候，我盯着几个方案纠结了好一阵。Algolia 太重，Elasticsearch 更别想了，一个个人博客搞这套属于杀鸡用牛刀。后来我想明白一件事，博客搜索根本不需要全文检索，用户搜的无非就是标题、标签、摘要这些元信息。于是思路就清晰了，构建的时候把元数据抽出来生成一个 JSON 文件，前端加载这个文件做匹配，完事。

坦率的讲这个方案能成立，核心就一条，数据集足够小。

## 构建期生成索引

我只留了四个字段，title、summary、tags、slug。正文不收，一个字都不收。为什么？因为收了正文索引体积会膨胀十倍不止，而用户在搜索框里敲的关键词绝大多数都命中在标题和标签上。摘要偶尔能匹配到，但权重本身就低。

生成完之后我会检查 gzip 体积，硬性约束是不超过 50KB。这个数字不是拍脑袋定的，一个搜索索引文件如果连 50KB 都压不住，那说明你收了不该收的东西。

```ts
// scripts/gen-search-index.ts（简化示例）
import fs from 'fs'
const metas = JSON.parse(fs.readFileSync('src/content/manifest.json', 'utf-8'))
const index = metas.map((m: any) => ({
  title: m.title,
  summary: m.summary,
  tags: m.tags,
  slug: m.slug
}))
fs.writeFileSync('public/search-index.json', JSON.stringify(index))
```

说真的这段代码没什么好解释的，读 JSON 写 JSON，中间做个字段裁剪。唯一要留意的是 `manifest.json` 本身是由另一个脚本在构建期生成的，这里只是消费它的产物。

## 前端检索与评分

评分规则很朴素，前缀匹配给 3 分，包含匹配给 1 分，不匹配就是 0。然后标题的权重天然就比标签和摘要高，因为标题的分值是直接加的，而标签是取最大值。这样设计的好处是不需要维护复杂的权重系数，靠字段本身的重要性差异就能拉开排序。

结果只返回前 10 条。我自己的感受是搜索结果超过 10 条用户基本就不会翻了，不如一开始就截断，还能省一轮 DOM 渲染。

```ts
export function searchIndex(
  data: Array<{ title: string; summary: string; tags: string[]; slug: string }>,
  q: string
) {
  const k = q.trim().toLowerCase()
  const score = (t: string) => (t.startsWith(k) ? 3 : t.includes(k) ? 1 : 0)
  return data
    .map(it => ({
      it,
      s: score(it.title) + Math.max(...it.tags.map(score), 0) + score(it.summary)
    }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 10)
    .map(x => x.it)
}
```

这段代码能跑但不算优雅，特别是 `Math.max(...it.tags.map(score),0)` 这一处，如果标签数量特别多会有性能隐患。不过博客文章的标签一般也就三五个，暂时不成问题。

## UI 与状态

搜索框和结果列表都放在博客列表页的顶部，用户一进来就能看到。关键词会同步到 URL 的 `q` 参数里，这样刷新页面搜索状态不会丢，分享链接也能直接带搜索条件。

还有一点我觉得挺重要的，就是索引文件加载失败或者干脆不存在的时候，得有个降级提示。不能用户输入关键词之后页面一片空白，那样体验太差了。

```tsx
<Input.Search placeholder="搜索标题、摘要或标签" onSearch={setQ} allowClear />
```

UI 层面就这么简单一个组件，Ant Design 的 Input.Search 开箱即用，`allowClear` 让用户一键清空搜索词。

## 最后聊聊

整个方案跑下来，索引文件 gzip 后大概十几 KB，搜索响应基本是瞬时的。对于一个几百篇文章的博客来说，这个方案完全够用。如果将来文章量到了几千篇，或者需要全文检索，再考虑引入服务端方案也不迟。技术选型嘛，够用的时候不折腾，不够用的时候再升级，这个节奏我觉得是对的。

你的项目里搜索是怎么做的？纯前端还是有后端支持？
