// src/types/api.ts
import type { User } from './user.types'

// DTOs for API requests/responses
export interface LoginDto {
  username?: string
  email?: string
  password: string
}

export interface CreateScheduleDto {
  name: string
  departmentId: string
  startDate: string
  endDate: string
  metadata?: Record<string, unknown>
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  statusCode: number
}

export type LoginValidation = LoginDto & ({ username: string; email?: never } | { email: string; username?: never })
