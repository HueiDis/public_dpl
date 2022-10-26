import axios from 'axios'
// import { Message } from 'element-ui'
import { UserModule } from '@/store/modules/user'

// to avoid Property 'content' does not exist on type 'AxiosResponse<any>'.Vetur(2339)
declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 15000 // time out after 15 seconds
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    const method = config.method ?? '' // set method to '' if its undefined
    const headers = {
      ...config.headers.common,
      ...config.headers[method],
      ...config.headers
    };

    ['common', 'get', 'post', 'head', 'put', 'patch', 'delete'].forEach(header => {
      delete headers[header]
    })

    const printable = `[axios] ${new Date()} | Request: ${method.toUpperCase()} | ${config.url} | ${JSON.stringify(config.data)} | ${JSON.stringify(headers)}`
    console.log('%c %s', 'background:#000; color:yellow;', printable)

    // Add x-api-key header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['x-api-key'] = UserModule.token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
// service.interceptors.response.use(
//   (response) => {
//     // Some example codes here:
//     // code == 20000: success
//     // code == 50001: invalid access token
//     // code == 50002: already login in other place
//     // code == 50003: access token expired
//     // code == 50004: invalid user (user not exist)
//     // code == 50005: username or password is incorrect
//     // You can change this part for your own usage.
//     const res = response.data
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         MessageBox.confirm(
//           'You have been logged out, try to login again.',
//           'Log out',
//           {
//             confirmButtonText: 'Relogin',
//             cancelButtonText: 'Cancel',
//             type: 'warning'
//           }
//         ).then(() => {
//           UserModule.ResetToken()
//           location.reload() // To prevent bugs from vue-router
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return response.data
//     }
//   },
//   (error) => {
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

service.interceptors.response.use(
  (response) => {
    const printable = `[axios] ${new Date()} | Response: ${response.status} | ${JSON.stringify(response.data)}`
    console.log('%c %s', 'background:#000; color:yellow;', printable)
    const { data, status } = response
    if (status !== 200) {
      return Promise.reject(new Error(data.message || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    const { response } = error
    const printable = `[axios] ${new Date()} | Response: ${response.status} | ${JSON.stringify(response.data.message)}`
    console.error('%c %s', 'background:#000; color:yellow;', printable)

    const reason = response.data !== '' ? response.data : `${response.status}: ${response.statusText}` || error
    // TODO: show the simple message
    // Message({
    //   message: reason,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(reason)
  }
)

export default service
