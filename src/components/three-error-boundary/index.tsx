import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from 'antd'

interface ThreeErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ThreeErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ThreeErrorBoundary extends Component<
  ThreeErrorBoundaryProps,
  ThreeErrorBoundaryState
> {
  constructor(props: ThreeErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ThreeErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Three.js Error caught:', error, errorInfo)

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d0d] text-white p-5 text-center z-0">
          <div>
            <h3 className="mb-3">3D 渲染遇到问题</h3>
            <p className="text-xs opacity-80">我们遇到了 WebGL 初始化问题。您可以尝试刷新页面或使用现代浏览器。</p>
            <Button type="primary" onClick={() => window.location.reload()} className="mt-4">
              刷新页面
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ThreeErrorBoundary
