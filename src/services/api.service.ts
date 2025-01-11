import axios from 'axios'
import type { ApiResponse, ApiError, User } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const err: ApiError = {
      message: error.response?.data?.message || 'An error occurred',
      statusCode: error.response?.status || 500,
    }
    return Promise.reject(err)
  }
)

export const authService = {
  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/me')
    return data.data
  },

  async login(email: string, password: string): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>('/login', { email, password })
    return data.data
  },

  async logout(): Promise<void> {
    await api.post('/logout')
  },
}

export default api
