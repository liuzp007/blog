import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('基础测试框架验证', () => {
  it('Vitests 正确配置', () => {
    expect(true).toBe(true)
  })

  it('测试环境可以渲染 React 组件', () => {
    const TestComponent = () => <div>测试内容</div>
    render(<TestComponent />)
    expect(screen.getByText('测试内容')).toBeInTheDocument()
  })
})
