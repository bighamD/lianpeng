import axios from 'axios'
import { getToken } from '@/utils/auth'
import qs from 'qs'
import store from '@/store'
import { removeToken } from '@/utils/auth' // 获取url参数

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// 响应拦截器 设置头部
service.interceptors.request.use(
  config => {
    // config.headers['token'] = getToken() ? getToken().token : ''
    // 拦截post请求
    if (config.method === 'post') {
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/x-www-form-urlencoded; charset=UTF-8'
      config.transformRequest = [function(data) {
        if (data instanceof File) {
          var formData = new FormData()
          formData.append('file', data)
          formData.append('token', getToken() ? getToken().token : '')
          formData.append('store_id', getToken() ? getToken().store_id : '')
          return formData
        } else {
          var info
          if (!data) {
            info = {
              token: getToken() ? getToken().token : '',
              store_id: getToken() ? getToken().store_id : ''
            }
          } else {
            if (getToken()) {
              data['token'] = getToken() ? getToken().token : ''
              data['store_id'] = getToken() ? getToken().store_id : ''
            }
            info = data
          }
          return qs.stringify(info)
        }
      }]
    }
    return config
  },
  error => {
    // do something with request error
    console.log('error', error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器 返回内容
service.interceptors.response.use(

  response => {
    if (response.data.code === -2000 || response.data.code === -1000) {
      // 重新授权
      removeToken()
      store.dispatch('user/setAuthUrl', 'https://' + window.location.host + window.location.pathname)
    } else {
      return response
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
