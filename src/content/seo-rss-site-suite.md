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

上周有个朋友给我发消息，说他博客写了好几个月，Google 搜索里愣是找不到一篇文章。我问他有没有 sitemap，有没有 RSS，他沉默了三秒钟回了我一个字，没有。

说实话我特别理解这种沉默。你花了大量时间写内容，调整排版，挑封面图，结果搜索引擎和订阅工具压根不知道你这些内容存在。这感觉就像你精心准备了一桌菜，结果客人连门都找不到。

搜索和订阅是内容抵达的两条腿，缺一条都瘸着走。我们今天聊的东西不复杂，就是在构建期把 sitemap.xml 和 rss.xml 生成出来，然后在文章页注入标准化的 Open Graph 和 JSON-LD。保证你的内容能被收录，能被分享，分享出去的时候还能有个像样的预览卡。

## Sitemap 与 RSS 生成

坦率的讲，很多人一听 SEO 就觉得是个特别庞大的工程，要搞什么关键词策略、外链建设、结构化数据铺排。那些当然重要，但对于个人站或者小团队来说，先把最基础的事情做了，效果就已经很不一样了。

sitmap 这玩意其实就是在告诉搜索引擎，你站上有哪些页面。没有它，搜索引擎就得自己去爬，爬不到了就收录不到，逻辑就这么简单。

```ts
import fs from 'fs'
const metas = JSON.parse(fs.readFileSync('src/content/manifest.json', 'utf-8'))
const urlset = metas
  .map((m: any) => `<url><loc>/main/blog-detail?slug=${m.slug}</loc></url>`)
  .join('')
fs.writeFileSync('public/sitemap.xml', `<urlset>${urlset}</urlset>`)
```

你看，十几行代码就搞定了。从 content manifest 里读出所有文章的元数据，拼成标准 sitemap 格式，写到 public 目录下。构建的时候 Vite 会原样复制到产物里，完事。

RSS 也一样，把你最近的文章按 RSS 2.0 格式包装一下扔出去就行了。各种 RSS 阅读器、订阅工具就能自动拉到你的更新。

我自己的感受是，很多人不做这一步不是因为难，而是因为不知道。总觉得这些是搜索引擎自己会搞定的事情。但实际上 Google 对个人站和小站的爬取频率非常低，你不主动喂，它真的不知道你更新了什么。

## 页面级 OG 与 JSON‑LD

说到分享这一块，你有没有注意到，有的链接分享到微信或者推特上会有个漂亮的预览卡，有标题有描述有封面图，有的就光秃秃一个链接。差别就在于有没有配置 Open Graph 标签。

```tsx
export function Seo({
  title,
  description,
  url,
  cover
}: {
  title: string
  description: string
  url: string
  cover?: string
}) {
  return (
    <>
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {cover && <meta property="og:image" content={cover} />}
    </>
  )
}
```

这个东西做起来其实特别简单，就是把几个 meta 标签往 head 里一塞。但效果是立竿见影的，你分享出去的链接马上就有人样了。

canonical 标签也很重要，它告诉搜索引擎这个页面的权威地址是什么。避免同一个内容因为参数不同被当成重复页面处理。这块需要注意一下，很多人忽略了 canonical，结果收录了一堆带乱七八糟参数的重复链接，反而稀释了权重。

JSON-LD 我这次没有放代码示例，但思路是一样的，在页面里塞一段结构化数据，告诉搜索引擎这是一篇文章，标题是什么，发布时间是什么，作者是谁。Google 拿到这些信息之后展示起来就更有底气，搜索结果里可能就会出现富摘要，点击率会明显上去。

## 收尾结语

说真的，SEO 三件套这个东西，技术含量不高，但很多人就是拖着不做。可能是觉得不紧急，可能是觉得自己的站太小了做了也没人看。

但我一直觉得，先把基础的事情做了，再谈进阶。你不用一开始就搞什么完美的 SEO 策略，先把 sitemap 挂上去，把 RSS 配好，把 OG 标签加上。让搜索引擎和订阅工具有机会发现你，让分享出去的链接看起来体面一点。

这三件事做完，你内容的触达率就已经比大部分人强了。

先跑起来，比什么都重要。
