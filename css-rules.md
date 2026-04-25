个人博客 SCSS + React 开发规范文档
1. 目录结构规范
采用组件级 co-location (就近放置) 原则，样式文件与组件文件放在同一目录下，全局样式单独抽离。

text

src/
├── assets/               # 静态资源 (图片, 字体等)
├── styles/               # 全局样式
│   ├── _variables.scss   # 全局变量 (颜色、字体、间距)
│   ├── _mixins.scss      # 全局 Mixins (响应式、文本省略等)
│   ├── _reset.scss       # 浏览器样式重置
│   ├── _typography.scss  # 博客排版样式 (h1-h6, p, blockquote, code)
│   └── global.scss       # 入口文件 (引入上述文件)
├── components/           # 通用组件
│   └── Button/
│       ├── index.tsx
│       └── index.module.scss
├── pages/                # 页面组件 / 业务组件
│   └── Home/
│       ├── index.tsx
│       ├── ArticleCard.tsx
│       └── ArticleCard.module.scss
└── main.tsx
原则：

组件样式必须使用 .module.scss 后缀，开启 CSS Modules，防止样式污染。
全局工具文件以 _ 下划线开头，表示只作为依赖引入，不直接编译成 css。
2. SCSS 编码规范
2.1 命名规范 (BEM 规范 + CSS Modules)
由于使用了 CSS Modules，其实已经避免了命名冲突，但为了代码可读性，依然建议采用 BEM (Block Element Modifier) 的简化版命名：

Block (块)：组件名 (如 card)
Element (元素)：块内的子元素，用 - 连接 (如 card-title, card-meta)
Modifier (修饰符)：状态或变体，用 -- 连接 (如 card--dark, card--active)
scss

// ArticleCard.module.scss
.card {
  background: #fff;
  border-radius: 8px;

  &-title {
    font-size: 1.25rem;
    color: var(--text-primary);
  }

  &-meta {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  // 修饰符
  &--featured {
    border: 1px solid var(--color-primary);
  }
}
2.2 变量管理
严禁在组件内写死颜色、字体大小。 统一在 _variables.scss 中定义，并通过 :root 结合 CSS 原生变量实现暗黑模式切换。

scss

// styles/_variables.scss
// 定义 SCSS 变量供内部计算使用
 $font-size-base: 16px;
 $spacing-unit: 8px;

// 定义 CSS 变量注入到 :root，供运行时切换主题
:root {
  --color-primary: #1890ff;
  --color-bg: #ffffff;
  --color-text: #333333;
  --color-text-secondary: #666666;
  --header-height: 64px;
}

// 暗黑模式
[data-theme='dark'] {
  --color-primary: #177ddc;
  --color-bg: #141414;
  --color-text: #ffffffd9;
  --color-text-secondary: #ffffff73;
}
2.3 Mixins 封装
博客对排版和响应式要求高，必须封装常用的 Mixins（放在 _mixins.scss 中）：

scss

// styles/_mixins.scss
// 响应式断点 (Mobile First)
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'md' {
    @media (min-width: 768px) { @content; }
  } @else if $breakpoint == 'lg' {
    @media (min-width: 1024px) { @content; }
  }
}

// 多行文本省略
@mixin line-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Flex 居中
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
2.4 嵌套层级限制
SCSS 嵌套严禁超过 3 层！ 层级过深会导致生成的 CSS 选择器过长，影响解析性能。

scss

// ❌ 错误示范 (层级过深)
.card {
  .content {
    .text {
      span {
        color: red;
      }
    }
  }
}

// ✅ 正确示范 (扁平化或使用 BEM)
.card { /* ... */ }
.cardText { /* ... */ }
.cardTextSpan { /* ... */ }
3. React 集成规范
3.1 引入样式
使用 CSS Modules 引入时，统一将样式对象命名为 styles。

tsx

// ✅ 正确
import styles from './ArticleCard.module.scss';

// ❌ 错误
import './ArticleCard.module.scss'; // 这样会失去模块化作用
import css from './ArticleCard.module.scss'; // 命名不统一
3.2 className 的拼接 (使用 classnames)
当有动态类名或多个类名组合时，禁止使用字符串拼接，统一使用 classnames 库。

bash

npm install classnames
npm install -D @types/classnames
tsx

import styles from './ArticleCard.module.scss';
import classNames from 'classnames';

interface ArticleCardProps {
  isFeatured: boolean;
  className?: string;
}

export const ArticleCard = ({ isFeatured, className }: ArticleCardProps) => {
  return (
    <div className={classNames(styles.card, {
      [styles['card--featured']]: isFeatured, // 动态添加修饰符
    }, className)}> {/* 支持外部传入额外类名 */}

      <h2 className={styles['card-title']}>文章标题</h2>
    </div>
  );
};
3.3 样式与逻辑分离原则
严禁在 React 中写内联样式 (除极少数动态计算的值，如动态高度、进度条百分比外)。

tsx

// ❌ 错误示范
<div style={{ fontSize: '16px', color: 'red', marginTop: '10px' }}>内容</div>

// ✅ 正确示范：将固定样式写在 scss 中，如果是动态颜色，使用 CSS 变量
// scss: color: var(--dynamic-color);
// tsx: <div style={{ '--dynamic-color': someColor } as React.CSSProperties}>内容</div>
4. 博客专属排版规范 (Typography)
个人博客的核心是阅读体验。建议在全局样式 _typography.scss 中统一管理 Markdown 渲染后的样式（如果你使用 react-markdown 等库）。

scss

// styles/_typography.scss
.blog-content {
  font-size: 1rem;
  line-height: 1.8; // 重要的阅读体验指标：行高至少 1.6 - 1.8
  color: var(--color-text);
  word-break: break-word;

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.3;
  }

  p {
    margin-bottom: 1.2em;
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;

    &:hover {
      border-bottom-color: var(--color-primary);
    }
  }

  // 代码块
  code {
    background: var(--color-code-bg);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
  }

  pre {
    background: var(--color-pre-bg);
    padding: 1.5em;
    border-radius: 8px;
    overflow-x: auto;

    code {
      background: none;
      padding: 0;
    }
  }

  // 引用块
  blockquote {
    margin: 1.5em 0;
    padding: 0.5em 1.5em;
    border-left: 4px solid var(--color-primary);
    background: var(--color-blockquote-bg);
    color: var(--color-text-secondary);
  }
}
5. 性能与注意事项
弃用 @import：在全局 global.scss 中引入其他文件时，使用 @use 替代 @import（因为 @import 已被 Sass 官方废弃）。
scss

// global.scss
@use 'reset';
@use 'variables';
@use 'typography';
避免过于复杂的 SCSS 计算：SCSS 的数学计算是在编译时进行的。如果你的计算依赖于组件的状态（如 JS 变量），请直接使用 CSS 的 calc() 函数配合 CSS 变量。
图片与字体：如果是小图标，尽量使用 SVG 组件引入，而不是在 SCSS 中写 background-image: url(...)，这样更有利于打包优化。