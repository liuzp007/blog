#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')

const workspaceRoot = path.resolve(__dirname, '..')
const targetDirs = ['src']
const validExt = new Set(['.scss', '.css', '.ts', '.tsx', '.js', '.jsx'])
const styleExt = new Set(['.scss', '.css'])

const allowedRootFiles = new Set([
  'src/styles/tokens/base.css',
  'src/styles/tokens/semantic.css',
  'src/styles/1_tokens/base.css',
  'src/styles/1_tokens/components.css',
  'src/styles/1_tokens/typography.css',
  'src/styles/2_globals/global-ui.css',
  'src/styles/themes/dark.css',
  'src/styles/themes/light.css',
  'src/styles/themes/accessibility.css',
  'src/styles/themes/legacy-shell.css'
])

const protectedGlobalTokenPrefixes = [
  '--raw-',
  '--white-alpha-',
  '--black-alpha-',
  '--font-',
  '--space-',
  '--radius-',
  '--control-',
  '--motion-',
  '--easing-',
  '--color-',
  '--text-',
  '--heading-',
  '--button-',
  '--card-',
  '--tag-',
  '--input-',
  '--bg-',
  '--accent-',
  '--surface-',
  '--brand-',
  '--border-',
  '--status-',
  '--state-',
  '--glass-',
  '--header-',
  '--sidebar-',
  '--shadow-',
  '--focus-',
  '--warning-'
]

const undefinedTokenIgnorePrefixes = ['--tw-', '--ant-']
const colorRegex = /(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\))/g
const rootRegex = /:root\b/g
const tokenRegex = /var\(\s*(--[a-zA-Z0-9-_]+)/g
const customPropertyDefinitionRegex = /^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm

const interactivePatterns = [
  {
    name: 'span/div onClick',
    regex: /<(span|div)\b[^>]*\bonClick=/g
  },
  {
    name: 'role="button"',
    regex: /role=["']button["']/g
  }
]

const styleAttributePattern = /style\s*=\s*{['"]([^'"]+)['"]}/g
const focusVisiblePattern = /focus-visible:/g
const arbitraryTailwindPattern = /\[\$[a-zA-Z0-9-]+\]/g
const repeatedArbitraryTailwind = new Map()

const protectedSharedTokens = new Map([
  ['--card-radius', '卡片基础圆角属于共享组件基线，不允许在非授权文件里覆写。'],
  ['--card-gap', '卡片内容节奏属于共享组件基线，不允许在非授权文件里覆写。'],
  ['--card-padding', '卡片默认内边距属于组件基线，页面应优先覆写 `--ui-card-padding`。'],
  ['--heading-display-size', '展示标题尺寸属于排版系统基线，不应在业务层重新定义。'],
  ['--heading-1-size', '一级标题尺寸属于排版系统基线，不应在业务层重新定义。'],
  ['--heading-2-size', '二级标题尺寸属于排版系统基线，不应在业务层重新定义。'],
  ['--heading-3-size', '三级标题尺寸属于排版系统基线，不应在业务层重新定义。'],
  ['--heading-4-size', '四级标题尺寸属于排版系统基线，不应在业务层重新定义。'],
  ['--heading-card-size', '卡片标题字号已经属于共享组件基线，不应在业务层重新定义。'],
  ['--heading-card-line-height', '卡片标题行高已经属于共享组件基线，不应在业务层重新定义。'],
  ['--text-body-size', '正文字号属于整站排版基线，不应在业务层重新定义。'],
  ['--text-body-line-height', '正文行高属于整站排版基线，不应在业务层重新定义。'],
  ['--text-caption-size', '说明文字尺寸属于整站排版基线，不应在业务层重新定义。'],
  ['--text-meta-size', '元信息字号属于整站排版基线，不应在业务层重新定义。'],
  ['--text-lead-size', '导语字号属于整站排版基线，不应在业务层重新定义。'],
  ['--text-lead-line-height', '导语行高属于整站排版基线，不应在业务层重新定义。'],
  ['--text-eyebrow-size', '眉标签字号属于整站排版基线，不应在业务层重新定义。'],
  ['--text-eyebrow-letter-spacing', '眉标签字距属于整站排版基线，不应在业务层重新定义。'],
  ['--text-overline-size', 'overline 尺寸属于整站排版基线，不应在业务层重新定义。'],
  ['--text-overline-letter-spacing', 'overline 字距属于整站排版基线，不应在业务层重新定义。']
])

function normalize(filePath) {
  return filePath.split(path.sep).join('/')
}

function relativePath(filePath) {
  return normalize(path.relative(workspaceRoot, filePath))
}

function isStyleFile(filePath) {
  return styleExt.has(path.extname(filePath))
}

function isAllowedRootFile(filePath) {
  return allowedRootFiles.has(filePath)
}

function isRawValueAllowed(filePath) {
  return (
    filePath.startsWith('src/styles/tokens/') ||
    filePath.startsWith('src/styles/1_tokens/') ||
    filePath.startsWith('src/styles/themes/')
  )
}

function isIgnoredUndefinedToken(token) {
  return undefinedTokenIgnorePrefixes.some(prefix => token.startsWith(prefix))
}

function hasProtectedGlobalPrefix(token) {
  return protectedGlobalTokenPrefixes.some(prefix => token.startsWith(prefix))
}

function isLocalNamespacedToken(token) {
  if (token.startsWith('--ui-')) return true
  const segments = token.replace(/^--/, '').split('-').filter(Boolean)
  return segments.length >= 3
}

function addIssue(list, category, file, line, message, detail) {
  list.push({
    category,
    file,
    line,
    message,
    detail
  })
}

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return walk(fullPath)
      }
      return validExt.has(path.extname(entry.name)) ? [fullPath] : []
    })
  )
  return files.flat()
}

function collectLineMatches(content, regex) {
  const lines = content.split('\n')
  const matches = []

  lines.forEach((line, index) => {
    const found = [...line.matchAll(new RegExp(regex.source, regex.flags))]
    if (!found.length) return
    matches.push({
      line: index + 1,
      values: [...new Set(found.map(item => item[0]))]
    })
  })

  return matches
}

function collectCustomPropertyDefinitions(content) {
  const definitions = []

  for (const match of content.matchAll(customPropertyDefinitionRegex)) {
    const name = match[1]
    const value = match[2].trim()
    const offset = match.index || 0
    const line = content.slice(0, offset).split('\n').length
    definitions.push({
      name,
      value,
      line
    })
  }

  return definitions
}

function collectTokenUsages(content) {
  const usages = []
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    const found = [...line.matchAll(tokenRegex)].map(match => match[1])
    if (!found.length) return
    usages.push({
      line: index + 1,
      tokens: [...new Set(found)]
    })
  })

  return usages
}

function printGroup(title, issues, limit = 80) {
  console.log(`\n=== ${title} (${issues.length}) ===`)

  if (!issues.length) {
    console.log('- 未发现')
    return
  }

  issues.slice(0, limit).forEach(issue => {
    const location = issue.line ? `${issue.file}:L${issue.line}` : issue.file
    console.log(`- ${location} ${issue.message}`)
    if (issue.detail) {
      console.log(`  ${issue.detail}`)
    }
  })

  if (issues.length > limit) {
    console.log(`- 其余 ${issues.length - limit} 条已省略`)
  }
}

async function main() {
  const allFiles = []
  for (const dir of targetDirs) {
    const absoluteDir = path.join(workspaceRoot, dir)
    if (!fs.existsSync(absoluteDir)) continue
    allFiles.push(...(await walk(absoluteDir)))
  }

  const files = allFiles.map(filePath => ({
    absolute: filePath,
    relative: relativePath(filePath)
  }))

  const styleFiles = files.filter(file => isStyleFile(file.absolute))
  const fileContents = new Map()
  const definitionsByFile = new Map()
  const definedTokens = new Set()

  for (const file of files) {
    const content = await fs.promises.readFile(file.absolute, 'utf-8')
    fileContents.set(file.relative, content)

    if (!isStyleFile(file.absolute)) continue

    const definitions = collectCustomPropertyDefinitions(content)
    definitionsByFile.set(file.relative, definitions)
    definitions.forEach(definition => definedTokens.add(definition.name))
  }

  const errors = []
  const warnings = []

  for (const file of styleFiles) {
    const content = fileContents.get(file.relative) || ''
    const rootMatches = collectLineMatches(content, rootRegex)
    const definitions = definitionsByFile.get(file.relative) || []

    if (!isAllowedRootFile(file.relative)) {
      rootMatches.forEach(match => {
        addIssue(
          errors,
          '非法 :root',
          file.relative,
          match.line,
          '非法使用 `:root`，只有核心 token / 主题入口文件允许这样做。',
          `命中内容：${match.values.join(', ')}`
        )
      })
    }

    definitions.forEach(definition => {
      if (!isAllowedRootFile(file.relative) && hasProtectedGlobalPrefix(definition.name)) {
        addIssue(
          errors,
          '非法全局 token 定义',
          file.relative,
          definition.line,
          `定义了受保护的全局 token：${definition.name}`,
          protectedSharedTokens.get(definition.name) ||
            '这个前缀只允许出现在 token 层或核心主题入口文件。'
        )
        return
      }

      if (!isAllowedRootFile(file.relative) && !isLocalNamespacedToken(definition.name)) {
        addIssue(
          warnings,
          '局部变量未命名空间化',
          file.relative,
          definition.line,
          `局部变量命名过于泛化：${definition.name}`,
          '建议改成模块前缀变量或 `--ui-*` 局部适配变量。'
        )
      }
    })
  }

  for (const file of files) {
    const content = fileContents.get(file.relative) || ''

    const tokenUsages = collectTokenUsages(content)
    tokenUsages.forEach(usage => {
      usage.tokens.forEach(token => {
        if (definedTokens.has(token) || isIgnoredUndefinedToken(token)) return
        addIssue(
          errors,
          '未定义 token',
          file.relative,
          usage.line,
          `使用了仓库中未定义的 CSS 变量：${token}`,
          '请先在合法的 token 层或模块局部层定义，再使用。'
        )
      })
    })

    if (!isRawValueAllowed(file.relative)) {
      const colorMatches = collectLineMatches(content, colorRegex)
      colorMatches.forEach(match => {
        addIssue(
          warnings,
          '硬编码颜色',
          file.relative,
          match.line,
          `检测到硬编码颜色：${match.values.join(', ')}`,
          '请优先替换为语义 token、模块局部变量或已授权的 palette 变量。'
        )
      })
    }

    if (isStyleFile(file.absolute)) continue

    interactivePatterns.forEach(pattern => {
      const matches = collectLineMatches(content, pattern.regex)
      matches.forEach(match => {
        addIssue(
          warnings,
          '非语义交互',
          file.relative,
          match.line,
          `命中 ${pattern.name}`,
          '请优先使用 Ant Design 组件、原生 `button` 或真实链接元素。'
        )
      })
    })

    // 检查内联 style 属性
    if (
      isStyleFile(file.absolute) ||
      file.relative.endsWith('.tsx') ||
      file.relative.endsWith('.ts')
    ) {
      const styleMatches = [...content.matchAll(styleAttributePattern)]
      styleMatches.forEach(match => {
        const styleContent = match[1]
        const line = content.slice(0, match.index).split('\n').length

        addIssue(
          errors,
          '内联样式',
          file.relative,
          line,
          '检测到内联 style 属性',
          '请将内联样式迁移到 CSS 类或使用 CSS 变量。'
        )
      })
    }

    // 检查 focus-visible 样式
    if (isStyleFile(file.absolute)) {
      const focusMatches = collectLineMatches(content, focusVisiblePattern)
      focusMatches.forEach(match => {
        addIssue(
          warnings,
          'focus-visible 样式',
          file.relative,
          match.line,
          '检测到 focus-visible: 样式',
          '请确认这些样式是否真的需要，focus-visible 通常应该和 :focus-visible 伪类配合使用。'
        )
      })
    }

    // 检测重复的 Tailwind 任意值
    if (
      file.relative.endsWith('.tsx') ||
      file.relative.endsWith('.ts') ||
      isStyleFile(file.absolute)
    ) {
      const arbitraryMatches = [...content.matchAll(arbitraryTailwindPattern)]
      arbitraryMatches.forEach(match => {
        const arbitraryValue = match[0]
        const line = content.slice(0, match.index).split('\n').length

        if (!repeatedArbitraryTailwind.has(arbitraryValue)) {
          repeatedArbitraryTailwind.set(arbitraryValue, [])
        }
        repeatedArbitraryTailwind.get(arbitraryValue).push({
          file: file.relative,
          line
        })
      })
    }
  }

  const errorGroups = new Map()
  const warningGroups = new Map()

  errors.forEach(issue => {
    const group = errorGroups.get(issue.category) || []
    group.push(issue)
    errorGroups.set(issue.category, group)
  })

  warnings.forEach(issue => {
    const group = warningGroups.get(issue.category) || []
    group.push(issue)
    warningGroups.set(issue.category, group)
  })

  console.log('\n=== 样式治理审计 ===\n')
  console.log(`扫描目录: ${targetDirs.join(', ')}`)
  console.log(`扫描文件数: ${files.length}`)
  console.log(`样式文件数: ${styleFiles.length}`)
  console.log(`已定义 token 数: ${definedTokens.size}`)
  console.log(`错误数: ${errors.length}`)
  console.log(`警告数: ${warnings.length}`)

  printGroup('错误 / 非法 :root', errorGroups.get('非法 :root') || [])
  printGroup('错误 / 非法全局 token 定义', errorGroups.get('非法全局 token 定义') || [])
  printGroup('错误 / 未定义 token', errorGroups.get('未定义 token') || [])
  printGroup('错误 / 内联样式', errorGroups.get('内联样式') || [])

  printGroup('警告 / 硬编码颜色', warningGroups.get('硬编码颜色') || [], 120)
  printGroup('警告 / 非语义交互', warningGroups.get('非语义交互') || [])
  printGroup('警告 / 局部变量未命名空间化', warningGroups.get('局部变量未命名空间化') || [])
  printGroup('警告 / focus-visible 样式', warningGroups.get('focus-visible 样式') || [])

  // 报告重复的 Tailwind 任意值
  if (repeatedArbitraryTailwind.size > 0) {
    console.log('\n=== 重复的 Tailwind 任意值 ===')
    for (const [value, occurrences] of repeatedArbitraryTailwind) {
      if (occurrences.length > 3) {
        // 只显示出现超过3次的
        console.log(`- ${value} 在 ${occurrences.length} 个文件中重复使用`)
        occurrences.slice(0, 5).forEach(occ => {
          console.log(`  ${occ.file}:L${occ.line}`)
        })
        if (occurrences.length > 5) {
          console.log(`  ... 等共 ${occurrences.length} 处`)
        }
      }
    }
  }

  console.log('\n规范入口：docs/style-governance.md')
  console.log('严格口径：docs/style-governance-strict.md')

  if (errors.length) {
    process.exitCode = 1
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
