import request from '@/utils/request'

export interface ProgramList {
  group: string
  id: string[]
}

export interface Permission {
  id: string
  actions: string[] // ["INSERT","UPDATE","DELETE","QUERY","DOWNLOAD"]
}

export interface GroupPermission {
  group: string
  permissions: Permission[]
}

export interface Field {
  description: string // 欄位描述
  name: string // 欄位名稱
  type: string // 欄位型態
  values: string[] // 固定選項(選擇其一)
  urlTemplate: string // url路徑
  isCondition: boolean // 是否作為查詢條件
  isRequired: boolean // 是否為必要查詢條件
}
export interface QueryField {
  name: string // 欄位名稱
  type: string // 欄位型態
  operator: number // 運算子
  value: string // 數值1
  dateStr?: string // 數值1(日期格式)
  optValue: string // 數值2
  optDateStr?: string // 數值2(日期格式)
  isRequired?: boolean // 是否為必要條件
}

export interface QueryBody {
  fields: QueryField[]
  database: number
  source: string
}
export interface Row {
  columns: string[]
}

export enum OperatorOfQueryString {
  eq = 1,
  ne = 2,
  like = 3,
  nlike = 4,
  gt = 5,
  ge = 6,
  lt = 7,
  le = 8,
  bt = 9,
  nbt = 10
}

export const getViewList = () =>
  request({
    url: '/view/list',
    method: 'get'
  })

export const getViewListByGroup = (group: string) =>
  request({
    url: `view/list?group=${group}`,
    method: 'get'
  })

export const getUserViews = () =>
  request({
    url: '/user/permission/views',
    method: 'get'
  })

export const getViewSchema = (id: string) =>
  request({
    url: `/view/${id}`,
    method: 'get'
  })

export const createViewSchema = (id: string, data: any) =>
  request({
    url: `/view/${id}`,
    method: 'post',
    data
  })

export const modifyViewSchema = (id: string, data: any) =>
  request({
    url: `/view/${id}`,
    method: 'patch',
    data
  })

export const getViewData = (id: string, limit: number, data: any) =>
  request({
    url: `/view/${id}/data?limit=${limit}`,
    method: 'post',
    timeout: 60000,
    data
  })
