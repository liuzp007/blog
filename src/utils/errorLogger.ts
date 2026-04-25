interface ErrorLog {
  timestamp: string
  level: 'error' | 'warning' | 'info'
  message: string
  stack?: string
  component?: string
  userAgent?: string
  url?: string
  userId?: string
  sessionId?: string
  tags?: string[]
  additionalData?: Record<string, any>
}

interface ErrorLoggerOptions {
  maxLogs?: number
  enableConsole?: boolean
  enableLocalStorage?: boolean
  remoteEndpoint?: string
  onLog?: (log: ErrorLog) => void
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 100
  private sessionId = this.generateSessionId()
  private userId: string | null = null
  private enableConsole = true
  private enableLocalStorage = false
  private remoteEndpoint: string | null = null
  private onLogCallback: ((log: ErrorLog) => void) | null = null

  constructor(options?: ErrorLoggerOptions) {
    if (options) {
      this.maxLogs = options.maxLogs ?? 100
      this.enableConsole = options.enableConsole ?? true
      this.enableLocalStorage = options.enableLocalStorage ?? false
      this.remoteEndpoint = options.remoteEndpoint ?? null
      this.onLogCallback = options.onLog ?? null
    }

    this.loadLogsFromStorage()
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private loadLogsFromStorage() {
    if (this.enableLocalStorage && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('error-logs')
        if (saved) {
          const parsed = JSON.parse(saved)
          this.logs = Array.isArray(parsed) ? parsed : []
        }
      } catch (e) {
        console.warn('Failed to load logs from localStorage:', e)
      }
    }
  }

  private saveLogsToStorage() {
    if (this.enableLocalStorage && typeof window !== 'undefined') {
      try {
        localStorage.setItem('error-logs', JSON.stringify(this.logs))
      } catch (e) {
        console.warn('Failed to save logs to localStorage:', e)
      }
    }
  }

  setUserId(userId: string | null) {
    this.userId = userId
  }

  log(error: Error | string, additionalInfo?: Partial<ErrorLog>) {
    const errorMessage = typeof error === 'string' ? error : error.message
    const errorStack = typeof error === 'string' ? undefined : error.stack

    const log: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: errorMessage || 'Unknown error',
      stack: errorStack,
      component: additionalInfo?.component,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      tags: additionalInfo?.tags,
      additionalData: additionalInfo?.additionalData
    }

    this.addLog(log)
  }

  warn(message: string, additionalInfo?: Partial<ErrorLog>) {
    const log: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      component: additionalInfo?.component,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      tags: additionalInfo?.tags,
      additionalData: additionalInfo?.additionalData
    }

    this.addLog(log)
  }

  info(message: string, additionalInfo?: Partial<ErrorLog>) {
    const log: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      component: additionalInfo?.component,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userId: this.userId || undefined,
      sessionId: this.sessionId,
      tags: additionalInfo?.tags,
      additionalData: additionalInfo?.additionalData
    }

    this.addLog(log)
  }

  private addLog(log: ErrorLog) {
    this.logs.push(log)

    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    if (this.enableConsole) {
      const consoleMethod =
        log.level === 'error'
          ? console.error
          : log.level === 'warning'
            ? console.warn
            : console.info
      consoleMethod(`[ErrorLogger]`, log)
    }

    if (this.enableLocalStorage) {
      this.saveLogsToStorage()
    }

    if (this.onLogCallback) {
      this.onLogCallback(log)
    }

    if (this.remoteEndpoint) {
      this.sendToRemote(log)
    }
  }

  private async sendToRemote(log: ErrorLog) {
    if (!this.remoteEndpoint) return

    try {
      await fetch(this.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(log)
      })
    } catch (e) {
      console.warn('Failed to send log to remote endpoint:', e)
    }
  }

  getLogs(filter?: { level?: 'error' | 'warning' | 'info'; since?: Date }): ErrorLog[] {
    if (!filter) return [...this.logs]

    const sinceTime = filter.since?.getTime()
    const level = filter.level
    return this.logs.filter(log => {
      if (level && log.level !== level) return false
      if (sinceTime && new Date(log.timestamp).getTime() < sinceTime) return false
      return true
    })
  }

  getErrorCount(): number {
    return this.logs.filter(log => log.level === 'error').length
  }

  clearLogs() {
    this.logs = []
    if (this.enableLocalStorage && typeof window !== 'undefined') {
      localStorage.removeItem('error-logs')
    }
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  exportAsCSV(): string {
    const headers = ['timestamp', 'level', 'message', 'component', 'url', 'userId', 'sessionId']
    const rows = this.logs.map(log =>
      headers.map(header => log[header as keyof ErrorLog] || '').join(',')
    )

    return [headers.join(','), ...rows].join('\n')
  }
}

export const errorLogger = new ErrorLogger()

export default errorLogger
