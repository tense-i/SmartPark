import axios from 'axios'
import { getTokenInCookie } from './auth'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 过滤掉不需要token的接口
    const token = getTokenInCookie()
    if (token) {
      // 所有请求都要带token
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response.status === 401) {
      Message.error('登录状态无效，请重新登录')
      // 跳转到登录页
      router.push('/login')
      this.$store.commit('user/clearUserInfo')
      return
    }
    debugger
    Message.error(error.response.data.msg)
    console.log('err' + error.response.data)
    return Promise.reject(error)
  }
)

export default service
