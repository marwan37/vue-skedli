import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async updateAvatar(formData: FormData) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/users/avatar', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })
        if (!response.ok) throw new Error('Failed to update avatar')
        const data = await response.json()
        this.currentUser = { ...this.currentUser!, avatar: data.avatar }
      } catch (e) {
        this.error = (e as Error).message
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteAccount() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/users', {
          method: 'DELETE',
          credentials: 'include',
        })
        if (!response.ok) throw new Error('Failed to delete account')
        this.currentUser = null
      } catch (e) {
        this.error = (e as Error).message
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
