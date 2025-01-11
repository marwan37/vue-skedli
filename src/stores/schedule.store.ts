import { defineStore } from 'pinia'
import type { Schedule, ApiError, CreateScheduleDto } from '@/types'
import { schedulesService } from '@/services/schedules.service'

export const useSchedulesStore = defineStore('schedules', {
  state: () => ({
    schedules: [] as Schedule[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchSchedules(departmentId: string) {
      this.loading = true
      try {
        const response = await schedulesService.getSchedules(departmentId)
        this.schedules = response.data
      } catch (e) {
        const error = e as ApiError
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createSchedule(data: CreateScheduleDto) {
      this.loading = true
      try {
        const response = await schedulesService.createSchedule(data)
        this.schedules.push(response.data)
        return response.data
      } catch (e) {
        const error = e as ApiError
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
