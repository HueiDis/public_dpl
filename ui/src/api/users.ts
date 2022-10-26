import request from '@/utils/request'

export const getUserInfo = () =>
  request({
    url: '/user/info',
    method: 'get'
  })

export enum loginMode {
  AD = 1,
  EmployeeID
}

export const login = (data: any) =>
  request({
    url: '/user/login',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/user/logout',
    method: 'post'
  })
