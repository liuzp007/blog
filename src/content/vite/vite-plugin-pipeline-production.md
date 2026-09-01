---
slug: vite-plugin-pipeline-production
title: 从开发到构建：Vite 插件管线与 Rollup 边界的系统理解
summary: Vite 插件不是"Rollup 插件加糖"，而是围绕 dev server 的模块服务与 HMR 失效边界构建的一套执行模型。本文用统一心智解释 resolve/load/transform 到 HTML、HMR、SSR 的全链路，并指出哪些能力属于 Rollup，哪些属于 Vite，如何写出跨环境一致且可治理的插件。
date: 2026-03-24
tags: [vite, 工程化, 插件, rollup, 构建]
category: vite
visualScene: vite-stream
cover: /blog.png
series: vite-engineering-governance
seriesTitle: Vite 工程纵深：从快到可治理
seriesOrder: 3
draft: false
---

事情是这样的。

去年帮一个团队排查构建问题，他们有个 Vite 插件在 dev 里跑得好好的，一上 build 就炸了。代码分割的结果跟本地完全不一样，某些模块莫名其妙被重复打包，HMR 的行为也飘忽不定。我花了一整个下午追踪，最后发现根因特别简单，他们的插件把 dev 和 build 当成了同一条管线的两种参数配置。

坦率的讲，这个误解太常见了。

我自己刚接触 Vite 插件的时候也踩过类似的坑。你以为自己在写一个构建插件，其实你写的是开发服务器的模块处理管线。你以为 dev 和 build 的差异只是快慢之分，其实是语义差异。你以为 Rollup 是 Vite 的底座，其实 Vite 在 dev 里把 Rollup 推到后台，把模块服务抬到了第一位。

我自己的感受是，理解 Vite 插件这件事，最重要的不是记住有哪些 hook 或者怎么写 transform，而是搞清楚两件事。

第一，你能用一句话说清楚一个插件到底在改变什么语义。它影响的是模块解析、加载、转换，还是 HTML 注入、HMR 传播、SSR 行为。第二，你能不能明确判断一个需求到底该用 Vite 插件解决，还是该交给 Rollup 的打包阶段，或者干脆不应该通过插件解决。

这两件事想清楚了，后面很多决策就自然有了答案。

## 先立一个统一心智，Vite 的两条管线不是同一条路

理解 Vite 插件的第一步，是老老实实承认一个事实。Vite 的 dev 和 build，不是同一条管线的不同参数，而是目标完全不同的两条路。

dev 阶段的目标是把源代码以模块为单位喂给浏览器，尽量按需编译，按需传输，改动的时候做最小范围更新。它更像一个变换服务器，不是传统意义上的打包器。

build 阶段的目标是生成可部署的产物，处理代码分割、压缩、输出格式、资源指纹、运行时注入这些事。这条路更像 Rollup 的传统职责，把模块图收敛成少量稳定的输出。

所以写 Vite 插件的时候你脑子里必须有一个明确的判断，你到底是要改变模块服务时的语义，还是要改变产物打包时的语义。这两者经常相关，但绝对不等价。

说真的，一个特别典型的误判是这样的。为了线上产物需要某个 banner 或者某种全局替换，你在 dev 的 transform 里也做了同样的事情。结果呢，HMR 变慢了，source map 变差了，调试的时候定位困难。正确做法往往是让 dev 保持最少干预，把产物语义放到 build 里完成，除非这件事必须在 dev 中可见，比如全局宏决定分支这种。

## 插件的本体，插件容器与三段论

把 Vite 插件想象成一个插件容器会更贴切。它把来自多个插件的 hook 按顺序串起来，形成对每个模块请求的处理链。这个链条最核心的三段是这样的。

resolveId，把 import specifier 解析成可唯一定位的模块 id。不管是相对路径、裸包名还是虚拟 id，都得在这步落实身份。

load，根据模块 id 返回模块内容。可以是字符串、二进制，或者返回 null 交给下一个插件或者默认行为。

transform，把模块内容转换成最终送给浏览器或者交给打包器的形态，同时产出 source map。

三段论的价值在于，你可以把绝大多数插件需求归类到这三段之一。归类之后就能判断它对 module graph 的影响方式。

比如你在 resolveId 里把某些路径别名统一了，实际上是在合并模块 identity。它会影响缓存命中、双份依赖、HMR 边界。你在 load 里引入虚拟模块，实际上是在把运行时依赖变成构建期依赖。它会影响首屏请求数量与失效传播范围。你在 transform 里做字符串替换，实际上是在改变模块语义。它会影响 tree-shaking 和热更新粒度。

下面给一个很小但足够典型的虚拟模块加 transform 示例，用来说明 Vite 插件的工作方式。

```ts
// vite.config.ts（示意）
import { defineConfig, Plugin } from 'vite'

function virtualEnvPlugin(): Plugin {
  const VIRTUAL_ID = 'virtual:app-env'
  const RESOLVED = '\0' + VIRTUAL_ID

  return {
    name: 'virtual-env',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED
      return null
    },
    load(id) {
      if (id === RESOLVED) {
        return `export const mode = ${JSON.stringify(process.env.NODE_ENV || 'development')}`
      }
      return null
    }
  }
}

export default defineConfig({
  plugins: [virtualEnvPlugin()]
})
```

这段代码的语义改变非常明确。它把一个运行时环境读取变成了一个编译期常量模块。你在评审插件的时候就应该问自己，这个模块的 identity 稳定吗？会不会导致 dev 和 build 行为分裂？会不会导致 HMR 失效传播超出预期？

对插件的审查应该围绕语义和边界，而不是围绕有没有实现功能。

## 执行顺序与 enforce，插件顺序是一种系统参数

在真实工程里，插件不是一个，而是几十个。Vite 给了一个关键机制，enforce 的 pre 和 post，再加上插件数组的顺序，决定了每个 hook 的执行先后。

很多团队把顺序当成随便放的事。这会让问题变得不可解释。今天 A 插件先 transform，明天 B 插件先 transform。今天 source map 正常，明天定位偏移。插件顺序其实就是系统参数，你需要像治理系统参数那样治理它。

我一直觉得，应该用两条规则来约束插件顺序。

第一条，能够改变模块 identity 的，比如 resolveId、alias、virtual module，尽量靠前，并且必须稳定。否则会造成缓存与 HMR 的随机性。

第二条，只做语法转换的，比如 TS、JSX、语法糖、纯字符串替换，要尽量放在统一的位置。避免多插件交错导致 map 叠加不可控。

对于团队而言，更关键的是可解释性。你应该能够说明为什么这个插件必须是 pre，为什么这个插件必须放在那之前。当解释缺失的时候，顺序就会变成玄学，最后只能靠试出来。

## Vite 与 Rollup 的边界，哪些属于产物，哪些属于服务

理解边界的实用方法是把需求按产物语义和服务语义拆开来看。

产物语义这一块，Rollup 更擅长。代码分割、输出格式、chunk 命名策略、资源指纹、压缩、treeshaking、静态分析驱动的优化，这些事情交给 Rollup。

服务语义这一块，Vite 更擅长。按需 transform、HTML 注入与开发体验、HMR 的模块传播、SSR 请求时的模块加载、开发代理与中间件，这些事情 Vite 做得更好。

当然这不是绝对的划分。Vite 插件兼容 Rollup 插件模型，很多 hook 在 build 阶段会被 Rollup 调用。但你在设计插件的时候应当刻意区分两个问题。

你是不是在 dev 阶段就做了本该属于产物阶段的全量改写？如果是，你牺牲了 dev 的局部性。

你是不是在 build 阶段依赖了只有 dev 才存在的请求上下文？如果是，你制造了 build 的不确定性。

说个很具体的例子，HTML 注入。在 dev 阶段，HTML 是入口和容器，你经常需要注入某些脚本、meta 或者预加载标记。在 build 阶段，HTML 注入会影响产物结构、缓存策略与安全策略。Vite 提供了 transformIndexHtml 来做这件事，但你必须明确，哪些注入只为 dev 服务，比如调试工具，哪些注入必须进入生产，比如某些运行时配置入口。

```ts
// vite.config.ts（示意）
import { defineConfig, Plugin } from 'vite'

function htmlInjectPlugin(): Plugin {
  return {
    name: 'html-inject',
    transformIndexHtml(html, ctx) {
      const isDev = !!ctx.server
      return html.replace('</head>', `${isDev ? '<meta name="x-debug" content="1" />' : ''}</head>`)
    }
  }
}

export default defineConfig({
  plugins: [htmlInjectPlugin()]
})
```

这里的边界很清晰。dev 才注入 debug meta，build 不注入。你把边界写进代码里，而不是让团队靠口头记忆。

## 从开发到构建的一致性，apply 与可测试的语义

写插件最难的不是写 hook，而是保证 dev、build、SSR 三个环境下的语义一致，或者至少差异可解释。

Vite 支持 apply 的 serve 和 build，或者函数条件。这是一把双刃剑。它可以把差异显式化，也可以把差异变成隐藏分叉。

我建议在插件里刻意用显式分叉加注释原因来替代默认分叉。也就是说，当你写 apply 的时候，你应该能回答为什么 serve 和 build 必须不同。如果你答不上来，你可能是在逃避某个可修复的问题，比如依赖入口不一致、transform 不可重入。

此外，可测试性也非常重要。插件是一种系统性代码，它的 bug 往往影响全项目。你至少需要一个最小验证策略。

用一个最小入口模块验证 resolve、load、transform 是否按预期。

用一个最小 HMR 场景验证 handleHotUpdate 的边界。

用一个最小 build 输出验证产物是否符合预期，chunk、banner、注入这些。

你不一定要为每个插件写完整测试框架，但你至少要能在 repo 里复现它的行为。否则每次升级 Vite、升级插件生态都会变成撞运气。

## SSR 视角，插件不是只服务浏览器

很多团队在引入 SSR 或者混合渲染之后才发现，插件在 SSR 下也会跑，而且跑的语义可能跟浏览器完全不同。原因很简单，SSR 需要在 Node 侧加载模块。Vite 在 SSR 场景下扮演的是按需编译器，它会把模块转换成可在 Node 执行的形态。

这会引出一个关键约束。插件的 transform 应该尽量纯函数化。不要依赖浏览器对象，不要在 transform 阶段访问 window 或者 document，更不要把运行时副作用塞进模块顶层。否则你会在 SSR 时遇到特别诡异的行为，同一模块在不同请求之间共享状态，或者在 dev 和 build 下行为不同。

从插件写法上看，你需要更严格地区分两种东西。

编译期注入，这是安全的。注入常量、注入 import、改写语法。

运行时副作用，这是高风险的。注册全局事件、读写全局单例、修改环境变量。

如果你确实需要 SSR 特殊行为，建议把 SSR 分支写成明确的条件，并在代码旁边解释原因和影响范围。SSR 不是另一个 build，它更像另一个 runtime，插件必须尊重 runtime。

## HMR 视角，handleHotUpdate 的边界是工程治理点

当插件参与 HMR 的时候，最关键的不是能不能热更新，而是热更新的传播范围是否稳定。

handleHotUpdate 给了你一把改变传播范围的刀。你可以决定某个文件变化时，哪些模块需要被标记更新，哪些需要整页刷新。

风险在于什么呢。很多插件为了看起来更灵敏，把传播范围扩大了，最后造成状态丢失、刷新频繁。或者反过来，为了避免刷新把传播范围缩小，导致页面逻辑处于半更新状态。半更新比刷新更危险，因为你会在错误状态上继续开发，自己还浑然不知。

我的建议是把 HMR 当成正确性优先、其次才是速度。你在插件里宁可选择更保守的刷新，也不要让开发环境进入不可解释状态。不可解释状态会吞噬团队的信任，最终大家会关闭 HMR 或者频繁手动刷新，回到低效状态。

这玩意真的不值得冒险。

## 常见误区和反模式

生态越繁荣，越需要边界感。我自己重点警惕以下几类问题。

第一，把插件当成工程万能胶。什么问题都用插件改写，最后模块语义被多层 transform 堆叠，debug 变成噩梦。

第二，在 transform 里做不可重入的副作用。比如依赖全局可变状态、缓存不带 key、读写磁盘不加约束，导致并发和 HMR 下行为漂移。

第三，只在 dev 验证，不在 build 验证。dev 能跑不代表产物正确，尤其是代码分割与条件导出相关问题。

第四，插件顺序无治理。今天能跑，明天换个插件版本顺序变了，map 偏移、双份依赖、HMR 崩溃一起出现。

第五，把 Rollup 期望带到 dev。比如期待在 dev 就生成最终 chunk 结构、期待某些产物级优化在 dev 生效，这会让你设计出错误的插件。

如果你只能改一条，我建议从插件数量与职责入手。每个插件都应该能用一句话说明它改变的语义范围，并且范围尽量单一。插件越单一，可组合性越强，故障定位越容易。

## 写好 Vite 插件的关键是语义边界与可治理性

我一直觉得，Vite 插件的核心不是 API 技巧，而是系统设计。你写插件时真正要回答的问题就那么几个。

我在改变哪一层语义，是解析、加载、转换、HTML、HMR、SSR 还是产物？

这种改变是否会影响模块 identity？如果影响，会不会引入双份依赖或者缓存漂移？

dev 与 build 的差异是否显式、可解释、可复现？团队是否能在 CI 上验证？

插件的顺序是否稳定？是否有清晰理由？是否可以在团队中被理解和维护？

当你用这个问题集审视插件，你会自然地更克制。很多看似应该写插件解决的问题，其实应该回到代码结构、依赖边界与工程规范上解决。插件应该是制度化之后的工具，不是制度缺失时的救火方案。

Vite 的生态会越来越丰富。但生态越丰富，越需要边界感。

对团队来说，真正的竞争力不是我们会写插件，而是我们能把插件带来的系统复杂度管住，并且把复杂度换成稳定的工程收益。

你自己有没有遇到过插件顺序玄学化的情况？你是怎么治理的？
