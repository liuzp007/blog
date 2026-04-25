import ContentWrapper from '@/components/content-wrapper'
import { BeautifyCodeList } from '@/components/beautify-code'

const data = {
  1: `Webpack 是一个现代 JavaScript 应用程序的静态模块打包器（bundler）
    它将项目中的所有资源（JavaScript、CSS、图片等）视为模块，并根据依赖关系图进行打包`,
  2: `核心概念：
    · Entry（入口）：指示 Webpack 从哪个模块开始构建依赖图
    · Output（输出）：告诉 Webpack 在哪里输出打包后的 bundle
    · Loader（加载器）：让 Webpack 能够处理非 JavaScript 文件（如 TypeScript、SASS）
    · Plugin（插件）：用于执行范围更广的任务，如打包优化、环境变量注入等`,
  3: `Webpack 的优势：
    · 代码拆分：实现按需加载，优化首屏加载速度
    · 模块化：支持 ES Modules、CommonJS、AMD 等模块格式
    · 资源处理：统一处理各种类型的资源文件
    · 优化功能：代码压缩、Tree Shaking、Source Map 等`,
  4: `// 基本配置
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};`,
  5: `// 现代替代方案
    随着工具链的发展，Webpack 之外的打包工具也在兴起：

    · Vite：更快的开发服务器，使用原生 ESM
    · esbuild：使用 Go 编写，打包速度极快
    · Rollup：专注于库的打包，输出更小
    · Turbopack：基于 Rust，由 Webpack 团队开发`
}

export default function Index() {
  return (
    <ContentWrapper className="code-page" title="Webpack 模块打包器" subtitle="现代前端工程的基石">
      <BeautifyCodeList list={data} />

      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--code-indigo-alpha-10)',
          border: '1px solid var(--code-indigo-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-indigo)', marginBottom: '1rem' }}>🎯 核心工作流程</h3>
        <ol style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            从入口文件开始，递归解析所有{' '}
            <code
              style={{
                background: 'var(--code-indigo-alpha-10)',
                color: 'var(--color-code-indigo)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              import
            </code>{' '}
            /{' '}
            <code
              style={{
                background: 'var(--code-indigo-alpha-10)',
                color: 'var(--color-code-indigo)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              require
            </code>
          </li>
          <li style={{ marginBottom: '0.5rem' }}>构建依赖关系图（Dependency Graph）</li>
          <li style={{ marginBottom: '0.5rem' }}>使用 Loader 转换各种非 JS 资源</li>
          <li style={{ marginBottom: '0.5rem' }}>通过 Plugin 进行优化和生成最终文件</li>
          <li style={{ marginBottom: '0.5rem' }}>输出到 Output 指定的目录</li>
        </ol>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-green-alpha-10)',
          border: '1px solid var(--code-green-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-green)', marginBottom: '1rem' }}>⚡ 常用 Loader</h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: 'var(--white-alpha-80)'
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--code-green-alpha-30)' }}>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-green)' }}
              >
                Loader
              </th>
              <th
                style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-green)' }}
              >
                用途
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>babel-loader</td>
              <td style={{ padding: '0.75rem' }}>转换 ES6+ 代码</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>
                css-loader / style-loader
              </td>
              <td style={{ padding: '0.75rem' }}>处理 CSS 文件</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>
                file-loader / url-loader
              </td>
              <td style={{ padding: '0.75rem' }}>处理图片、字体等文件</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>ts-loader</td>
              <td style={{ padding: '0.75rem' }}>处理 TypeScript 文件</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-violet-alpha-10)',
          border: '1px solid var(--code-violet-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-violet)', marginBottom: '1rem' }}>🔧 性能优化技巧</h3>
        <ul
          style={{ color: 'var(--white-alpha-80)', lineHeight: 1.8, listStyle: 'none', padding: 0 }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>代码分割</strong>：使用{' '}
            <code
              style={{
                background: 'var(--code-violet-alpha-10)',
                color: 'var(--color-code-violet)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              splitChunks
            </code>{' '}
            提取公共代码
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>懒加载</strong>：使用{' '}
            <code
              style={{
                background: 'var(--code-violet-alpha-10)',
                color: 'var(--color-code-violet)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              import()
            </code>{' '}
            动态导入
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>Tree Shaking</strong>：移除未使用的代码（使用 ES Module）
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>压缩</strong>：使用 TerserPlugin 压缩代码
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            • <strong>缓存</strong>：使用{' '}
            <code
              style={{
                background: 'var(--code-violet-alpha-10)',
                color: 'var(--color-code-violet)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              contenthash
            </code>{' '}
            文件名优化缓存
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: 'var(--code-red-alpha-10)',
          border: '1px solid var(--code-red-alpha-30)',
          borderRadius: '12px',
          position: 'relative',
          zIndex: 3
        }}
      >
        <h3 style={{ color: 'var(--color-code-red)', marginBottom: '1rem' }}>🚀 Vite vs Webpack</h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: 'var(--white-alpha-80)'
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--code-red-alpha-30)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-red)' }}>
                特性
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-red)' }}>
                Webpack
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-code-red)' }}>
                Vite
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem' }}>开发服务器启动</td>
              <td style={{ padding: '0.75rem', color: 'var(--code-page-warning)' }}>较慢</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>
                极快（使用 esbuild）
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem' }}>热更新速度</td>
              <td style={{ padding: '0.75rem', color: 'var(--code-page-warning)' }}>一般</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>
                即时（原生 ESM）
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--code-page-chip-border)' }}>
              <td style={{ padding: '0.75rem' }}>配置复杂度</td>
              <td style={{ padding: '0.75rem', color: 'var(--code-page-warning)' }}>复杂</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>
                简单（约定大于配置）
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem' }}>生态成熟度</td>
              <td style={{ padding: '0.75rem', color: 'var(--color-code-green)' }}>非常成熟</td>
              <td style={{ padding: '0.75rem', color: 'var(--code-page-warning)' }}>快速发展中</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ContentWrapper>
  )
}
