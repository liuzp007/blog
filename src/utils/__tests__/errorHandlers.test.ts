import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../errorLogger', () => ({
  default: {
    log: vi.fn(),
    info: vi.fn(),
    getLogs: vi.fn(() => []),
    clearLogs: vi.fn()
  }
}))

import errorLogger from '../errorLogger'
import { setupGlobalErrorHandlers } from '../errorHandlers'

const mockedErrorLogger = vi.mocked(errorLogger)

describe('errorHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setupGlobalErrorHandlers', () => {
    it('should register error event listener on window', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      setupGlobalErrorHandlers()

      expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith('rejectionhandled', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))

      addEventListenerSpy.mockRestore()
    })

    it('should log error via errorLogger when error event is triggered', () => {
      const errorEvent = new ErrorEvent('error', {
        message: 'test error',
        filename: 'test.js',
        lineno: 10,
        colno: 5
      })

      setupGlobalErrorHandlers()
      window.dispatchEvent(errorEvent)

      expect(mockedErrorLogger.log).toHaveBeenCalled()
    })

    it('should log and prevent default for unhandled rejection', () => {
      const rejectedPromise = Promise.reject(new Error('rejected'))
      rejectedPromise.catch(() => {})

      const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
        promise: rejectedPromise,
        reason: new Error('rejected')
      })

      const preventDefaultSpy = vi.spyOn(rejectionEvent, 'preventDefault')

      setupGlobalErrorHandlers()
      window.dispatchEvent(rejectionEvent)

      expect(mockedErrorLogger.log).toHaveBeenCalled()
      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })
})
