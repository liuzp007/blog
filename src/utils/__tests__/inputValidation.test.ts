import { describe, it, expect } from 'vitest'
import {
  validateString,
  validateNumber,
  validateEmail,
  validateUrl,
  validateObject,
  sanitizeInput,
  sanitizeHtml,
  isSafeValue,
  checkBoundaryConditions
} from '../inputValidation'

describe('inputValidation', () => {
  describe('isSafeValue', () => {
    it('should return true for null', () => {
      expect(isSafeValue(null)).toBe(true)
    })

    it('should return true for undefined', () => {
      expect(isSafeValue(undefined)).toBe(true)
    })

    it('should return true for a safe string', () => {
      expect(isSafeValue('hello world')).toBe(true)
    })

    it('should return false for string containing <script> tag', () => {
      expect(isSafeValue('<script>alert("xss")</script>')).toBe(false)
    })

    it('should return false for string containing javascript: protocol', () => {
      expect(isSafeValue('javascript:alert("xss")')).toBe(false)
    })

    it('should return false for string containing event handler attribute', () => {
      expect(isSafeValue('onclick=alert("xss")')).toBe(false)
    })

    it('should return true for an object with safe values', () => {
      expect(isSafeValue({ name: 'test', age: 25 })).toBe(true)
    })

    it('should return false for an object with unsafe nested values', () => {
      expect(isSafeValue({ name: '<script>evil</script>', age: 25 })).toBe(false)
    })
  })

  describe('checkBoundaryConditions', () => {
    it('should return the value when all conditions are allowed (default)', () => {
      expect(checkBoundaryConditions(42, 'default')).toBe(42)
    })

    it('should return defaultValue when value is undefined and allowUndefined is false', () => {
      expect(checkBoundaryConditions(undefined, 'fallback', { allowUndefined: false })).toBe(
        'fallback'
      )
    })

    it('should return defaultValue when value is null and allowNull is false', () => {
      expect(checkBoundaryConditions(null, 'fallback', { allowNull: false })).toBe('fallback')
    })

    it('should return defaultValue when value is NaN and checkNaN is true', () => {
      expect(checkBoundaryConditions(NaN, 'fallback', { checkNaN: true })).toBe('fallback')
    })

    it('should return the value when it is NaN but checkNaN is false', () => {
      expect(checkBoundaryConditions(NaN, 'fallback', { checkNaN: false })).toBeNaN()
    })

    it('should return defaultValue when customCheck returns false', () => {
      expect(
        checkBoundaryConditions('bad', 'fallback', {
          customCheck: (v: unknown) => typeof v === 'number'
        })
      ).toBe('fallback')
    })

    it('should return the value when customCheck returns true', () => {
      expect(
        checkBoundaryConditions(100, 'fallback', {
          customCheck: (v: unknown) => typeof v === 'number' && (v as number) > 0
        })
      ).toBe(100)
    })

    it('should allow undefined when allowUndefined is true', () => {
      expect(checkBoundaryConditions(undefined, 'fallback', { allowUndefined: true })).toBe(
        undefined
      )
    })
  })

  describe('sanitizeHtml', () => {
    it('should remove script tags from HTML', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>'
      expect(sanitizeHtml(input)).toBe('<p>Hello</p>')
    })

    it('should remove script tags with attributes', () => {
      const input = '<script type="text/javascript">alert("xss")</script>'
      expect(sanitizeHtml(input)).toBe('')
    })

    it('should leave normal HTML unchanged', () => {
      const input = '<div><span>Hello</span></div>'
      expect(sanitizeHtml(input)).toBe(input)
    })

    it('should remove multiple script tags', () => {
      const input = '<script>evil1</script><p>safe</p><script>evil2</script>'
      expect(sanitizeHtml(input)).toBe('<p>safe</p>')
    })
  })

  describe('sanitizeInput', () => {
    it('should escape HTML entities', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      )
    })

    it('should return empty string for null', () => {
      expect(sanitizeInput(null)).toBe('')
    })

    it('should return empty string for undefined', () => {
      expect(sanitizeInput(undefined)).toBe('')
    })

    it('should return the same string when no special characters', () => {
      expect(sanitizeInput('hello world')).toBe('hello world')
    })
  })

  describe('validateString', () => {
    it('should fail required check for empty string', () => {
      const result = validateString('', { required: true })
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should fail required check for null', () => {
      const result = validateString(null, { required: true })
      expect(result.isValid).toBe(false)
    })

    it('should pass required check for non-empty string', () => {
      const result = validateString('hello', { required: true })
      expect(result.isValid).toBe(true)
    })

    it('should fail minLength check', () => {
      const result = validateString('ab', { minLength: 3 })
      expect(result.isValid).toBe(false)
    })

    it('should pass minLength check', () => {
      const result = validateString('abc', { minLength: 3 })
      expect(result.isValid).toBe(true)
    })

    it('should fail maxLength check', () => {
      const result = validateString('abcde', { maxLength: 3 })
      expect(result.isValid).toBe(false)
    })

    it('should fail pattern check', () => {
      const result = validateString('abc', { pattern: /^\d+$/ })
      expect(result.isValid).toBe(false)
    })

    it('should use custom message when provided', () => {
      const result = validateString('', { required: true, message: 'Custom required message' })
      expect(result.error).toBe('Custom required message')
    })

    it('should pass custom check when it returns true', () => {
      const result = validateString('ok', { custom: () => true })
      expect(result.isValid).toBe(true)
    })

    it('should fail custom check when it returns false', () => {
      const result = validateString('bad', { custom: () => false })
      expect(result.isValid).toBe(false)
    })

    it('should use custom check returned string as error', () => {
      const result = validateString('bad', { custom: () => 'custom error msg' })
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('custom error msg')
    })
  })

  describe('validateNumber', () => {
    it('should fail required check for undefined', () => {
      const result = validateNumber(undefined, { required: true })
      expect(result.isValid).toBe(false)
    })

    it('should fail required check for NaN string', () => {
      const result = validateNumber('not-a-number', { required: true })
      expect(result.isValid).toBe(false)
    })

    it('should pass required check for valid number', () => {
      const result = validateNumber(42, { required: true })
      expect(result.isValid).toBe(true)
    })

    it('should fail min check', () => {
      const result = validateNumber(5, { min: 10 })
      expect(result.isValid).toBe(false)
    })

    it('should fail max check', () => {
      const result = validateNumber(15, { max: 10 })
      expect(result.isValid).toBe(false)
    })

    it('should pass when value is within min/max range', () => {
      const result = validateNumber(5, { min: 1, max: 10 })
      expect(result.isValid).toBe(true)
    })

    it('should parse string numbers correctly', () => {
      const result = validateNumber('42', { min: 10, max: 50 })
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateEmail', () => {
    it('should validate a correct email', () => {
      expect(validateEmail('test@example.com').isValid).toBe(true)
    })

    it('should fail for missing @', () => {
      expect(validateEmail('testexample.com').isValid).toBe(false)
    })

    it('should fail for missing domain', () => {
      expect(validateEmail('test@').isValid).toBe(false)
    })

    it('should return valid for null (not required)', () => {
      expect(validateEmail(null).isValid).toBe(true)
    })
  })

  describe('validateUrl', () => {
    it('should validate a correct http URL', () => {
      expect(validateUrl('http://example.com').isValid).toBe(true)
    })

    it('should validate a correct https URL', () => {
      expect(validateUrl('https://example.com').isValid).toBe(true)
    })

    it('should fail for non-http URL', () => {
      expect(validateUrl('ftp://example.com').isValid).toBe(false)
    })

    it('should pass for empty string (not required by default)', () => {
      expect(validateUrl('').isValid).toBe(true)
    })
  })

  describe('validateObject', () => {
    it('should validate an object with all valid fields', () => {
      const result = validateObject(
        { name: 'test', age: '25' },
        {
          name: { required: true },
          age: { pattern: /^\d+$/ }
        }
      )
      expect(result.isValid).toBe(true)
    })

    it('should collect errors for multiple invalid fields', () => {
      const result = validateObject(
        { name: '', age: 'abc' },
        {
          name: { required: true },
          age: { pattern: /^\d+$/ }
        }
      )
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBeDefined()
      expect(result.errors.age).toBeDefined()
    })

    it('should return isValid true for empty rules object', () => {
      const result = validateObject({ foo: 'bar' } as Record<string, any>, {} as any)
      expect(result.isValid).toBe(true)
    })
  })
})
