#!/usr/bin/env node

/**
 * 样式审计脚本
 * 检查样式使用情况，提供优化建议
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

// 配置
const config = {
  srcDir: 'src',
  // 需要检查的文件类型
  checkPatterns: ['**/*.{tsx,ts,jsx,js}', '**/*.scss', '**/*.css'],
  // 检查规则
  rules: {
    // 禁止使用的硬编码值
    hardcodedValues: {
      patterns: [
        /#[0-9a-f]{3,6}/gi, // 颜色值
        /\b\d+px\b/gi, // 像素值
        /\b\d+rem\b/gi, // rem 值
        /\b\d+em\b/gi // em 值
      ],
      severity: 'error'
    },
    // 禁止过度嵌套的选择器
    nestedSelectors: {
      maxDepth: 3,
      severity: 'warning'
    },
    // 禁止使用的类名
    forbiddenClasses: {
      classes: ['mb-0', 'mt-0', 'pl-0', 'pr-0', 'text-left', 'text-right'],
      severity: 'warning'
    },
    // 必须使用的设计令牌
    requiredTokens: {
      tokens: [
        'var(--color-)',
        'var(--space-)',
        'var(--radius-)',
        'var(--shadow-)',
        'var(--text-)'
      ],
      minUsage: 0.5, // 至少 50% 的样式必须使用设计令牌
      severity: 'warning'
    }
  }
}

// 主函数
async function main() {
  console.log('🔍 开始样式审计...')

  // 1. 查找需要检查的文件
  const files = await findFiles()
  console.log(`📁 找到 ${files.length} 个文件需要检查`)

  // 2. 执行审计
  const results = await auditFiles(files)

  // 3. 生成报告
  generateReport(results)

  // 4. 提供优化建议
  provideSuggestions(results)
}

// 查找文件
async function findFiles() {
  const files = []
  for (const pattern of config.checkPatterns) {
    const found = await glob(path.join(config.srcDir, pattern))
    files.push(...found)
  }
  return [...new Set(files)]
}

// 审计文件
async function auditFiles(files) {
  const results = []

  for (const file of files) {
    const result = await auditFile(file)
    results.push(result)
  }

  return results
}

// 审计单个文件
async function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const fileExt = path.extname(filePath)
  const result = {
    file: filePath,
    errors: [],
    warnings: [],
    suggestions: [],
    stats: {}
  }

  // 根据文件类型执行不同的检查
  if (fileExt === '.scss' || fileExt === '.css') {
    auditStyles(content, result)
  } else if (fileExt === '.tsx' || fileExt === '.ts' || fileExt === '.jsx' || fileExt === '.js') {
    auditComponents(content, result)
  }

  return result
}

// 审计样式文件
function auditStyles(content, result) {
  // 检查硬编码值
  checkHardcodedValues(content, result)

  // 检查选择器嵌套
  checkNestedSelectors(content, result)

  // 检查设计令牌使用
  checkTokenUsage(content, result)

  // 统计信息
  result.stats.totalLines = content.split('\n').length
  result.stats.hardcodedCount = (content.match(/#[0-9a-f]{3,6}/gi) || []).length
  result.stats.tokenCount = (content.match(/var\(--[^)]+\)/gi) || []).length
}

// 审计组件文件
function auditComponents(content, result) {
  // 检查行内样式
  checkInlineStyles(content, result)

  // 检查类名使用
  checkClassNames(content, result)

  // 检查 Tailwind 类使用
  checkTailwindUsage(content, result)
}

// 检查硬编码值
function checkHardcodedValues(content, result) {
  const { hardcodedValues } = config.rules

  for (const pattern of hardcodedValues.patterns) {
    const matches = content.match(pattern)
    if (matches) {
      result.errors.push({
        type: 'hardcoded-value',
        message: `发现硬编码值: ${matches.join(', ')}`,
        suggestions: ['使用设计令牌替换硬编码值', '例如: #ffffff → var(--color-white)']
      })
    }
  }
}

// 检查选择器嵌套
function checkNestedSelectors(content, result) {
  const { nestedSelectors } = config.rules
  const lines = content.split('\n')
  let currentDepth = 0

  for (const line of lines) {
    if (line.includes('{')) {
      currentDepth++
      if (currentDepth > nestedSelectors.maxDepth) {
        result.warnings.push({
          type: 'nested-selector',
          message: `选择器嵌套过深 (${currentDepth} 层)`,
          suggestions: ['减少选择器嵌套深度', '使用更具体的选择器', '考虑使用 BEM 命名规范']
        })
      }
    } else if (line.includes('}')) {
      currentDepth--
    }
  }
}

// 检查设计令牌使用
function checkTokenUsage(content, result) {
  const { requiredTokens } = config.rules
  const tokenMatches = content.match(/var\(--[^)]+\)/gi) || []
  const totalStyleDeclarations = (content.match(/[{,]\s*[^}]+\s*:/g) || []).length

  if (totalStyleDeclarations > 0) {
    const tokenUsageRatio = tokenMatches.length / totalStyleDeclarations
    if (tokenUsageRatio < requiredTokens.minUsage) {
      result.suggestions.push({
        type: 'token-usage',
        message: `设计令牌使用率偏低 (${(tokenUsageRatio * 100).toFixed(1)}%)`,
        suggestions: [
          '提高设计令牌使用率',
          '优先使用 var(--color-)、var(--space-) 等变量',
          '避免直接使用硬编码值'
        ]
      })
    }
  }
}

// 检查行内样式
function checkInlineStyles(content, result) {
  const inlineStyleMatches = content.match(/style=\{[^}]+\}/g) || []

  if (inlineStyleMatches.length > 0) {
    result.warnings.push({
      type: 'inline-styles',
      message: `发现 ${inlineStyleMatches.length} 处行内样式`,
      suggestions: [
        '使用 CSS Modules 或 styled-components',
        '提取样式到单独的文件',
        '使用设计令牌变量'
      ]
    })
  }
}

// 检查类名使用
function checkClassNames(content, result) {
  const { forbiddenClasses } = config.rules
  const classMatches = content.match(/className="[^"]*"/g) || []

  for (const className of forbiddenClasses.classes) {
    const forbiddenCount = classMatches.filter(match => match.includes(className)).length

    if (forbiddenCount > 0) {
      result.warnings.push({
        type: 'forbidden-class',
        message: `使用了禁用的类名: ${className} (${forbiddenCount} 次)`,
        suggestions: ['使用语义化类名替代', '例如: text-left → .ui-text-left']
      })
    }
  }
}

// 检查 Tailwind 使用
function checkTailwindUsage(content, result) {
  const tailwindMatches = content.match(/className="[^"]*tailwind[^"]*"/gi) || []

  if (tailwindMatches.length > 0) {
    result.stats.tailwindUsage = tailwindMatches.length
  }
}

// 生成报告
function generateReport(results) {
  console.log('\n📊 审计报告')
  console.log('='.repeat(50))

  let totalErrors = 0
  let totalWarnings = 0
  let totalSuggestions = 0

  for (const result of results) {
    totalErrors += result.errors.length
    totalWarnings += result.warnings.length
    totalSuggestions += result.suggestions.length

    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log(`\n📁 ${result.file}`)

      result.errors.forEach(error => {
        console.log(`  ❌ ${error.message}`)
      })

      result.warnings.forEach(warning => {
        console.log(`  ⚠️  ${warning.message}`)
      })

      result.suggestions.forEach(suggestion => {
        console.log(`  💡 ${suggestion.message}`)
      })
    }
  }

  console.log('\n📈 统计信息')
  console.log('-'.repeat(30))
  console.log(`错误: ${totalErrors}`)
  console.log(`警告: ${totalWarnings}`)
  console.log(`建议: ${totalSuggestions}`)
  console.log(`检查文件: ${results.length}`)
}

// 提供优化建议
function provideSuggestions(results) {
  console.log('\n💡 优化建议')
  console.log('='.repeat(50))

  // 分析常见问题
  const issues = {
    hardcodedValues: [],
    nestedSelectors: [],
    inlineStyles: [],
    tokenUsage: []
  }

  results.forEach(result => {
    result.errors.forEach(error => {
      if (error.type === 'hardcoded-value') {
        issues.hardcodedValues.push(result.file)
      }
    })

    result.warnings.forEach(warning => {
      if (warning.type === 'nested-selector') {
        issues.nestedSelectors.push(result.file)
      } else if (warning.type === 'inline-styles') {
        issues.inlineStyles.push(result.file)
      }
    })

    result.suggestions.forEach(suggestion => {
      if (suggestion.type === 'token-usage') {
        issues.tokenUsage.push(result.file)
      }
    })
  })

  // 提供具体建议
  if (issues.hardcodedValues.length > 0) {
    console.log('\n🎨 硬编码值问题')
    console.log('建议：')
    console.log('1. 使用设计令牌替换所有硬编码颜色、间距等值')
    console.log('2. 参考 src/styles/1_tokens/ 目录中的变量定义')
    console.log('3. 使用 CSS 变量实现主题切换')
  }

  if (issues.nestedSelectors.length > 0) {
    console.log('\n🔍 选择器嵌套问题')
    console.log('建议：')
    console.log('1. 减少选择器嵌套深度，最多 3 层')
    console.log('2. 使用 BEM 命名规范')
    console.log('3. 提取共用样式到单独的类')
  }

  if (issues.inlineStyles.length > 0) {
    console.log('\n🎯 行内样式问题')
    console.log('建议：')
    console.log('1. 使用 CSS Modules 管理组件样式')
    console.log('2. 复用 .ui-* 样式类')
    console.log('3. 复杂样式提取到单独文件')
  }

  if (issues.tokenUsage.length > 0) {
    console.log('\n🔧 设计令牌使用问题')
    console.log('建议：')
    console.log('1. 提高设计令牌使用率至少 50%')
    console.log('2. 优先使用语义化的变量名')
    console.log('3. 避免在组件中直接定义样式值')
  }

  console.log('\n📖 更多帮助')
  console.log('查看 src/styles/README.md 了解样式系统使用指南')
}

// 运行主函数
main().catch(console.error)
