import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-api-url.com',
})

apiClient.interceptors.request.use(
  (config) => {
    if (
      config.data &&
      typeof config.data === 'object' &&
      config.headers['Content-Type'] !== 'multipart/form-data'
    ) {
      config.data = snakecaseKeys(config.data, { deep: true })
    }
    config.data
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      response.headers['content-type']?.includes('application/json')
    ) {
      response.data = camelcaseKeys(response.data, { deep: true })
    }
    return response
  },
  (error) => Promise.reject(error),
)

export default apiClient
