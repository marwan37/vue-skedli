import type { MongoAbility } from '@casl/ability'
import { createMongoAbility } from '@casl/ability'
import type { Actions, AbilityRule } from '@/types'

export type AppAbility = MongoAbility<[Actions, string]>

export class AbilityService {
  private static instance: AbilityService
  private ability: AppAbility | null = null

  static getInstance() {
    if (!AbilityService.instance) {
      AbilityService.instance = new AbilityService()
    }
    return AbilityService.instance
  }

  constructor() {
    this.ability = createMongoAbility<AppAbility>([])
  }

  setAbilities(rules: AbilityRule[]) {
    this.ability = createMongoAbility<AppAbility>(rules)
  }

  can(action: Actions, subject: string, field?: string): boolean {
    if (!this.ability) return false
    return field
      ? this.ability.can(action, subject, field)
      : this.ability.can(action, subject)
  }

  getAbility(): AppAbility | null {
    return this.ability
  }
}

export const abilityService = AbilityService.getInstance()
export const ability = abilityService.getAbility()
