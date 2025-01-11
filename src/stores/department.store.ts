import { defineStore } from 'pinia'
import type { Department, ApiError, ApiResponse } from '@/types'
import { departmentsService } from '@/services/departments.service'

interface DepartmentState {
  departments: Department[]
  selectedDepartment: Department | null
  loading: boolean
  error: string | null
}

interface CreateDepartmentPayload {
  facilityId: string
  name: string
  description?: string
  headOfDepartment: string
}

export const useDepartmentsStore = defineStore('departments', {
  state: (): DepartmentState => ({
    departments: [],
    selectedDepartment: null,
    loading: false,
    error: null,
  }),

  getters: {
    getDepartmentById: (state) => {
      return (departmentId: string) => state.departments.find(d => d.id === departmentId)
    },

    departmentsByFacility: (state) => {
      return (facilityId: string) =>
        state.departments.filter(d => d.facilityId === facilityId)
    },

    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
  },

  actions: {
    async fetchDepartments(facilityId: string) {
      this.loading = true
      this.error = null
      try {
        const response = await departmentsService.getDepartments(facilityId)
        this.departments = response.data
      } catch (e) {
        const error = e as ApiError
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createDepartment(data: CreateDepartmentPayload) {
      this.loading = true
      this.error = null
      try {
        const response = await departmentsService.createDepartment(data)
        this.departments.push(response.data)
        return response.data
      } catch (e) {
        const error = e as ApiError
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    setSelectedDepartment(department: Department | null) {
      this.selectedDepartment = department
    },

    clearDepartments() {
      this.departments = []
      this.selectedDepartment = null
      this.error = null
    },

    handleError(error: ApiError) {
      this.error = error.message
      this.loading = false
    },
  },
})
