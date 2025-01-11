import { defineStore } from 'pinia'
import type { Shift, ApiError } from '@/types'
import { shiftsService } from '@/services/shifts.service'

export const useShiftsStore = defineStore('shifts', {
  state: () => ({
    shifts: [] as Shift[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchShifts(scheduleId: string) {
      this.loading = true
      try {
        const response = await shiftsService.getShifts(scheduleId)
        this.shifts = response.data
      } catch (e) {
        const error = e as ApiError
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async assignShift(shiftId: string, userId: string) {
      this.loading = true
      try {
        const response = await shiftsService.assignShift(shiftId, userId)
        const index = this.shifts.findIndex(s => s.id === shiftId)
        if (index !== -1) {
          this.shifts[index] = response.data
        }
      } catch (e) {
        const error = e as ApiError
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createShift(data: Pick<Shift, 'scheduleId' | 'templateId' | 'startTime' | 'endTime'>) {
      this.loading = true
      try {
        const response = await shiftsService.createShift(data)
        this.shifts.push(response.data)
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
