// composables/useFeaturePermissions.ts
import { computed } from 'vue'
import { useAbilityStore } from '@/stores/ability.store'
import { useAuthStore } from '@/stores/auth.store'

export function useFeaturePermissions() {
  const ability = useAbilityStore()
  const authStore = useAuthStore()

  return computed(() => ({
    MANAGE_ALL: authStore.currentUser?.roleId === 'admin',

    ROLES: ability.can('read', 'Role'),

    SCHEDULES: {
      VIEW: ability.can('read', 'Schedule'),
      CREATE: ability.can('create', 'Schedule'),
      EDIT: ability.can('update', 'Schedule'),
      DELETE: ability.can('delete', 'Schedule'),
      MANAGE: ability.can('crud', 'Schedule')
    },

    SHIFTS: {
      VIEW: ability.can('read', 'Shift'),
      ASSIGN: ability.can('update', 'Shift'),
      CREATE: ability.can('create', 'Shift'),
      EDIT: ability.can('update', 'Shift'),
      MANAGE: ability.can('crud', 'Shift')
    },

    SHIFT_TEMPLATES: {
      VIEW: ability.can('read', 'ShiftTemplate'),
      CREATE: ability.can('create', 'ShiftTemplate'),
      EDIT: ability.can('update', 'ShiftTemplate'),
      MANAGE: ability.can('crud', 'ShiftTemplate')
    },

    USERS: {
      VIEW: ability.can('read', 'User'),
      CREATE: ability.can('create', 'User'),
      EDIT: ability.can('update', 'User'),
      MANAGE: ability.can('crud', 'User'),
      MANAGE_OWN: ability.can('update', 'User', authStore.currentUser?.id)
    },

    TIME_OFF_REQUESTS: {
      VIEW: ability.can('read', 'TimeOffRequest'),
      CREATE: ability.can('create', 'TimeOffRequest'),
      APPROVE: ability.can('update', 'TimeOffRequest'),
      MANAGE: ability.can('crud', 'TimeOffRequest')
    },

    DEPARTMENTS: {
      VIEW: ability.can('read', 'Department'),
      CREATE: ability.can('create', 'Department'),
      EDIT: ability.can('update', 'Department'),
      DELETE: ability.can('delete', 'Department'),
      MANAGE: ability.can('crud', 'Department')
    }
  }))
}
