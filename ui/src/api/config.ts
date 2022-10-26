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

export const getConfigList = () =>
  request({
    url: '/config/list',
    method: 'get'
  })

export const getConfigListByGroup = (group: string) =>
  request({
    url: `config/list?group=${group}`,
    method: 'get'
  })

export const getUserConfigs = () =>
  request({
    url: '/user/permission/configs',
    method: 'get'
  })

export const getConfig = (id: string) =>
  request({
    url: `/config/${id}`,
    method: 'get'
  })

export const updateConfig = (id: string, data: any) =>
  request({
    url: `/config/${id}`,
    method: 'patch',
    data
  })

export const createConfig = (id: string, data: any) =>
  request({
    url: `/config/${id}`,
    method: 'post',
    data
  })
