// stores/ability.store.ts
import { defineStore } from 'pinia'
import { createMongoAbility } from '@casl/ability'
import type { AppAbility, AbilityRule, Actions, Subjects } from '@/types'

export const useAbilityStore = defineStore('ability', {
  state: () => ({
    ability: createMongoAbility<AppAbility>([])
  }),

  actions: {
    updateAbility(rules: AbilityRule[]) {
      this.ability = createMongoAbility<AppAbility>(rules)
    },

    can(action: Actions, subject: Subjects) {
      return this.ability.can(action, subject)
    },

    cannot(action: Actions, subject: Subjects) {
      return this.ability.cannot(action, subject)
    }
  }
})
