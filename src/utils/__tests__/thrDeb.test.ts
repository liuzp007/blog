import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import thrDeb from '../thrDeb'

describe('thrDeb', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('debounce', () => {
    it('should not call the function before the delay', () => {
      const fn = vi.fn()
      const debounced = thrDeb.debounce(fn, 300)

      debounced()

      expect(fn).not.toHaveBeenCalled()
    })

    it('should call the function after the delay', () => {
      const fn = vi.fn()
      const debounced = thrDeb.debounce(fn, 300)

      debounced()
      vi.advanceTimersByTime(300)

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should only call the function once when called multiple times rapidly', () => {
      const fn = vi.fn()
      const debounced = thrDeb.debounce(fn, 300)

      debounced()
      debounced()
      debounced()
      vi.advanceTimersByTime(300)

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should pass the latest arguments to the function', () => {
      const fn = vi.fn()
      const debounced = thrDeb.debounce(fn, 100)

      debounced('first')
      debounced('second')
      debounced('third')
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('third')
    })

    it('should allow the function to be called again after the delay', () => {
      const fn = vi.fn()
      const debounced = thrDeb.debounce(fn, 100)

      debounced('first')
      vi.advanceTimersByTime(100)

      debounced('second')
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenNthCalledWith(1, 'first')
      expect(fn).toHaveBeenNthCalledWith(2, 'second')
    })

    it('should handle zero delay', () => {
      const fn = vi.fn()
      const debounced = thrDeb.debounce(fn, 0)

      debounced()
      vi.advanceTimersByTime(0)

      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('should call the function immediately on first invocation', () => {
      const fn = vi.fn()
      const throttled = thrDeb.throttle(fn, 300)

      throttled()

      expect(fn).not.toHaveBeenCalled()
    })

    it('should call the function after the delay', () => {
      const fn = vi.fn()
      const throttled = thrDeb.throttle(fn, 300)

      throttled()
      vi.advanceTimersByTime(300)

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should not call the function again within the throttle interval', () => {
      const fn = vi.fn()
      const throttled = thrDeb.throttle(fn, 300)

      throttled()
      throttled() // called within interval, should be ignored
      vi.advanceTimersByTime(300)

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should allow the function to be called again after the throttle interval', () => {
      const fn = vi.fn()
      const throttled = thrDeb.throttle(fn, 200)

      throttled('first')
      vi.advanceTimersByTime(200)

      throttled('second')
      vi.advanceTimersByTime(200)

      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenNthCalledWith(1, 'first')
      expect(fn).toHaveBeenNthCalledWith(2, 'second')
    })

    it('should pass arguments to the throttled function', () => {
      const fn = vi.fn()
      const throttled = thrDeb.throttle(fn, 100)

      throttled('arg1', 'arg2')
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should handle multiple rapid calls and only execute first per interval', () => {
      const fn = vi.fn()
      const throttled = thrDeb.throttle(fn, 100)

      throttled() // accepted (timer set)
      throttled() // ignored (timer active)
      throttled() // ignored (timer active)
      vi.advanceTimersByTime(100) // fn called once

      expect(fn).toHaveBeenCalledTimes(1)

      throttled() // accepted (timer cleared)
      vi.advanceTimersByTime(100) // fn called again

      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})
