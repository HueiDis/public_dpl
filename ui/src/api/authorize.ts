import request from '@/utils/request'

export interface Permission {
  id: string
  actions: string[] // ["INSERT","UPDATE","DELETE","QUERY","DOWNLOAD"]
}

export const getAuthorizeView = (role: string, group: string) =>
  request({
    url: `/authorize/views?role=${role}&group=${group}`,
    method: 'get'
  })

export const alterAuthorizeView = (data: any) =>
  request({
    url: '/authorize/views',
    method: 'post',
    data
  })

export const getAuthorizeConfig = (role: string, group: string) =>
  request({
    url: `/authorize/configs?role=${role}&group=${group}`,
    method: 'get'
  })

export const alterAuthorizeConfig = (data: any) =>
  request({
    url: '/authorize/configs',
    method: 'post',
    data
  })
