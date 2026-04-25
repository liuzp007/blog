const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE = /^https?:\/\/.+/
const UNSAFE_RE = /<script|javascript:|on\w+\s*=/i
const SCRIPT_TAG_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi

export interface ValidationRule<T = any> {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: T) => boolean | string
  message?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string[]>
}

export const validateString = (
  value: string | undefined | null,
  rules: ValidationRule<string>
): { isValid: boolean; error?: string } => {
  const { required, minLength, maxLength, pattern, custom, message } = rules

  if (required && (!value || value.trim() === '')) {
    return { isValid: false, error: message || '此字段为必填项' }
  }

  if (value && minLength && value.length < minLength) {
    return { isValid: false, error: message || `最少需要 ${minLength} 个字符` }
  }

  if (value && maxLength && value.length > maxLength) {
    return { isValid: false, error: message || `最多允许 ${maxLength} 个字符` }
  }

  if (value && pattern && !pattern.test(value)) {
    return { isValid: false, error: message || '格式不正确' }
  }

  if (value && custom) {
    const result = custom(value)
    if (result !== true) {
      return { isValid: false, error: typeof result === 'string' ? result : message || '验证失败' }
    }
  }

  return { isValid: true }
}

export const validateNumber = (
  value: number | string | undefined | null,
  rules: ValidationRule<number>
): { isValid: boolean; error?: string } => {
  const { required, min, max, custom, message } = rules
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  if (required && (numValue === undefined || numValue === null || isNaN(numValue))) {
    return { isValid: false, error: message || '此字段为必填项' }
  }

  if (numValue !== undefined && numValue !== null && !isNaN(numValue)) {
    if (min !== undefined && numValue < min) {
      return { isValid: false, error: message || `最小值为 ${min}` }
    }

    if (max !== undefined && numValue > max) {
      return { isValid: false, error: message || `最大值为 ${max}` }
    }

    if (custom) {
      const result = custom(numValue)
      if (result !== true) {
        return {
          isValid: false,
          error: typeof result === 'string' ? result : message || '验证失败'
        }
      }
    }
  }

  return { isValid: true }
}

export const validateEmail = (
  email: string | undefined | null
): { isValid: boolean; error?: string } => {
  return validateString(email, {
    pattern: EMAIL_RE,
    message: '请输入有效的邮箱地址'
  })
}

export const validateUrl = (
  url: string | undefined | null
): { isValid: boolean; error?: string } => {
  return validateString(url, {
    pattern: URL_RE,
    message: '请输入有效的URL地址'
  })
}

export const validateObject = <T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, ValidationRule>
): ValidationResult => {
  const errors: Record<string, string[]> = {}

  for (const field in rules) {
    const value = data[field]
    const rule = rules[field]
    const fieldErrors: string[] = []

    let result

    if (typeof value === 'string') {
      result = validateString(value, rule as ValidationRule<string>)
    } else if (typeof value === 'number' || typeof value === 'string') {
      result = validateNumber(value, rule as ValidationRule<number>)
    } else {
      if (rule.custom) {
        const customResult = rule.custom(value)
        if (customResult !== true) {
          fieldErrors.push(
            typeof customResult === 'string' ? customResult : rule.message || '验证失败'
          )
        }
      }
    }

    if (result && !result.isValid && result.error) {
      fieldErrors.push(result.error)
    }

    if (fieldErrors.length > 0) {
      errors[field as string] = fieldErrors
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input) return ''
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export const sanitizeHtml = (html: string): string => {
  return html.replace(SCRIPT_TAG_RE, '')
}

export const isSafeValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return true

  if (typeof value === 'string') {
    return !UNSAFE_RE.test(value)
  }

  if (typeof value === 'object' && value !== null) {
    for (const key in value) {
      if (!isSafeValue((value as Record<string, unknown>)[key])) {
        return false
      }
    }
  }

  return true
}

export const checkBoundaryConditions = (
  value: unknown,
  defaultValue: unknown,
  options: {
    allowNull?: boolean
    allowUndefined?: boolean
    checkNaN?: boolean
    customCheck?: (value: unknown) => boolean
  } = {}
): unknown => {
  const { allowNull = true, allowUndefined = true, checkNaN = true, customCheck } = options

  if (value === undefined && !allowUndefined) {
    return defaultValue
  }

  if (value === null && !allowNull) {
    return defaultValue
  }

  if (typeof value === 'number' && checkNaN && isNaN(value)) {
    return defaultValue
  }

  if (customCheck && !customCheck(value)) {
    return defaultValue
  }

  return value
}
