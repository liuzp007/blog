# 性能监控指南

## 概述

项目集成了内置的性能监控工具，用于跟踪 Web Vitals 和其他性能指标。

## 核心指标

### Web Vitals

| 指标 | 全称                     | 良好阈值 | 需改进 | 差     |
| ---- | ------------------------ | -------- | ------ | ------ |
| LCP  | Largest Contentful Paint | ≤2.5s    | ≤4s    | >4s    |
| FID  | First Input Delay        | ≤100ms   | ≤300ms | >300ms |
| CLS  | Cumulative Layout Shift  | ≤0.1     | ≤0.25  | >0.25  |

### 其他指标

- **FP** (First Paint): 首次绘制时间
- **FCP** (First Contentful Paint): 首次内容绘制时间
- **TTFB** (Time to First Byte): 首字节时间
- **DOMLoad**: DOM 加载完成时间
- **PageLoad**: 页面完全加载时间

## 使用方法

### 在开发环境中查看性能

浏览器控制台会输出实时性能指标：

```javascript
[PerformanceMonitor] LCP: 1234.56ms
[PerformanceMonitor] FID: 45.67ms
[PerformanceMonitor] CLS: 0.05
```

### 手动获取性能数据

```typescript
import performanceMonitor from '@/utils/performanceMonitor'

// 获取所有指标
const allMetrics = performanceMonitor.getMetrics()

// 获取最新指标
const latest = performanceMonitor.getLatestMetrics()

// 获取特定指标
const lcp = performanceMonitor.getMetricByName('LCP')

// 获取性能评分 (0-100)
const score = performanceMonitor.getPerformanceScore()

// 导出为 JSON
const json = performanceMonitor.exportMetrics()
```

### 性能分析

运行构建分析：

```bash
pnpm analyze
```

这会生成可视化报告，显示：

- Bundle 大小
- 依赖关系
- 代码分割效果

## 性能基线

### 当前性能目标

- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- 首屏加载时间: < 3s

### 优化策略

1. **代码分割**: 已配置 Vite 的 manual chunks
2. **资源优化**: 图片、字体等资源压缩
3. **懒加载**: 使用 React.lazy 和 import()
4. **缓存策略**: 合理使用浏览器缓存
5. **CDN 加速**: 静态资源部署到 CDN

## 注意事项

1. 性能监控仅在客户端运行
2. 开发环境和生产环境的性能数据可能有差异
3. 首次访问通常比后续访问慢
4. 网络条件会影响性能指标

## 集成第三方监控服务

如果需要集成 Sentry、DataDog 等服务，可以在 `performanceMonitor.ts` 中添加上报逻辑：

```typescript
private reportToService(metric: PerformanceMetric) {
  // 集成 Sentry
  // Sentry.captureMessage(...)

  // 集成其他服务
  // fetch('/api/metrics', { method: 'POST', body: JSON.stringify(metric) })
}
```
