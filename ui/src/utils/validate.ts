import { loginMode } from '@/api/users'

export const isValidUsername = (mode: loginMode, str: string) => {
  return (mode.valueOf() === loginMode.EmployeeID.valueOf() && str.length === 6) || (mode === loginMode.AD.valueOf() && /\w/.test(str))
}

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)
