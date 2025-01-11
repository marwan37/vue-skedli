// services/shifts.service.ts
import type { Shift, ShiftTemplate, ShiftRequirement, ApiResponse } from '@/types'
import api from './api.service'

interface CreateShiftDto {
  scheduleId: string
  templateId: string
  startTime: string
  endTime: string
}

export const shiftsService = {
  async getShifts(scheduleId: string): Promise<ApiResponse<Shift[]>> {
    const { data } = await api.get(`/schedules/${scheduleId}/shifts`)
    return data
  },

  async assignShift(shiftId: string, userId: string): Promise<ApiResponse<Shift>> {
    const { data } = await api.patch<ApiResponse<Shift>>(`/shifts/${shiftId}/assign`, { userId })
    return data
  },

  async createShift(shiftData: CreateShiftDto): Promise<ApiResponse<Shift>> {
    const { data } = await api.post<ApiResponse<Shift>>('/shifts', shiftData)
    return data
  },

  async getShiftTemplates(unitId: string): Promise<ApiResponse<ShiftTemplate[]>> {
    const { data } = await api.get<ApiResponse<ShiftTemplate[]>>(`/units/${unitId}/shift-templates`)
    return data
  },

  async getShiftRequirements(scheduleId: string): Promise<ApiResponse<ShiftRequirement[]>> {
    const { data } = await api.get<ApiResponse<ShiftRequirement[]>>(`/schedules/${scheduleId}/requirements`)
    return data
  },

  async updateShiftRequirement(requirementId: string, shiftRequirementData: Partial<ShiftRequirement>): Promise<ApiResponse<ShiftRequirement>> {
    const { data } = await api.patch<ApiResponse<ShiftRequirement>>(`/requirements/${requirementId}`, shiftRequirementData)
    return data
  },

  async createShiftRequirement(shiftRequirementData: Omit<ShiftRequirement, 'id'>): Promise<ApiResponse<ShiftRequirement>> {
    const { data } = await api.post<ApiResponse<ShiftRequirement>>('/requirements', shiftRequirementData)
    return data
  }
}
