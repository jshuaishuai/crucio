export interface PropagationParams {
  page: number
  size: number
  sortField?: string | "useCount" | "createTime" | "updateTime",
  sortBy?: string | "desc" | "asc"
}

export interface PropagationResponse<T> {
  total?: number
  records?: Array<T>
  size?: PropagationParams['size']
  current?: number
  orders?: Array<number>
  pages?: number

  // 后端返回，前端暂时用不上
  optimizeCountSql?: boolean
  searchCount?: boolean
  countId?: any
  maxLimit?: any
}
