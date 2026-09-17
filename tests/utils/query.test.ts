import { describe, expect, it } from 'vitest'
import { parseQuery } from '@/utils/query'

describe('parseQuery', () => {
  it('非法分页参数回退默认值', () => {
    expect(parseQuery('?page=abc&pageSize=xyz')).toEqual({
      page: 1,
      pageSize: 10,
      sort: 'date_desc'
    })
  })

  it('分页参数会被限制在安全范围内', () => {
    expect(parseQuery('?page=-2&pageSize=999')).toEqual({
      page: 1,
      pageSize: 100,
      sort: 'date_desc'
    })
  })
})
