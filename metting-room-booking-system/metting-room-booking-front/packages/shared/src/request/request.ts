import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import Storage from '../utils/Storage'
import { message } from '../components/AntdGlobal'

let refreshing = false
let pendingQueue: { config: AxiosRequestConfig; resolve: (value: unknown) => void }[] = []

const getErrorMessage = (error: AxiosError<IResponse>) => {
  let errorMessage = error.message || '请求失败，请稍后再试'
  if (error.response) {
    errorMessage = error.response.data.message || `请求失败，状态码: ${error.response.status}`
  } else if (error.request) {
    // 没有 response，但是有 request，说明请求发出去了，服务器没有响应
    errorMessage = '没有收到服务器响应，请检查网络连接'
  } else {
    // 在设置请求时发生了错误
    errorMessage = `发生错误: ${error.message}`
  }
  return errorMessage
}

const baseURL = 'http://localhost:3000'

const instance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  timeoutErrorMessage: '请求超时，请待会儿再试',
})

const refreshToken = async () => {
  try {
    const { data } = await axios.post(baseURL + '/user/refreshToken', {
      refreshToken: Storage.get('refreshToken'),
    })
    const { accessToken, refreshToken } = data.data
    Storage.set('token', accessToken)
    Storage.set('refreshToken', refreshToken)
    return data
  } catch (error: unknown) {
    const errorMsg = getErrorMessage(error as AxiosError<IResponse>)
    message.error(errorMsg)
    setTimeout(() => {
      location.href = '/login'
    }, 1000)
    return Promise.reject(new Error(errorMsg))
  } finally {
    refreshing = false
  }
}

// 处理 pendingQueue 中的请求
const precessPendingQueue = () => {
  pendingQueue.forEach(({ config, resolve }) => {
    resolve(instance(config))
  })
  pendingQueue.length = 0
  pendingQueue = []
}

instance.interceptors.request.use(
  (config) => {
    const token = Storage.get('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    const errorMsg = getErrorMessage(error)
    return Promise.reject(new Error(errorMsg))
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse<IResponse>) => {
    const responseData = response.data
    // 直接返回后端核心数据（假设后端返回 { code: 200, data: { ... } }）
    return responseData.data
  },
  async (error) => {
    if (refreshing) {
      return new Promise((resolve) => {
        pendingQueue.push({
          config: error.config,
          resolve,
        })
      })
    }

    if (error.status === 401 && !error.config.url.includes('/user/refreshToken')) {
      refreshing = true
      const { data } = await refreshToken()
      refreshing = false

      // 重新发送 pendingQueue 中的请求,清空队列
      precessPendingQueue()

      // 更新当前请求的token并重试
      error.config.headers['Authorization'] = `Bearer ${data.accessToken}`
      return instance(error.config)
    } else {
      let errorMessage = error.message || '请求失败，请稍后再试'
      if (error.response) {
        errorMessage = error.response.data.message
      } else if (error.request) {
        // 没有 response，但是有 request，说明请求发出去了，服务器没有响应
        errorMessage = '服务无响应'
      }

      message.error(errorMessage)
      return Promise.reject(new Error(errorMessage))
    }
  }
)

const get = <T>(url: string, params?: unknown): Promise<T> => {
  return instance.get(url, { params })
}

const post = <T>(url: string, data?: unknown): Promise<T> => {
  return instance.post(url, data)
}
const put = <T>(url: string, data?: unknown): Promise<T> => {
  return instance.put(url, data)
}

export default {
  get,
  post,
  put,
}
