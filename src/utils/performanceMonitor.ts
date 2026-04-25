interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  url: string
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private isDevelopment = import.meta.env.DEV
  private observers: PerformanceObserver[] = []

  init() {
    if (typeof window === 'undefined' || !window.performance) return

    this.observeWebVitals()
    this.observeResourceTiming()
    this.observeNavigationTiming()
  }

  private observeWebVitals() {
    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.recordMetric('LCP', (entry as any).startTime)
          } else if (entry.entryType === 'first-input') {
            this.recordMetric('FID', (entry as any).processingStart - (entry as any).startTime)
          } else if (entry.entryType === 'layout-shift') {
            if (!(entry as any).hadRecentInput) {
              this.cumulativeLayoutShift += (entry as any).value
              this.recordMetric('CLS', this.cumulativeLayoutShift)
            }
          } else if (entry.entryType === 'paint') {
            if (entry.name === 'first-paint') {
              this.recordMetric('FP', entry.startTime)
            } else if (entry.name === 'first-contentful-paint') {
              this.recordMetric('FCP', entry.startTime)
            }
          }
        }
      })

      observer.observe({
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint']
      })

      this.observers.push(observer)
    } catch (e) {
      // 处理观察失败
    }
  }

  private cumulativeLayoutShift = 0

  private observeResourceTiming() {
    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          this.recordMetric(`Resource: ${(entry as any).name}`, (entry as any).duration)
        }
      })

      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    } catch (e) {
      // 处理资源时间观察失败
    }
  }

  private observeNavigationTiming() {
    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as PerformanceNavigationTiming
          this.recordMetric('TTFB', navEntry.responseStart - navEntry.requestStart)
          this.recordMetric(
            'DOMLoad',
            navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
          )
          this.recordMetric('PageLoad', navEntry.loadEventEnd - navEntry.fetchStart)
        }
      })

      observer.observe({ entryTypes: ['navigation'] })
      this.observers.push(observer)
    } catch (e) {
      // 处理导航时间观察失败
    }
  }

  private recordMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href
    }

    this.metrics.push(metric)

    if (this.isDevelopment) {
      console.log(`[Performance] ${name}: ${value}ms`)
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  getMetricByName(name: string): PerformanceMetric | undefined {
    return this.metrics.find(m => m.name === name)
  }

  getLatestMetrics() {
    const latest: Record<string, PerformanceMetric> = {}
    for (const metric of this.metrics) {
      latest[metric.name] = metric
    }
    return latest
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2)
  }

  clearMetrics() {
    this.metrics = []
  }

  getPerformanceScore() {
    const latest = this.getLatestMetrics()
    const scores: Record<string, number> = {}

    if (latest.LCP) {
      scores.LCP = latest.LCP.value <= 2500 ? 100 : latest.LCP.value <= 4000 ? 50 : 0
    }

    if (latest.FID) {
      scores.FID = latest.FID.value <= 100 ? 100 : latest.FID.value <= 300 ? 50 : 0
    }

    if (latest.CLS) {
      scores.CLS = latest.CLS.value <= 0.1 ? 100 : latest.CLS.value <= 0.25 ? 50 : 0
    }

    const total = Object.values(scores)
    if (total.length === 0) return null
    return Math.round(total.reduce((a, b) => a + b, 0) / total.length)
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

export const performanceMonitor = new PerformanceMonitor()

export default performanceMonitor
