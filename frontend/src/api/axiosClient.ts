import axios from 'axios'
import { getAccessToken } from '../features/services'
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
})

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken()
    if (accessToken) {
      console.log('Access Token:', accessToken)
      config.headers['Authorization'] = `Bearer ${accessToken}`
    } else {
      console.log('No access token found')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosClient