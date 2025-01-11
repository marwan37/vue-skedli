// composables/useAbility.ts
import { storeToRefs } from 'pinia'
import { useAbilityStore } from '@/stores/ability.store'

export function useAbility() {
  const store = useAbilityStore()
  const { ability } = storeToRefs(store)
  return ability
}
