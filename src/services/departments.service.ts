import api from './api.service'
import type { ApiResponse, Department } from '@/types'
import { AbilityService } from './abilities.service'
import type { Actions } from '@/types'

interface CreateDepartmentPayload {
  facilityId: string
  name: string
  description?: string
  headOfDepartment: string
}

export class DepartmentsService {
  private static instance: DepartmentsService
  private ability = AbilityService.getInstance()

  static getInstance(): DepartmentsService {
    if (!DepartmentsService.instance) {
      DepartmentsService.instance = new DepartmentsService()
    }
    return DepartmentsService.instance
  }

  async getDepartments(facilityId: string): Promise<ApiResponse<Department[]>> {
    if (!this.ability.can('read', 'departments')) {
      throw new Error('Unauthorized to view departments')
    }
    return api.get<ApiResponse<Department[]>>(`/departments?facilityId=${facilityId}`)
      .then(response => response.data)
  }

  async createDepartment(data: CreateDepartmentPayload): Promise<ApiResponse<Department>> {
    if (!this.ability.can('create', 'departments')) {
      throw new Error('Unauthorized to create departments')
    }
    return api.post<ApiResponse<Department>>('/departments', data)
      .then(response => response.data)
  }

  async updateDepartment(id: string, data: Partial<CreateDepartmentPayload>): Promise<ApiResponse<Department>> {
    if (!this.ability.can('update', 'departments')) {
      throw new Error('Unauthorized to update departments')
    }
    return api.patch<ApiResponse<Department>>(`/departments/${id}`, data)
      .then(response => response.data)
  }

  async deleteDepartment(id: string): Promise<ApiResponse<void>> {
    if (!this.ability.can('delete', 'departments')) {
      throw new Error('Unauthorized to delete departments')
    }
    return api.delete<ApiResponse<void>>(`/departments/${id}`)
      .then(response => response.data)
  }

  async getDepartmentStats(id: string): Promise<ApiResponse<any>> {
    if (!this.ability.can('read', 'departments')) {
      throw new Error('Unauthorized to view department statistics')
    }
    return api.get<ApiResponse<any>>(`/departments/${id}/stats`)
      .then(response => response.data)
  }
}

export const departmentsService = DepartmentsService.getInstance()
