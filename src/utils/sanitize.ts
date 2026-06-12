/**
 * Input sanitization utilities
 */

/** Strip HTML tags and encode dangerous characters */
export function sanitizeText(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/** Collapse whitespace and trim */
export function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim()
}

/** Check for obviously malicious patterns */
export function hasMaliciousContent(input: string): boolean {
  const lower = input.toLowerCase()
  return (
    /<script[\s>]/i.test(input) ||
    /javascript:/i.test(lower) ||
    /on\w+\s*=/i.test(input) ||
    /data:text\/html/i.test(lower)
  )
}
