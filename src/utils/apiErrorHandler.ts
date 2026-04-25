export interface ApiError extends Error {
  status?: number
  code?: string
  details?: any
}

export const createApiError = (message: string, status?: number, details?: any): ApiError => {
  const error = new Error(message) as ApiError
  error.status = status
  error.details = details
  return error
}

export const isNetworkError = (error: Error): boolean => {
  return (
    error.name === 'TypeError' ||
    error.message.includes('NetworkError') ||
    error.message.includes('fetch') ||
    error.message.includes('Failed to fetch')
  )
}

export const isTimeoutError = (error: Error): boolean => {
  return (
    error.name === 'AbortError' ||
    error.message.includes('timeout') ||
    error.message.includes('aborted')
  )
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return 'An unknown error occurred'
}

export const getErrorStatus = (error: unknown): number | undefined => {
  if (error && typeof error === 'object' && 'status' in error) {
    return Number(error.status)
  }
  return undefined
}
