// stores/auth.ts
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { authService } from '@/services/api.service'
import { useAbilityStore } from './ability.store'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchCurrentUser() {
      this.loading = true
      this.error = null
      try {
        const user = await authService.getCurrentUser()
        this.currentUser = user

        const abilityStore = useAbilityStore()
        abilityStore.updateAbility(user.abilities || [])

      } catch (e) {
        this.error = (e as Error).message
        this.currentUser = null
      } finally {
        this.loading = false
      }
    },

    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        this.currentUser = await authService.login(email, password)
        return true
      } catch (e) {
        this.error = (e as Error).message
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await authService.logout()
        this.currentUser = null
      } catch (e) {
        this.error = (e as Error).message
      }
    }
  },
})
