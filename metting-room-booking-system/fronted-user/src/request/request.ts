import axios from 'axios'
import Storage from '@/utils/Storage'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 30000,
  timeoutErrorMessage: '请求超时，请待会儿再试'
})

instance.interceptors.request.use(
  config => {
    const token = Storage.get('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

const get = <T>(url: string, params: any): Promise<T> => {
  return instance.get(url, { params })
}

const post = <T>(url: string, data: any): Promise<T> => {
  return instance.post(url, data)
}
const put = <T>(url: string, data: any): Promise<T> => {
  return instance.put(url, data)
}

export default {
  get,
  post,
  put
}
