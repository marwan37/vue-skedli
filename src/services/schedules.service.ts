import type { ApiResponse, CreateScheduleDto, Schedule } from '@/types'
import { AbilityService } from './abilities.service'
import api from './api.service'

interface ScheduleSettings {
  minHoursPerShift: number
  maxHoursPerShift: number
  minHoursPerWeek: number
  maxHoursPerWeek: number
  minRestBetweenShifts: number
  maxConsecutiveDays: number
}

export class SchedulesService {
  private static instance: SchedulesService
  private ability = AbilityService.getInstance()

  static getInstance(): SchedulesService {
    if (!SchedulesService.instance) {
      SchedulesService.instance = new SchedulesService()
    }
    return SchedulesService.instance
  }

  async getSchedules(departmentId: string): Promise<ApiResponse<Schedule[]>> {
    if (!this.ability.can('read', 'schedules')) {
      throw new Error('Unauthorized to view schedules')
    }
    return api.get<ApiResponse<Schedule[]>>(`/schedules?departmentId=${departmentId}`)
      .then(response => response.data)
  }

  async createSchedule(data: CreateScheduleDto): Promise<ApiResponse<Schedule>> {
    if (!this.ability.can('create', 'schedules')) {
      throw new Error('Unauthorized to create schedules')
    }
    return api.post<ApiResponse<Schedule>>('/schedules', data)
      .then(response => response.data)
  }

  async updateSchedule(id: string, data: Partial<CreateScheduleDto>): Promise<ApiResponse<Schedule>> {
    if (!this.ability.can('update', 'schedules')) {
      throw new Error('Unauthorized to update schedules')
    }
    return api.patch<ApiResponse<Schedule>>(`/schedules/${id}`, data)
      .then(response => response.data)
  }

  async deleteSchedule(id: string): Promise<ApiResponse<void>> {
    if (!this.ability.can('delete', 'schedules')) {
      throw new Error('Unauthorized to delete schedules')
    }
    return api.delete<ApiResponse<void>>(`/schedules/${id}`)
      .then(response => response.data)
  }

  async publishSchedule(id: string): Promise<ApiResponse<Schedule>> {
    if (!this.ability.can('update', 'schedules')) {
      throw new Error('Unauthorized to publish schedules')
    }
    return api.post<ApiResponse<Schedule>>(`/schedules/${id}/publish`)
      .then(response => response.data)
  }

  async getScheduleStats(id: string): Promise<ApiResponse<any>> {
    if (!this.ability.can('read', 'schedules')) {
      throw new Error('Unauthorized to view schedule statistics')
    }
    return api.get<ApiResponse<any>>(`/schedules/${id}/stats`)
      .then(response => response.data)
  }

  async validateSchedule(id: string): Promise<ApiResponse<{ violations: string[] }>> {
    if (!this.ability.can('read', 'schedules')) {
      throw new Error('Unauthorized to validate schedules')
    }
    return api.post<ApiResponse<{ violations: string[] }>>(`/schedules/${id}/validate`)
      .then(response => response.data)
  }
}

export const schedulesService = SchedulesService.getInstance()
